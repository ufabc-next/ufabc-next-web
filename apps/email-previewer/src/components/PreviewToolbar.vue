<script setup lang="ts">
import type { PreviewDevice, VariantOption } from '@ufabc-next/types';
import { computed } from 'vue';

const props = defineProps<{
  devices: PreviewDevice[];
  activeDevice: string;
  variantOptions: VariantOption[];
  activeVariant: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'changeDevice', name: string): void;
  (e: 'changeEmailVariant', id: string): void;
}>();

const DEFAULT_VARIANT_DESCRIPTION =
  'Escolha qual conjunto de dados usar no preview';
const selectedVariantDescription = computed(() => {
  const variant = props.variantOptions.find(
    (variant) => variant.id === props.activeVariant,
  );

  return variant?.description || DEFAULT_VARIANT_DESCRIPTION;
});
</script>

<template>
  <div class="preview-toolbar">
    <div class="preview-toolbar__group">
      <p class="preview-toolbar__label">Dispositivo</p>
      <div class="preview-toolbar__buttons" role="radiogroup">
        <button
          v-for="device in devices"
          :key="device.name"
          :disabled="disabled"
          :aria-pressed="activeDevice === device.name"
          class="preview-toolbar__button"
          role="radio"
          type="button"
          @click="emit('changeDevice', device.name)"
        >
          <span class="preview-toolbar__button-label">{{ device.name }}</span>
          <span class="preview-toolbar__button-meta">{{ device.width }}px</span>
        </button>
      </div>
    </div>

    <div class="preview-toolbar__group">
      <label class="preview-toolbar__label" for="data-variant"
        >Dados de teste</label
      >
      <select
        id="data-variant"
        :disabled="disabled || variantOptions.length === 0"
        class="preview-toolbar__select"
        :value="activeVariant"
        @change="
          emit('changeEmailVariant', ($event.target as HTMLSelectElement).value)
        "
      >
        <option v-if="variantOptions.length === 0" disabled value="">
          Nenhuma variação
        </option>
        <option
          v-for="variant in variantOptions"
          :key="variant.id"
          :value="variant.id"
        >
          {{ variant.label }}
        </option>
      </select>
      <p v-if="variantOptions.length > 0" class="preview-toolbar__helper">
        {{ selectedVariantDescription }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.preview-toolbar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid #e2e8f0;
  background-color: #ffffff;
  min-height: 56px;
  gap: 16px;
}

.preview-toolbar__group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.preview-toolbar__label {
  margin: 0;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #475569;
}

.preview-toolbar__buttons {
  display: inline-flex;
  background-color: #f1f5f9;
  border-radius: 10px;
  padding: 4px;
  gap: 4px;
}

.preview-toolbar__button {
  border: none;
  border-radius: 8px;
  background-color: transparent;
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  min-width: 88px;
  color: #475569;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.preview-toolbar__button[aria-pressed='true'] {
  background-color: #1d4ed8;
  color: #ffffff;
}

.preview-toolbar__button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.preview-toolbar__button-label {
  font-size: 13px;
  font-weight: 600;
}

.preview-toolbar__button-meta {
  font-size: 11px;
  opacity: 0.8;
}

.preview-toolbar__select {
  min-width: 220px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #cbd5f5;
  background-color: #f8fafc;
  color: #0f172a;
  font-size: 13px;
}

.preview-toolbar__select:disabled {
  opacity: 0.6;
}

.preview-toolbar__helper {
  margin: 0;
  font-size: 12px;
  color: #64748b;
}

@media (max-width: 1024px) {
  .preview-toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .preview-toolbar__group {
    width: 100%;
  }

  .preview-toolbar__buttons {
    width: 100%;
  }

  .preview-toolbar__button {
    flex: 1;
    align-items: center;
  }

  .preview-toolbar__select {
    width: 100%;
  }
}
</style>
