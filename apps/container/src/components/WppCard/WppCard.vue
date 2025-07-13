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
          <v-btn variant="flat" border class="px-6" append-icon="mdi-whatsapp" :href="cardInfo.link" target="_blank"
            rel="noopener" @click="trackEntrarClickWpp">
            Entrar
          </v-btn>
          <v-btn variant="flat" border class="px-6" :href="'https://discord.gg/7BBzDwRXSg'" target="_blank"
            rel="noopener" @click="trackEntrarClickDiscord">
            <i class="fab fa-discord" style="margin-right: 8px;"></i>
            Entrar
          </v-btn>
        </div>
      </div>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { user } from '@/mocks/users';
import mixpanel from 'mixpanel-browser'
import { PropType } from 'vue';
import { onMounted } from 'vue'


onMounted(() => {
  mixpanel.init('')
})

const usuario = user

function trackEntrarClickDiscord() {
  const horario = new Date().toISOString()
  mixpanel.track('Clique no botão Discord', {
    usuario,
    horario
  })
}


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
</script>
