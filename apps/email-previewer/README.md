# Visualizador de E-mails

Backoffice app para pré-visualizar e testar templates de e-mail criados com `@vue-email/components`.

## Começando

```bash
yarn dev
```

## Adicionando um Novo Template de E-mail

1. **Crie uma pasta** em `src/templates/` com o nome do seu template

2. **Crie o componente** (`index.vue`):
   Exemplo:

```vue
<script setup lang="ts">
import { EmailLayout, EmailButton } from '../components';

defineProps<{
  userName: string;
  actionUrl: string;
}>();
</script>

<template>
  <EmailLayout>
    <h1>Hello {{ userName }}!</h1>
    <EmailButton :href="actionUrl">Click Here</EmailButton>
  </EmailLayout>
</template>
```

3. **Crie a configuração** (`config.ts`):

```typescript
import type { EmailTemplateConfig } from '../types';
import MyNewEmail from './index.vue';

export const myNewEmailTemplate: EmailTemplateConfig = {
  id: 'my-new-email',
  displayName: 'My New Email',
  description: 'Description of what this email does',
  tags: ['welcome', 'onboarding'],
  component: MyNewEmail,
  variants: [
    {
      id: 'default',
      label: 'Default variant',
      description: 'Standard use case',
      props: {
        userName: 'John Doe',
        actionUrl: 'https://example.com/action',
      },
    },
    {
      id: 'another-variant',
      label: 'Another variant',
      description: 'Edge case or alternative scenario',
      props: {
        userName: 'Jane Smith',
        actionUrl: 'https://example.com/other',
      },
    },
  ],
};
```

4. **Registre-o** em `src/templates/index.ts`:

```typescript
import { myNewEmailTemplate } from './my-new-email/config';

export const emailTemplates: EmailTemplateConfig[] = [
  welcomeEmailTemplate,
  myNewEmailTemplate, // Add your template here
];
```

É isso! Seu template agora aparecerá no visualizador.

## Estrutura de Templates

```
src/templates/
├── index.ts                 # Registry of all templates
├── types.ts                 # TypeScript interfaces
├── utils.ts                 # Render utilities
├── components/              # Reusable email components
│   ├── EmailLayout.vue
│   ├── EmailButton.vue
│   └── ...
└── my-template/            # Your template folder
    ├── index.vue           # Vue component
    └── config.ts           # Configuration & variants
```
