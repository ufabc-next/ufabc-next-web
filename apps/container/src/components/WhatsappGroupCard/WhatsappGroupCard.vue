<template>
  <div @click="() => handleClick()" class="group-card">
    <div class="card-header">
      <div class="icon-container">
        <v-icon color="white">mdi-book-open-page-variant</v-icon>
      </div>
      <div class="header-content">
        <h3 class="group-name">{{ props.subject }}</h3>
        <div style="display: flex; gap: 16px;">
          <p class="discipline">{{ props.codigo }}</p>
          <p class="discipline">{{ props.turno }}</p>
          <p class="discipline">{{ props.turma }}</p>
        </div>
      </div>
    </div>

    <div class="professor-info">
      <p class="professor-name">Prof. Teoria: {{ props.teoria }}</p>
      <p class="professor-name">Prof. Prática: {{ props.pratica }}</p>
      <p class="semester">{{ props.season }}</p>
    </div>

    <div class="group-metrics">
      <div v-if="props.campus" class="metric">
        <v-icon>mdi-town-hall</v-icon>
        <span>{{ props.campus }}</span>
      </div>
      <div class="metric">
        <svg class="clock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12,6 12,12 16,14" />
        </svg>
        <span>2d</span>
      </div>
    </div>

    <div class="activity-indicator">
      <div class="activity-dot"></div>
      <span class="activity-text">Entrar no grupo</span>
    </div>
  </div>
</template>

<script setup lang="ts">

type WhatsappGroupCardProps = {
  color: string;
  season: string;
  groupUrl: string;
  codigo: string;
  campus?: string;
  turma?: string;
  turno?: string;
  subject: string;
  teoria: string;
  pratica: string;
};

const props = defineProps<WhatsappGroupCardProps>()

const emit = defineEmits<{
  (e: 'click'): void;
}>();

const handleClick = () => {
  emit('click');
};
</script>

<style scoped>
.group-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  padding: 24px;
  cursor: pointer;
  transition: all 200ms ease;
}

.group-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-color: #93c5fd;
  transform: translateY(-4px);
}

.card-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
}

.icon-container {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.book-icon {
  width: 20px;
  height: 20px;
  color: white;
}

.header-content {
  flex: 1;
  min-width: 0;
}

.group-name {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 200ms ease;
}

.group-card:hover .group-name {
  color: #2563eb;
}

.discipline {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.professor-info {
  margin-bottom: 16px;
}

.professor-name {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
  margin: 0 0 4px 0;
}

.semester {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
}

.group-metrics {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: #6b7280;
}

.metric {
  display: flex;
  align-items: center;
  gap: 4px;
}

.users-icon,
.clock-icon {
  width: 16px;
  height: 16px;
}

.activity-indicator {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f3f4f6;
  display: flex;
  align-items: center;
  gap: 8px;
}

.activity-dot {
  width: 8px;
  height: 8px;
  background-color: #10b981;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.activity-text {
  font-size: 12px;
  color: #6b7280;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}
</style>
