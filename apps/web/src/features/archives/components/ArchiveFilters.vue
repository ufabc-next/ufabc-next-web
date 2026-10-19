<template>
  <div class="d-flex ga-3">
    <v-select
      :model-value="source"
      :items="sourceOptions"
      label="Origem"
      variant="outlined"
      density="compact"
      hide-details
      clearable
      @update:model-value="emit('update:source', $event)"
    />
    <v-select
      :model-value="status"
      :items="statusOptions"
      label="Status"
      variant="outlined"
      density="compact"
      hide-details
      clearable
      @update:model-value="emit('update:status', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import type { ArchiveSource, ArchiveStatus } from '@next/services';

import {
  buildSelectOptions,
  sourceLabels,
  statusLabels,
} from '../utils/archiveLabels';

defineProps<{
  source: ArchiveSource | null;
  status: ArchiveStatus | null;
}>();

const emit = defineEmits<{
  'update:source': [value: ArchiveSource | null];
  'update:status': [value: ArchiveStatus | null];
}>();

const sourceOptions = buildSelectOptions(sourceLabels);
const statusOptions = buildSelectOptions(statusLabels);
</script>
