import type { EmailTemplateConfig } from '../types';
import WelcomeEmail from './index.vue';

export const welcomeEmailTemplate: EmailTemplateConfig = {
  id: 'welcome-email',
  name: 'Boas-vindas',
  description: 'Confirmação de conta do UFABC Next',
  tags: ['boas-vindas', 'ativação'],
  component: WelcomeEmail,
  variants: [
    {
      id: 'default',
      label: 'Padrão',
      description: 'Email de boas-vindas padrão',
      props: {
        confirmationUrl: 'https://google.com', // todo: mudar para url "real"
      },
    },
    {
      id: 'with-name',
      label: 'Com nome de usuário',
      description: 'Incluindo o nome do usuário',
      props: {
        userName: 'John Doe',
        confirmationUrl: 'https://google.com',
      },
    },
  ],
};
