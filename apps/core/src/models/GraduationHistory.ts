import {
  type InferSchemaType,
  type Model,
  Schema,
  type Types,
  model,
} from 'mongoose';

import {
  academicOwnershipFields,
  addAcademicOwnershipIndexes,
  type AcademicOwnership,
} from './academic-ownership.js';
import type { CoefficientsMap } from './History.js';

const CONCEITOS = ['A', 'B', 'C', 'D', 'O', 'F', '-'] as const;
const POSSIBLE_SITUATIONS = [
  'Repr.Freq',
  'Aprovado',
  'Reprovado',
  'Trt. Total',
  'Apr.S.Nota',
  'Aproveitamento',
] as const;
const CATEGORIES = ['-', 'Opção Limitada', 'Obrigatória'] as const;
const PERIODO = ['1', '2', '3'] as const;

type GraduationHistory = AcademicOwnership & {
  ra: number;
  disciplinas: InferSchemaType<typeof GraduationHistoryDisciplinasSchema>[];
  curso: string;
  grade: string;
  graduation: Types.ObjectId;
  active?: boolean;
  coefficients: Record<number, CoefficientsMap>;
};

type GraduationHistoryModel = Model<GraduationHistory, {}>;

const GraduationHistoryDisciplinasSchema = new Schema(
  {
    periodo: { type: String, required: true, enum: PERIODO },
    codigo: { type: String, required: true },
    disciplina: { type: String, required: true },
    ano: { type: Number, required: true },
    situacao: {
      type: String,
      enum: POSSIBLE_SITUATIONS,
      required: true,
    },
    creditos: { type: Number, required: true },
    categoria: {
      type: String,
      required: true,
      enum: CATEGORIES,
    },
    conceito: {
      type: String,
      enum: CONCEITOS,
      required: true,
    },
    identifier: { type: String, required: false, default: null },
  },
  { _id: false }
);

const graduationHistorySchema = new Schema<
  GraduationHistory,
  GraduationHistoryModel
>(
  {
    ...academicOwnershipFields,
    ra: {
      type: Number,
      required: true,
    },
    active: { type: Boolean, default: true },
    coefficients: Object,

    disciplinas: [GraduationHistoryDisciplinasSchema],

    curso: { type: String, required: true },
    grade: { type: String, required: true },
    graduation: {
      type: Schema.Types.ObjectId,
      ref: 'graduation',
    },
  },
  { timestamps: true }
);

export type { GraduationHistory };
addAcademicOwnershipIndexes(graduationHistorySchema);

export const GraduationHistoryModel = model<
  GraduationHistory,
  GraduationHistoryModel
>('historiesgraduations', graduationHistorySchema);
