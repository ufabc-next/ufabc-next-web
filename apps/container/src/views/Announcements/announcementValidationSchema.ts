import { z } from 'zod';

export const announcementValidationSchema = z.object({
  courseName: z
    .string()
    .min(1, 'Nome do curso é obrigatório')
    .min(3, 'Nome do curso deve ter ao menos 3 caracteres')
    .max(100, 'Nome do curso deve ter no máximo 100 caracteres'),
  announcementText: z
    .string()
    .min(1, 'Texto do anúncio é obrigatório')
    .min(5, 'Texto do anúncio deve ter ao menos 5 caracteres')
    .max(1000, 'Texto do anúncio deve ter no máximo 1000 caracteres'),
});