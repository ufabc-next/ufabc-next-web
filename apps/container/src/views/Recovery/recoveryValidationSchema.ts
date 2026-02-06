import { z } from 'zod';

const UFABC_EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@aluno\.ufabc\.edu\.br$/;

export const recoverySchema = z.object({
  email: z
    .string({
      required_error: 'Este campo é obrigatório',
      invalid_type_error: 'Digite um email válido',
    })
    .email('Formato de email inválido')
    .refine(
      (email) => UFABC_EMAIL_REGEX.test(email),
      'Digite um email UFABC válido (domínio @aluno.ufabc.edu.br)',
    ),
  ra: z.object({
    ra: z.string({
      required_error: 'Este campo é obrigatório',
    }).min(1, 'RA é obrigatório'),
    confirm: z.string({
      required_error: 'Este campo é obrigatório',
    }).min(1, 'Confirmação de RA é obrigatória'),
  }).refine((data) => data.ra === data.confirm, {
    message: 'Os RAs não conferem',
    path: ['confirm'],
  }),
});
