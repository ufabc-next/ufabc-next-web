<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import AppHeader from './components/AppHeader.vue';
import PreviewPane from './components/PreviewPane.vue';
import PreviewToolbar from './components/PreviewToolbar.vue';
import TemplateList from './components/TemplateList.vue';
import { getEmailTemplates } from './templates';
import type { EmailTemplateConfig } from './templates/types';
import { renderEmailTemplate } from './templates/utils';

const templates = getEmailTemplates();

// device state
const DEFAULT_DEVICE_WIDTH = 1200;
const deviceOptions = [
  { name: 'desktop', width: 1200 },
  { name: 'tablet', width: 768 },
  { name: 'mobile', width: 375 },
];
type DeviceName = (typeof deviceOptions)[number]['name'];
const activeDevice = ref<DeviceName>('desktop');
const previewWidth = computed(
  () =>
    deviceOptions.find((device) => device.name === activeDevice.value)?.width ??
    DEFAULT_DEVICE_WIDTH,
);

const changeDevice = (name: string) => {
  activeDevice.value = name as DeviceName;
};

// template state
const isLoading = ref(false);
const selectedVariantId = ref<string>('default');
const selectedTemplateId = ref<string>();
const previewHtml = ref<string>('');

const templateSummaries = computed(() =>
  templates.map(({ id, name, description, tags }) => ({
    id,
    name,
    description,
    tags,
  })),
);

const currentTemplate = computed<EmailTemplateConfig | undefined>(() =>
  templates.find((template) => template.id === selectedTemplateId.value),
);

const variantOptions = computed(() =>
  (currentTemplate.value?.variants ?? []).map((variant) => ({
    id: variant.id,
    label: variant.label,
    description: variant.description,
  })),
);

const currentVariant = computed(() =>
  currentTemplate.value?.variants.find(
    (variant) => variant.id === selectedVariantId.value,
  ),
);

const selectVariant = (variantId: string) => {
  selectedVariantId.value = variantId;
};

// Render HTML when template or variant changes
// todo: refactor later
watch(
  [currentTemplate, selectedVariantId],
  async ([template]) => {
    if (!template) {
      previewHtml.value = '';
      return;
    }

    const variant = template.variants.find(
      (v) => v.id === selectedVariantId.value,
    );
    if (!variant) {
      previewHtml.value = '';
      return;
    }

    isLoading.value = true;
    try {
      const html = await renderEmailTemplate(template.component, variant.props);
      previewHtml.value = html;
    } catch (error) {
      console.error('Failed to render template:', error);
      previewHtml.value = '';
    } finally {
      isLoading.value = false;
    }
  },
  { immediate: true },
);

// Reset variant when template changes
watch(currentTemplate, (template) => {
  if (!template) {
    selectedVariantId.value = 'default';
    return;
  }

  const variantExists = template.variants.some(
    (variant) => variant.id === selectedVariantId.value,
  );
  if (!variantExists) {
    selectedVariantId.value = template.variants[0]?.id ?? 'default';
  }
});
</script>

<template>
  <div class="app">
    <AppHeader />
    <main class="app__body">
      <TemplateList
        :templates="templateSummaries"
        :active-id="selectedTemplateId"
        :is-loading="isLoading"
        @select="selectedTemplateId = $event"
      />

      <section class="app__preview">
        <PreviewToolbar
          :devices="deviceOptions"
          :active-device="activeDevice"
          :variant-options="variantOptions"
          :active-variant="selectedVariantId"
          :disabled="isLoading || !selectedTemplateId"
          @change-device="changeDevice"
          @change-email-variant="selectVariant"
        />

        <PreviewPane
          :html="previewHtml"
          :width="previewWidth"
          :is-loading="isLoading"
        />
      </section>
    </main>
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f8fafc;
}

.app__body {
  display: flex;
  flex: 1;
  min-height: 0;
}

.app__preview {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  background-color: #ffffff;
}
</style>
