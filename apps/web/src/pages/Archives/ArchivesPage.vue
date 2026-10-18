<template>
  <PaperCard title="Arquivos">
    <div class="d-flex flex-column flex-sm-row ga-4 mt-4 mb-4">
      <v-select
        v-model="source"
        :items="sourceOptions"
        label="Origem"
        density="compact"
        hide-details
        clearable
      />
      <v-select
        v-model="status"
        :items="statusOptions"
        label="Status"
        density="compact"
        hide-details
        clearable
      />
    </div>

    <v-progress-linear v-if="isFetching" indeterminate color="primary" />
    <FeedbackAlert
      v-if="isError"
      text="Não foi possível carregar os arquivos."
    />

    <v-table>
      <thead>
        <tr>
          <th class="text-left">Disciplina</th>
          <th class="text-left">Arquivo</th>
          <th class="text-center">Origem</th>
          <th class="text-center">Status</th>
          <th class="text-left">Criado em</th>
          <th class="text-center">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="archives.length === 0 && !isFetching">
          <td colspan="6" class="text-center py-8">
            Nenhum arquivo encontrado
          </td>
        </tr>
        <tr v-for="archive in archives" :key="archive._id">
          <td>
            <div v-if="archive.component">
              <p class="font-weight-bold">{{ archive.component.disciplina }}</p>
              <p class="text-caption">
                {{ archive.component.codigo }} · {{ archive.component.season }}
              </p>
            </div>
            <span v-else class="text-caption">Sem disciplina</span>
          </td>
          <td>{{ archive.file_name ?? '—' }}</td>
          <td class="text-center">
            <v-chip size="small">{{ archive.source }}</v-chip>
          </td>
          <td class="text-center">
            <v-chip size="small" :color="getStatusColor(archive.status)">
              {{ archive.status }}
            </v-chip>
          </td>
          <td>{{ formatDate(archive.createdAt) }}</td>
          <td class="text-center text-no-wrap">
            <v-btn
              icon="mdi-download"
              size="small"
              variant="text"
              aria-label="Baixar arquivo"
              :disabled="archive.status !== 'stored'"
              @click="downloadArchive(archive._id)"
            />
            <v-btn
              icon="mdi-calendar-text"
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

    <v-pagination
      v-model="page"
      :length="pageCount"
      :total-visible="5"
      class="mt-4"
    />

    <v-dialog v-model="isPlanOpen" max-width="720">
      <v-card>
        <v-card-title>{{ selectedComponent?.disciplina }}</v-card-title>
        <v-card-text>
          <CenteredLoading v-if="isPlanLoading" />
          <p v-else-if="!plan">Nenhum plano de ensino extraído.</p>
          <div v-else>
            <template v-if="plan.planning">
              <div
                v-for="section in planSections"
                :key="section.key"
                class="mb-3"
              >
                <p class="font-weight-bold">{{ section.title }}</p>
                <p>{{ plan.planning[section.key] }}</p>
              </div>
            </template>
            <p class="font-weight-bold">Cronograma</p>
            <v-table density="compact">
              <tbody>
                <tr v-for="entry in plan.schedule" :key="entry.date">
                  <td class="text-no-wrap">{{ entry.date }}</td>
                  <td>{{ entry.lesson }}</td>
                </tr>
              </tbody>
            </v-table>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="isPlanOpen = false">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </PaperCard>
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
import { PaperCard } from '@/components/ui/PaperCard';

const PAGE_SIZE = 20;

const sourceOptions: ArchiveSource[] = ['cmcc', 'moodle', 'manual', 'sigaa'];
const statusOptions: ArchiveStatus[] = [
  'stored',
  'created',
  'downloaded',
  'failed',
  'deleted',
];
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
const pageCount = computed(() =>
  Math.max(1, Math.ceil((data.value?.total ?? 0) / PAGE_SIZE))
);

const isPlanOpen = ref(false);
const selectedComponent = ref<ArchiveComponent | null>(null);

const { data: plan, isLoading: isPlanLoading } = useQuery({
  queryFn: () => Archives.getPlan(selectedComponent.value!._id),
  queryKey: ['archives', 'plan', computed(() => selectedComponent.value?._id)],
  enabled: computed(() => isPlanOpen.value && selectedComponent.value !== null),
  retry: false,
});

const openPlan = (component: ArchiveComponent | null) => {
  selectedComponent.value = component;
  isPlanOpen.value = true;
};

const downloadArchive = async (archiveId: string) => {
  const download = await Archives.getDownload(archiveId);
  window.open(download.url, '_blank', 'noopener');
};

const getStatusColor = (archiveStatus: ArchiveStatus) => {
  if (archiveStatus === 'stored') return 'success';
  if (archiveStatus === 'failed') return 'error';
  return undefined;
};

const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString('pt-BR');
</script>
