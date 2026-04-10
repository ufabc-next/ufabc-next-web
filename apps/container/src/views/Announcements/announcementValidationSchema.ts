import { z } from 'zod';

export const announcementValidationSchema = z.object({
  courseId: z.number({
    required_error: 'Curso é obrigatório',
    invalid_type_error: 'Curso é obrigatório',
  }),
  disciplineName: z
    .string()
    .min(1, 'Nome da disciplina é obrigatório')
    .max(100, 'Nome da disciplina deve ter no máximo 100 caracteres'),
  announcementText: z
    .string()
    .min(1, 'Texto do anúncio é obrigatório')
    .min(5, 'Texto do anúncio deve ter ao menos 5 caracteres')
    .max(1000, 'Texto do anúncio deve ter no máximo 1000 caracteres'),
});
