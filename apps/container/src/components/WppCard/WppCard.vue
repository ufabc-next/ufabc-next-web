<template>
  <v-container class="pa-6">
    <v-card class="mx-auto" max-width="340" elevation="2" rounded="xl">
      <v-sheet height="16" :color="props.cardInfo.color" class="rounded-t-xl" />
      <div class="pa-6">
        <v-row justify="space-between" align="center" class="mb-4">
          <v-col cols="auto">
            <v-chip border size="small" variant="outlined" color="" class="text-caption font-weight-medium">
              <b>{{ cardInfo.season }}</b>
            </v-chip>
          </v-col>
          <v-col cols="auto">
            <span class="text-caption text-medium-emphasis">Turma {{ cardInfo.turma }}</span>
          </v-col>
        </v-row>

        <v-card-title class="text-h6 font-weight-bold pa-0 mb-2">
          {{ cardInfo.title }}
        </v-card-title>

        <v-card-subtitle class="pa-0 mb-1 text-body-2 text-medium-emphasis">
          Campus: {{ cardInfo.campus }}
        </v-card-subtitle>
        <v-card-subtitle class="pa-0 mb-6 text-body-2 text-medium-emphasis">
          Prof. {{ cardInfo.professor }}
        </v-card-subtitle>

        <div class="d-flex justify-center">
          <v-btn variant="flat" border class="px-6" append-icon="mdi-open-in-new" :href="cardInfo.link" target="_blank"
            rel="noopener" @click="trackEntrarClick">
            Entrar
          </v-btn>
        </div>
      </div>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import mixpanel from 'mixpanel-browser';
import { PropType } from 'vue';

type wppCardInfo = {
  color: string;
  title: string;
  turma: string;
  campus: string;
  season: string;
  professor: string;
  link: string;
}

const props = defineProps({
  cardInfo: {
    type: Object as PropType<wppCardInfo>,
    required: true,
    default: () => ({
      color: 'primary',
      title: '-',
      turma: '-',
      campus: '-',
      season: '-',
      professor: '-',
      link: '-'
    })
  }
});


// Função para rastrear o clique
function trackEntrarClick() {
  mixpanel.track('Entrar WppCard Click', {
    grupoWpp: 'props',
    userNext: 'true ou false',
    userRA: 'RA do usuário',
  });
}
</script>
