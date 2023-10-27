import { ConceptData } from './teachers';

export type SubjectSpecific = {
  _id: { mainTeacher: string | null };
  distribution: ConceptData[];
  numericWeight: number;
  numeric: number;
  amount: number;
  count: number;
  cr_professor: number;
  teacher: {
    alias: [];
    _id: string;
    name: string;
    updatedAt: string;
    createdAt: string;
    __v: number;
  };
  cr_medio: number;
};

export type SubjectInfo = {
  subject: {
    _id: string;
    name: string;
    search: string;
    updatedAt: string;
    createdAt: string;
    __v: number;
    creditos: number;
  };
  general: {
    cr_medio: number;
    cr_professor: number;
    count: number;
    amount: number;
    numeric: number;
    numericWeight: number;
    distribution: ConceptData[];
  };
  specific: SubjectSpecific[];
};
