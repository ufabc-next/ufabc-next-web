<script setup lang="ts">
import { computed } from 'vue';

import {
  EmailButton,
  EmailFooter,
  EmailHeader,
  EmailLayout,
} from '../components';

const props = withDefaults(
  defineProps<{
    userName?: string;
    confirmationUrl: string;
  }>(),
  {
    userName: '',
  },
);

const previewText = computed(
  () => `Bem-vindo ao UFABC Next! Confirme sua conta para começar.`,
);

const contentStyle = {
  padding: '48px 32px',
  textAlign: 'center' as const,
};

const titleStyle = {
  margin: '0 0 16px',
  fontSize: '28px',
  lineHeight: '36px',
  fontWeight: '700',
  color: '#1e293b',
};

const highlightStyle = {
  color: '#3b82f6',
};

const descriptionStyle = {
  margin: '0 0 32px',
  fontSize: '16px',
  lineHeight: '24px',
  color: '#64748b',
  maxWidth: '480px',
  marginLeft: 'auto',
  marginRight: 'auto',
};

const buttonContainerStyle = {
  margin: '0 0 32px',
};
</script>

<template>
  <EmailLayout :preview-text="previewText">
    <EmailHeader />

    <div :style="contentStyle">
      <h1 :style="titleStyle">
        Bem-vindo ao<br />
        <span :style="highlightStyle">UFABC Next !</span>
      </h1>

      <p :style="descriptionStyle">
        Para confirmar sua conta e ter acesso a todas funcionalidades do
        sistema, clique no botão abaixo
      </p>

      <div :style="buttonContainerStyle">
        <EmailButton :href="confirmationUrl" label="Confirmar conta" />
      </div>
    </div>

    <EmailFooter />
  </EmailLayout>
</template>
