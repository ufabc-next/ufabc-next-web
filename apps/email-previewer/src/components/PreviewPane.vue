<script setup lang="ts">
defineProps<{
  html?: string;
  width: number;
  isLoading?: boolean;
}>();
</script>

<template>
  <section class="preview-pane">
    <div class="preview-pane__canvas">
      <div
        class="preview-pane__frame"
        :style="{ width: `${width}px`, maxWidth: '100%' }"
      >
        <div v-if="isLoading" class="preview-pane__loading">
          <span class="spinner" aria-hidden="true"></span>
          <p>Carregando visualização…</p>
        </div>

        <template v-else-if="html">
          <iframe
            title="Visualização de e-mail"
            class="preview-pane__iframe"
            sandbox="allow-same-origin"
            :srcdoc="html"
          ></iframe>
        </template>

        <div v-else class="preview-pane__empty">
          <h3>Escolha um modelo para visualizar</h3>
          <p>
            Organize seus arquivos em <code>templates/</code> para renderizar o
            conteúdo aqui.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.preview-pane {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 12px;
  padding: 24px;
  overflow: hidden;
}

.preview-pane__canvas {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex: 1;
  overflow: auto;
  padding: 16px;
  background: linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%);
  border-radius: 20px;
  border: 1px solid #e2e8f0;
}

.preview-pane__frame {
  background-color: #ffffff;
  border-radius: 18px;
  box-shadow:
    0 24px 48px rgba(15, 23, 42, 0.08),
    0 4px 12px rgba(15, 23, 42, 0.04);
  transform-origin: top center;
  transition: width 0.2s ease;
}

.preview-pane__iframe {
  width: 100%;
  height: 720px;
  border: none;
  border-radius: 18px;
}

.preview-pane__loading,
.preview-pane__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 48px;
  text-align: center;
  color: #475569;
}

.preview-pane__empty h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.preview-pane__empty p {
  margin: 0;
  max-width: 320px;
  font-size: 14px;
}

.preview-pane__footer {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px 16px;
  border-radius: 12px;
  background-color: #f1f5f9;
  border: 1px solid #e2e8f0;
  color: #475569;
}

.preview-pane__footer-label {
  font-weight: 600;
  font-size: 13px;
}

.preview-pane__footer-value {
  color: #1e293b;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.preview-pane__footer-variant {
  color: #475569;
  font-weight: 500;
  font-size: 12px;
}

.preview-pane__preview-text {
  margin: 0;
  font-size: 12px;
  color: #64748b;
}

.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid #e2e8f0;
  border-top-color: #1d4ed8;
  border-radius: 9999px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
