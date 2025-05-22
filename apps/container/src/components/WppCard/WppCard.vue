<template>
  <v-container class="pa-6">
    <v-card class="mx-auto" max-width="340" elevation="2" rounded="xl">
      <v-sheet height="16" :color="props.color" class="rounded-t-xl" />

      <div class="pa-6">
        <v-row justify="space-between" align="center" class="mb-4">
          <v-col cols="auto">
            <v-chip
              border
              size="small"
              variant="outlined"
              color=""
              class="text-caption font-weight-medium"
            >
              <b>2025.2</b>
            </v-chip>
          </v-col>
          <v-col cols="auto">
            <span class="text-caption text-medium-emphasis"
              >Turma A1 - Diurno</span
            >
          </v-col>
        </v-row>

        <v-card-title class="text-h6 font-weight-bold pa-0 mb-2">
          Fenômenos Térmicos
        </v-card-title>

        <v-card-subtitle class="pa-0 mb-1 text-body-2 text-medium-emphasis">
          Campus: Santo André
        </v-card-subtitle>
        <v-card-subtitle class="pa-0 mb-6 text-body-2 text-medium-emphasis">
          Prof. Ana Paula Santos
        </v-card-subtitle>

        <div class="d-flex justify-center">
          <v-btn
            variant="flat"
            border
            class="px-6"
            append-icon="mdi-open-in-new"
            href="#"
            target="_blank"
            rel="noopener"
            @click="trackEntrarClick"
          >
            Entrar
          </v-btn>
        </div>
      </div>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import mixpanel from 'mixpanel-browser';



const props = defineProps({
  color: {
    type: String,
    default: 'primary',
  },
});


// Função para rastrear o clique
function trackEntrarClick() {
  mixpanel.track('Entrar WppCard Click', {
    grupoWpp: 'nome do grupo',
    userNext: 'true ou false', 
    userRA: 'RA do usuário', 
  });
}
</script>
