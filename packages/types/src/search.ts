export type SearchTeacherItem = {
  _id: string;
  name: string;
  updatedAt: string;
  createdAt: string;
  __v: number;
  alias?: string[];
};

export type SearchSubjectItem = {
  _id: string;
  name: string;
  search: string;
  updatedAt: string;
  createdAt: string;
  __v: number;
  creditos: number;
};

export type SearchComponentItem = {
  disciplina_id: string;
  identifier: string;
  season: string;
  alunos_matriculados: number[];
  campus: string;
  ideal_quad: boolean;
  subject: string;
  turma: string;
  turno: string;
  vagas: number;
  requisicoes: number;
  subjectId: string;
  wppGroupLink: string;
};
