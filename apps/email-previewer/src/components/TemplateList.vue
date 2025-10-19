<script setup lang="ts">
import type { EmailTemplateSummary } from '@ufabc-next/types';

defineProps<{
  templates: EmailTemplateSummary[];
  activeId?: string;
  isLoading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'select', id: string): void;
}>();
</script>

<template>
  <aside class="template-sidebar">
    <div class="template-sidebar__header">
      <h2>Modelos</h2>
      <span>{{ templates.length }}</span>
    </div>

    <div class="template-sidebar__list">
      <template v-if="templates.length === 0">
        <div class="template-empty">
          <p>Nenhum template foi criado ainda.</p>
          <p class="template-empty__subtitle">
            Adicione arquivos em <code>templates/</code> para vê-los por aqui.
          </p>
        </div>
      </template>

      <template v-else>
        <button
          v-for="(template, index) in templates"
          :key="template.id"
          :data-template-index="index"
          class="template-card"
          @click="emit('select', template.id)"
        >
          <div class="template-card__meta">
            <p class="template-card__title">{{ template.name }}</p>
            <p class="template-card__subtitle">{{ template.description }}</p>
            <div class="template-card__tags">
              <span
                v-for="tag in template.tags"
                :key="tag"
                class="template-card__tag template-card__tag--muted"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </button>
      </template>
    </div>
  </aside>
</template>

<style scoped>
.template-sidebar {
  width: 320px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e2e8f0;
  background-color: #f8fafc;
}

.template-sidebar__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e2e8f0;
  color: #0f172a;
}

.template-sidebar__header h2 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.template-sidebar__header span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 9999px;
  background-color: #e2e8f0;
  font-size: 12px;
  font-weight: 600;
}

.template-sidebar__list {
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.template-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  text-align: left;
  padding: 16px;
  border: 1px solid transparent;
  border-radius: 12px;
  background-color: #ffffff;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.template-card[aria-selected='true'],
.template-card:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
  outline: none;
}

.template-card:hover {
  transform: translateY(-1px);
  border-color: #cbd5f5;
}

.template-card--loading {
  cursor: default;
  border: 1px solid #e2e8f0;
}

.template-card__icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background-color: #dbeafe;
  color: #1d4ed8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 18px;
}

.template-card__meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: #0f172a;
  flex: 1;
}

.template-card__title {
  margin: 0;
  font-weight: 600;
  font-size: 15px;
}

.template-card__subtitle {
  margin: 0;
  font-size: 13px;
  color: #64748b;
}

.template-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.template-card__tag {
  display: inline-flex;
  align-items: center;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 9999px;
  background-color: #e2e8f0;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.template-card__tag--muted {
  background-color: #f1f5f9;
  color: #64748b;
}

.template-empty {
  text-align: center;
  color: #64748b;
  padding: 24px;
  border: 1px dashed #cbd5f5;
  border-radius: 12px;
  background-color: #ffffff;
}

.template-empty__subtitle {
  font-size: 13px;
  margin-top: 8px;
}

.template-empty code {
  font-family: monospace;
  font-size: 12px;
  background-color: #f1f5f9;
  padding: 2px 6px;
  border-radius: 6px;
}

.skeleton {
  animation: pulse 1.5s ease-in-out infinite;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  border-radius: 8px;
}

.skeleton--icon {
  width: 40px;
  height: 40px;
}

.skeleton--title {
  width: 60%;
  height: 14px;
}

.skeleton--subtitle {
  width: 80%;
  height: 12px;
  margin-top: 8px;
}

@keyframes pulse {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
