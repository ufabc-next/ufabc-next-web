import { NextApiConnector } from '@next/connectors/next-api';
import type {
  Component,
  MatriculaStudent,
  SigStudent,
  UpdatedStudent,
} from '@next/connectors/schemas/next-api';
import { storage } from 'wxt/storage';

import { logger } from '@/utils/logger';

import type { Student } from './ufabc-parser';

export type { Component, MatriculaStudent, SigStudent, UpdatedStudent };
export type { Student } from './ufabc-parser';

export type SigHistory = {
  ra: string;
  grade: string;
  course: string;
  components: Array<{
    grade: 'A' | 'B' | 'C' | 'D' | 'O' | 'F' | 'E' | null;
    name: string;
    status: string | null;
    year: string;
    period: '1' | '2' | '3';
    UFCode: string;
    category: 'mandatory' | 'free' | 'limited';
    credits: number;
  }>;
};

export type Grade = 'A' | 'B' | 'C' | 'D' | 'O' | 'F';

export type Distribution = {
  conceito: Grade;
  weight: number;
  count: number;
  cr_medio: number;
  numeric: number;
  numericWeight: number;
  amount: number;
  cr_professor: number;
};

type SubjectDetailedReview = {
  _id: {
    _id: string;
    mainTeacher: string;
  };
  distribution: Distribution[];
  numericWeight: number;
  numeric: number;
  amount: number;
  count: number;
  cr_professor: number;
  cr_medio: number;
  teacher: {
    _id: string;
    name: string;
    alias: string[] | null;
  };
  weight: number;
};

type TeacherDetailedReview = {
  _id: {
    _id: string;
    name: string;
    search: string;
    updatedAt: string;
    createdAt: string;
    __v: number;
    creditos: number;
  };
  distribution: Distribution[];
  numericWeight: number;
  numeric: number;
  amount: number;
  count: number;
  cr_professor: number;
  cr_medio: number;
  weight: number;
};

export type SubjectReview = {
  general: {
    amount: number;
    count: number;
    cr_medio: number;
    cr_professor: number;
    distribution: Distribution[];
    eadCount: number;
    numeric: number;
    numericWeight: number;
  };
  specific: SubjectDetailedReview[];
};

export type TeacherReview = {
  teacher: {
    _id: string;
    name: string;
    alias?: string[];
    updatedAt?: string;
  };
  general: {
    cr_medio: string | null;
    cr_professor: string | null;
    count: number;
    amount: number;
    numeric: number;
    numericWeight: number;
    weight: number;
    distribution: Distribution[];
  };
  specific: TeacherDetailedReview[];
};

const nextApiConnector = new NextApiConnector({
  baseURL: __NEXT_API_BASE_URL__,
});

type AcademicCredential = { accessToken: string; expiresAt: string };
export class AcademicSyncError extends Error {
  override name = 'AcademicSyncError';
}
function credentialKey(login: string) {
  return `local:academic-credential:${encodeURIComponent(__NEXT_API_BASE_URL__)}:${encodeURIComponent(login.trim().toLowerCase())}` as const;
}

async function academicConnector(login?: string) {
  if (login === undefined || login.trim() === '') {
    throw new Error('Sincronize sua sessão no SIGAA para acessar seus dados.');
  }
  const credential = await storage.getItem<AcademicCredential>(
    credentialKey(login)
  );
  if (!credential || Date.parse(credential.expiresAt) <= Date.now()) {
    throw new Error('Sincronize sua sessão no SIGAA para acessar seus dados.');
  }
  return new NextApiConnector({
    baseURL: __NEXT_API_BASE_URL__,
    defaultHeaders: { 'x-academic-token': credential.accessToken },
  });
}

type SyncHistory = {
  sessionId: string;
  viewState: string;
  login: string;
  ra: string;
};

export async function syncHistory(data: SyncHistory) {
  return nextApiConnector.syncHistory(data.sessionId, data.viewState, {
    login: data.login,
    ra: data.ra,
  });
}

export async function syncHistoryV2(data: SyncHistory) {
  const result = await nextApiConnector.syncSigaaStudent(
    {
      login: data.login,
      ra: Number.parseInt(data.ra, 10),
    },
    data.sessionId,
    data.viewState
  );
  const deadline = Date.now() + 5 * 60 * 1000;
  while (Date.now() < deadline) {
    const progress = await nextApiConnector.getAcademicSyncStatus(
      result.data.accessToken
    );
    if (progress.status === 'applied') {
      await storage.setItem<AcademicCredential>(credentialKey(data.login), {
        accessToken: result.data.accessToken,
        expiresAt: result.data.expiresAt,
      });
      return;
    }
    if (progress.status !== 'awaiting') {
      throw new AcademicSyncError(
        'A sincronização não foi confirmada. Verifique sua conta ou entre em contato com o suporte.'
      );
    }
    // eslint-disable-next-line promise/avoid-new -- Adapt the browser timer to await polling.
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 2000);
    });
  }
  throw new AcademicSyncError(
    'A sincronização continua pendente. Acesse o SIGAA novamente mais tarde.'
  );
}

export async function sendResults(results: {
  sessionToken: string | null;
  sessKey: string | null;
}) {
  if (!results.sessionToken || !results.sessKey) {
    logger.warn(
      '[sendResults] Token de sessão ou sessKey inválido(s), abortando envio.'
    );
    return;
  }

  try {
    return await nextApiConnector.sendResults(
      results.sessionToken,
      results.sessKey
    );
  } catch (error) {
    logger.error({ error }, '[sendResults] Erro ao enviar dados');
  }
}

export async function getSubjectReviews(subjectId: string) {
  return (await nextApiConnector.getSubjectReviews(
    subjectId
  )) as unknown as SubjectReview;
}

export async function getTeacherReviews(teacherId: string) {
  return (await nextApiConnector.getTeacherReviews(
    teacherId
  )) as unknown as TeacherReview;
}

export async function getComponents() {
  return nextApiConnector.getEntityComponents();
}

export async function getKicksInfo(kickId: string, studentId?: number) {
  const student = await storage.getItem<{ login: string }>('local:student');
  const connector = await academicConnector(student?.login);
  return await connector.getComponentKicks(kickId, {
    studentId,
  });
}

export async function getStudent(login: string, sessionId: string) {
  const connector = await academicConnector(login);
  return await connector.getStudent(login, sessionId);
}

type SyncMatriculaStudentParams = {
  studentId: number | null;
  login: string | undefined;
  graduationId: number | null;
};

export async function syncMatriculaStudent(
  sessionId: string,
  { studentId, login, graduationId }: SyncMatriculaStudentParams
) {
  const connector = await academicConnector(login);
  await connector.syncMatriculaStudent(sessionId, {
    graduationId: graduationId ?? undefined,
    login,
    studentId: studentId ?? undefined,
  });
}

export async function updateStudent({
  login,
  ra,
  studentId,
  graduationId,
  sessionId,
}: {
  login: string;
  ra: string;
  studentId: number | null;
  graduationId: number | null;
  sessionId: string;
}) {
  const connector = await academicConnector(login);
  return await connector.updateStudent(
    {
      graduationId: graduationId ?? undefined,
      login,
      ra,
      studentId: studentId ?? undefined,
    },
    sessionId
  );
}

export async function getSigStudent(sigStudent: SigStudent, sessionId: string) {
  return (await nextApiConnector.getSigStudent(
    sigStudent,
    sessionId
  )) as unknown as Student;
}
