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

    const response = await api.post('/help/form', {
      email,
      ra,
      problemTitle,
      problemDescription,
    });

    const result = response.data as HelpFormResult;

    if (!result?.success) {
      throw new Error('Falha ao criar o cartão de ajuda');
    }

    return result;
  } catch (error: any) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }

    throw new Error(error.message || 'Failed to send help form');
  }
};
