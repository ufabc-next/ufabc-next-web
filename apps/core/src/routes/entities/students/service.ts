import { currentQuad } from '@next/utils';
import type { QueryFilter as FilterQuery } from 'mongoose';

import { ComponentModel } from '@/models/Component.js';
import { HistoryModel } from '@/models/History.js';
import { StudentModel, type Student } from '@/models/Student.js';
import type { UpdatedStudent } from '@/schemas/entities/students.js';
import { academicAccessFilter } from '@/services/academic-access.js';
import { logger } from '@/utils/logger.js';
import { findRaByLogin } from '@/utils/resolve-student-ra.js';

export async function getComponentsStudentsStats(
  season: string,
  dataKey: '$before_kick' | '$alunos_matriculados'
) {
  const stats = await ComponentModel.aggregate<{
    studentsNumber: number;
    componentsNumber: number;
  }>([
    { $match: { season } },
    { $unwind: dataKey },
    { $group: { _id: dataKey, count: { $sum: 1 } } },
    { $group: { _id: '$count', studentsNumber: { $sum: 1 } } },
    { $sort: { _id: 1 } },
    {
      $project: {
        _id: 0,
        studentsNumber: 1,
        componentsNumber: '$_id',
      },
    },
  ]);

  return stats;
}

export async function getAllCourses() {
  const courses = await StudentModel.aggregate([
    {
      $match: { active: { $ne: false } },
    },
    {
      $unwind: '$cursos',
    },
    {
      $match: {
        'cursos.id_curso': {
          $ne: null,
        },
      },
    },
    {
      $project: {
        'cursos.id_curso': 1,
        'cursos.nome_curso': {
          $trim: {
            input: '$cursos.nome_curso',
          },
        },
      },
    },
    {
      $group: {
        _id: '$cursos.nome_curso',
        ids: {
          $addToSet: '$cursos.id_curso',
        },
      },
    },
    {
      $project: {
        _id: 0,
        names: '$_id',
        UFCourseIds: '$ids',
      },
    },
  ]);

  return courses;
}

export async function getStudent(filter: FilterQuery<Student>, userId: string) {
  const season = currentQuad();
  const student: Student | null = await StudentModel.findOne({
    ...filter,
    ...(await academicAccessFilter(userId, true)),
    season,
    active: { $ne: false },
  }).lean();

  return student;
}

export async function getGraduation(userId: string, name: string) {
  const history = await HistoryModel.findOne({
    ...(await academicAccessFilter(userId)),
    curso: name,
    active: { $ne: false },
  }).sort({
    updatedAt: -1,
  });

  return history;
}

type UpdateStudent = {
  userId: string;
  ra: number | null;
  login: string;
  studentId: number | null | undefined;
  graduationId: number | null | undefined;
};

export async function update({
  userId,
  ra,
  login,
  studentId,
  graduationId,
}: UpdateStudent): Promise<UpdatedStudent | null> {
  const season = currentQuad();
  logger.info({ ra, login, studentId, graduationId });

  const resolvedRa = await findRaByLogin(login);

  if (!resolvedRa) {
    return null;
  }

  const student = await StudentModel.findOne({
    ...(await academicAccessFilter(userId, true)),
    ra: resolvedRa,
    season,
    active: { $ne: false },
  });

  if (!student) {
    return null;
  }

  const historyComponents = await HistoryModel.findOne(
    { ...(await academicAccessFilter(userId, true)), active: { $ne: false } },
    { disciplinas: 1, _id: 0 }
  )
    .sort({
      updatedAt: -1,
    })
    .lean();

  if (!historyComponents) {
    return null;
  }

  if (student.aluno_id) {
    const studentObj = student.toJSON<Student>();
    return {
      ra: studentObj.ra,
      studentId: studentObj.aluno_id,
      graduations: studentObj.cursos.map((c) => ({
        ...c,
        components: historyComponents.disciplinas,
      })),
    } as unknown as UpdatedStudent;
  }

  student.aluno_id = studentId;

  // THIS IS WRONG
  for (const curso of student.cursos) {
    curso.id_curso = graduationId;
  }

  await student.save();

  const studentObj = student.toJSON();

  return {
    ra: studentObj.ra,
    studentId: studentObj.aluno_id,
    graduations: studentObj.cursos.map((c) => ({
      ...c,
      components: historyComponents.disciplinas,
    })),
  } as unknown as UpdatedStudent;
}
