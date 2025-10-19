<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    supportEmail?: string;
    websiteUrl?: string;
    copyrightText?: string;
  }>(),
  {
    supportEmail: 'ufabcnext@gmail.com',
    websiteUrl: 'www.ufabcnext.com',
    copyrightText: '© Copyright UFABC Next - Todos os direitos reservados',
  },
);

const containerStyle = {
  backgroundColor: '#f1f5f9',
  padding: '32px 24px',
  textAlign: 'center' as const,
};

const infoSectionStyle = {
  marginBottom: '24px',
};

const infoHeadingStyle = {
  margin: '0 0 12px',
  fontSize: '14px',
  fontWeight: '700',
  color: '#1e293b',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
};

const infoTextStyle = {
  margin: '0',
  fontSize: '14px',
  lineHeight: '20px',
  color: '#64748b',
};

const linkStyle = {
  color: '#64748b',
  textDecoration: 'none',
};

const copyrightStyle = {
  margin: '24px 0 0',
  paddingTop: '24px',
  borderTop: '1px solid #e2e8f0',
  fontSize: '12px',
  lineHeight: '18px',
  color: '#94a3b8',
};

const descriptionStyle = {
  margin: '0 auto 24px',
  maxWidth: '480px',
  fontSize: '14px',
  lineHeight: '22px',
  color: '#64748b',
};
</script>

<template>
  <div :style="containerStyle">
    <div :style="descriptionStyle">
      Sabemos que a vida na UFABC pode se tornar muito complicada, portanto o
      objetivo do Next é te ajudar a planejar melhor sua graduação.
    </div>

    <div :style="infoSectionStyle">
      <p :style="infoHeadingStyle">INFO</p>
      <p :style="infoTextStyle">
        <a :href="`mailto:${supportEmail}`" target="_blank" :style="linkStyle">
          {{ supportEmail }}
        </a>
      </p>
      <p :style="infoTextStyle">
        <a :href="`https://${websiteUrl}`" target="_blank" :style="linkStyle">
          {{ websiteUrl }}
        </a>
      </p>
    </div>

    <p :style="copyrightStyle">
      {{ copyrightText }}
    </p>
  </div>
</template>
