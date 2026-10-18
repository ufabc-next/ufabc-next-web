<template>
  <div class="archives-page">
    <header class="mb-6">
      <h1 class="text-h5 font-weight-medium">Arquivos</h1>
      <p class="text-body-2 text-medium-emphasis mt-1">
        Arquivos coletados por disciplina e o plano de ensino extraído de cada
        um.
      </p>
    </header>

    <v-card flat border class="rounded-lg">
      <div
        class="toolbar d-flex flex-column flex-sm-row align-sm-center ga-3 pa-4"
      >
        <v-select
          v-model="source"
          :items="sourceOptions"
          label="Origem"
          variant="outlined"
          density="compact"
          hide-details
          clearable
          class="toolbar-select"
        />
        <v-select
          v-model="status"
          :items="statusOptions"
          label="Status"
          variant="outlined"
          density="compact"
          hide-details
          clearable
          class="toolbar-select"
        />
        <v-spacer />
        <span class="text-body-2 text-medium-emphasis">
          {{ total }} {{ total === 1 ? 'arquivo' : 'arquivos' }}
        </span>
      </div>

      <v-progress-linear
        :active="isFetching"
        indeterminate
        height="2"
        color="primary"
      />
      <v-divider />

      <FeedbackAlert
        v-if="isError"
        text="Não foi possível carregar os arquivos."
      />

      <div
        v-if="archives.length === 0 && !isFetching"
        class="empty-state d-flex flex-column align-center text-center pa-12"
      >
        <v-icon size="32" class="text-medium-emphasis mb-3">
          mdi-file-search-outline
        </v-icon>
        <p class="text-body-1 font-weight-medium">Nenhum arquivo encontrado</p>
        <p class="text-body-2 text-medium-emphasis">
          Ajuste os filtros para ver outros arquivos.
        </p>
      </div>

      <v-table v-else hover class="archives-table">
        <thead>
          <tr>
            <th class="text-left">Disciplina</th>
            <th class="text-left d-none d-md-table-cell">Arquivo</th>
            <th class="text-left d-none d-md-table-cell">Origem</th>
            <th class="text-left">Status</th>
            <th class="text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="archive in archives" :key="archive._id">
            <td>
              <template v-if="archive.component">
                <p class="text-body-2 font-weight-medium">
                  {{ archive.component.disciplina }}
                </p>
                <p class="text-caption text-medium-emphasis">
                  <span class="mono">{{ archive.component.codigo }}</span>
                  · {{ archive.component.season }}
                </p>
              </template>
              <span v-else class="text-body-2 text-medium-emphasis">
                Sem disciplina
              </span>
            </td>
            <td class="d-none d-md-table-cell">
              <span v-if="archive.file_name" class="mono file-name">
                {{ archive.file_name }}
              </span>
              <span v-else class="text-medium-emphasis">—</span>
            </td>
            <td class="d-none d-md-table-cell">
              <v-chip size="x-small" variant="tonal" label>
                {{ sourceLabels[archive.source] }}
              </v-chip>
            </td>
            <td>
              <span class="status d-inline-flex align-center text-body-2">
                <span
                  class="status-dot mr-2"
                  :class="statusDotClass[archive.status]"
                />
                {{ statusLabels[archive.status] }}
              </span>
            </td>
            <td class="text-right text-no-wrap">
              <v-btn
                icon="mdi-download-outline"
                size="small"
                variant="text"
                aria-label="Baixar arquivo"
                :disabled="archive.status !== 'stored'"
                @click="downloadArchive(archive._id)"
              />
              <v-btn
                icon="mdi-calendar-text-outline"
                size="small"
                variant="text"
                aria-label="Ver plano de ensino"
                :disabled="!archive.component"
                @click="openPlan(archive.component)"
              />
            </td>
          </tr>
        </tbody>
      </v-table>

      <v-divider />
      <div class="d-flex align-center justify-space-between pa-3">
        <span class="text-body-2 text-medium-emphasis pl-1">
          {{ rangeLabel }}
        </span>
        <div class="d-flex ga-2">
          <v-btn
            size="small"
            variant="outlined"
            class="text-none"
            :disabled="page <= 1"
            @click="page -= 1"
          >
            Anterior
          </v-btn>
          <v-btn
            size="small"
            variant="outlined"
            class="text-none"
            :disabled="page >= pageCount"
            @click="page += 1"
          >
            Próxima
          </v-btn>
        </div>
      </div>
    </v-card>

    <v-dialog v-model="isPlanOpen" max-width="640" scrollable>
      <v-card class="rounded-lg">
        <v-card-item class="pa-6 pb-4">
          <v-card-title class="text-h6 font-weight-medium">
            {{ selectedComponent?.disciplina }}
          </v-card-title>
          <v-card-subtitle>
            <span class="mono">{{ selectedComponent?.codigo }}</span>
            · {{ selectedComponent?.season }}
          </v-card-subtitle>
        </v-card-item>
        <v-divider />
        <v-card-text class="pa-6">
          <CenteredLoading v-if="isPlanLoading" />
          <p v-else-if="!plan" class="text-body-2 text-medium-emphasis">
            Nenhum plano de ensino extraído.
          </p>
          <div v-else>
            <section
              v-for="section in visibleSections"
              :key="section.key"
              class="mb-5"
            >
              <p class="text-caption text-medium-emphasis mb-1">
                {{ section.title }}
              </p>
              <p class="text-body-2">{{ section.text }}</p>
            </section>

            <p class="text-caption text-medium-emphasis mb-2">Cronograma</p>
            <ul class="schedule">
              <li
                v-for="entry in plan.schedule"
                :key="entry.date"
                class="schedule-row d-flex ga-4 py-2 text-body-2"
              >
                <span class="mono schedule-date text-medium-emphasis">
                  {{ entry.date }}
                </span>
                <span>{{ entry.lesson }}</span>
              </li>
            </ul>
          </div>
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-3">
          <v-spacer />
          <v-btn variant="text" class="text-none" @click="isPlanOpen = false">
            Fechar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import type {
  ArchiveComponent,
  ArchiveSource,
  ArchiveStatus,
} from '@next/services';
import { Archives } from '@next/services';
import { useQuery } from '@tanstack/vue-query';
import { computed, ref, watch } from 'vue';

import { CenteredLoading } from '@/components/ui/CenteredLoading';
import { FeedbackAlert } from '@/components/ui/FeedbackAlert';

const PAGE_SIZE = 20;

const sourceLabels: Record<ArchiveSource, string> = {
  cmcc: 'CMCC',
  manual: 'Manual',
  moodle: 'Moodle',
  sigaa: 'SIGAA',
};
const statusLabels: Record<ArchiveStatus, string> = {
  created: 'Criado',
  deleted: 'Removido',
  downloaded: 'Baixado',
  failed: 'Falhou',
  stored: 'Armazenado',
};
const statusDotClass: Record<ArchiveStatus, string> = {
  created: 'bg-warning',
  deleted: 'bg-grey',
  downloaded: 'bg-info',
  failed: 'bg-error',
  stored: 'bg-success',
};

function buildOptions(labels: Record<string, string>) {
  const options = [];
  for (const value of Object.keys(labels)) {
    options.push({ title: labels[value], value });
  }
  return options;
}
const sourceOptions = buildOptions(sourceLabels);
const statusOptions = buildOptions(statusLabels);

const planSections = [
  { key: 'syllabus', title: 'Ementa' },
  { key: 'objectives', title: 'Objetivos' },
  { key: 'methodology', title: 'Metodologia' },
  { key: 'assessment', title: 'Avaliação' },
] as const;

const page = ref(1);
const source = ref<ArchiveSource | null>(null);
const status = ref<ArchiveStatus | null>(null);

watch([source, status], () => {
  page.value = 1;
});

const { data, isFetching, isError } = useQuery({
  queryFn: () =>
    Archives.list({
      page: page.value,
      limit: PAGE_SIZE,
      source: source.value ?? undefined,
      status: status.value ?? undefined,
    }),
  queryKey: ['archives', page, source, status],
});

const archives = computed(() => data.value?.data ?? []);
const total = computed(() => data.value?.total ?? 0);
const pageCount = computed(() =>
  Math.max(1, Math.ceil(total.value / PAGE_SIZE))
);
const rangeLabel = computed(() => {
  if (total.value === 0) {
    return '0 arquivos';
  }
  const first = (page.value - 1) * PAGE_SIZE + 1;
  const last = Math.min(page.value * PAGE_SIZE, total.value);
  return `${first}–${last} de ${total.value}`;
});

const isPlanOpen = ref(false);
const selectedComponent = ref<ArchiveComponent | null>(null);

const { data: plan, isLoading: isPlanLoading } = useQuery({
  queryFn: () => Archives.getPlan(selectedComponent.value!._id),
  queryKey: ['archives', 'plan', computed(() => selectedComponent.value?._id)],
  enabled: computed(() => isPlanOpen.value && selectedComponent.value !== null),
  retry: false,
});

const visibleSections = computed(() => {
  const planning = plan.value?.planning;
  const sections: Array<{ key: string; text: string; title: string }> = [];
  if (!planning) {
    return sections;
  }
  for (const section of planSections) {
    sections.push({
      key: section.key,
      text: planning[section.key],
      title: section.title,
    });
  }
  return sections;
});

const openPlan = (component: ArchiveComponent | null) => {
  selectedComponent.value = component;
  isPlanOpen.value = true;
};

const downloadArchive = async (archiveId: string) => {
  const download = await Archives.getDownload(archiveId);
  window.open(download.url, '_blank', 'noopener');
};
</script>

<style scoped lang="scss">
.toolbar-select {
  max-width: 220px;
}

.archives-table :deep(th) {
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
  font-size: 12px;
  font-weight: 500;
}

.archives-table :deep(td) {
  padding-bottom: 12px;
  padding-top: 12px;
}

.mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 12px;
}

.file-name {
  display: inline-block;
  max-width: 260px;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: bottom;
  white-space: nowrap;
}

.status-dot {
  border-radius: 50%;
  display: inline-block;
  height: 8px;
  width: 8px;
}

.schedule {
  list-style: none;
  margin: 0;
  padding: 0;
}

.schedule-row + .schedule-row {
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.schedule-date {
  font-variant-numeric: tabular-nums;
  min-width: 48px;
}
</style>
