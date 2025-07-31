import { api } from './api';

export interface HelpFormData {
  email: string;
  ra: string;
  problemTitle: string;
  problemDescription: string;
}



export const sendHelpForm = async (
  data: HelpFormData,
): Promise<void> => {
  try {
    const { email, ra, problemTitle, problemDescription } = data;

    if (!email || !ra || !problemTitle || !problemDescription) {
      throw new Error('Missing required fields');
    }

    console.log('Sending help form to backend...');
    console.log('Request data:', data);

    await api.post('/help/form', {
      email,
      ra,
      problemTitle,
      problemDescription,
    });

    console.log('Form sent successfully');

    return;
  } catch (error: any) {
    console.error('Error creating Notion card:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      response: error.response?.data,
    });

    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }

    throw new Error(error.message || 'Failed to send help form');
  }
};
