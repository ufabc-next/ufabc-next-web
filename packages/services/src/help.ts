import { api } from './api';

export interface HelpFormData {
  email: string;
  ra: string;
  problemTitle: string;
  problemDescription: string;
}

export interface HelpFormResult {
  success: boolean;
  id?: string;
  url?: string;
}

export const sendHelpForm = async (
  data: HelpFormData,
): Promise<HelpFormResult> => {
  try {
    const { email, ra, problemTitle, problemDescription } = data;


    if (!email || !ra || !problemTitle || !problemDescription) {
      throw new Error('Preencha os campos obrigatórios');
    }

    if (problemTitle.length < 5 || problemTitle.length > 100) {
      throw new Error('O título deve ter entre 5 e 100 caracteres.');
    }

    if (problemDescription.length < 20 || problemDescription.length > 1000) {
      throw new Error('A descrição deve ter entre 20 e 1000 caracteres.');
    }

    const response = await api.post('/help/form', {
      email,
      ra,
      problemTitle,
      problemDescription,
    });

    if (response.status === 201) {
      return { success: true };
    }

    throw new Error('Falha ao criar o cartão de ajuda');
  } catch (error: any) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }

    throw new Error(error.message || 'Failed to send help form');
  }
};
