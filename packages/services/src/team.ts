import { z } from 'zod';
import { api } from './api';

export const teamScheduleSchema = z.object({
  season: z.string(),
  groupURL: z.string().nullable(),
  codigo: z.string(),
  campus: z.enum(['sa', 'sbc']).optional(),
  turma: z.string().optional(),
  turno: z.string().optional(),
  subject: z.string(),
  teoria: z.string().nullable(),
  pratica: z.string().nullable(),
  uf_cod_turma: z.string(),
});

export type TeamScheduleItem = z.infer<typeof teamScheduleSchema>;

export const Team = {
  getSharedSchedule: async (ra: string, season: string) => {
    const response = await api.get<TeamScheduleItem[]>('/entities/enrollments/wpp', {
      params: { ra, season },
    });
    
    // Zod validation (optional but good for strict validation as requested)
    return z.array(teamScheduleSchema).parse(response.data);
  },
};
