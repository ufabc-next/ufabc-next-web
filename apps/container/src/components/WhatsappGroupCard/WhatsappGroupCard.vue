<template>
  <v-container class="pa-6">
    <v-card class="mx-auto" max-width="340" elevation="2" rounded="xl">
      <v-sheet height="16" :color="props.color" class="rounded-t-xl" />
      <div class="pa-6">
        <v-row justify="space-between" align="center" class="mb-4">
          <v-col cols="auto">
            <v-chip border size="small" variant="outlined" color="" class="text-caption font-weight-medium">
              <b>{{ props.season }}</b>
            </v-chip>
          </v-col>
          <v-col cols="auto" v-if="props.turma">
            <span class="text-caption text-medium-emphasis">Turma {{ props.turma }}</span>
          </v-col>
        </v-row>

        <v-card-title class="text-h6 font-weight-bold pa-0 mb-2">
          {{ props.subject }}
        </v-card-title>

        <v-card-subtitle v-if="props.campus" class="pa-0 mb-1 text-body-2 text-medium-emphasis">
          Campus: {{ props.campus }}
        </v-card-subtitle>
        <v-card-subtitle class="pa-0 mb-6 text-body-2 text-medium-emphasis">
          Prof. {{ props.teoria }}
        </v-card-subtitle>

        <div class="d-flex justify-center">
          <v-btn variant="flat" border class="px-6" append-icon="mdi-whatsapp" :href="props.groupUrl" target="_blank"
            rel="noopener">
            Entrar
          </v-btn>
        </div>
      </div>
    </v-card>
  </v-container>
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
</script>
