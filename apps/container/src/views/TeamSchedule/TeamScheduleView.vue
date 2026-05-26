<template>
  <v-container>
    <v-row class="mb-4">
      <v-col>
        <h1 class="text-h4 font-weight-bold text-primary">Compartilhamento de Grade</h1>
        <p class="text-subtitle-1 text-grey-darken-1">Acesso exclusivo Team Next</p>
      </v-col>
    </v-row>

    <v-card variant="outlined" class="pa-4 mb-6">
      <v-row>
        <v-col cols="12" sm="5">
          <v-text-field
            v-model="ra"
            label="RA do Aluno"
            variant="outlined"
            density="comfortable"
            hide-details
          />
        </v-col>
        <v-col cols="12" sm="5">
          <v-text-field
            v-model="season"
            label="Quadrimestre (Ex: 2026:2)"
            variant="outlined"
            density="comfortable"
            hide-details
          />
        </v-col>
        <v-col cols="12" sm="2" class="d-flex align-center">
          <v-btn
            color="primary"
            block
            height="48"
            @click="refetch()"
            :loading="isLoading"
            prepend-icon="mdi-magnify"
          >
            Buscar
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <v-alert
      v-if="isError"
      type="error"
      variant="tonal"
      class="mb-6"
      closable
    >
      Não foi possível carregar a grade. Verifique o RA e o Quadrimestre.
    </v-alert>

    <v-row v-if="isLoading" justify="center" class="my-10">
      <v-progress-circular indeterminate color="primary" size="64" width="6" />
    </v-row>

    <template v-if="isSuccess && data">
      <v-alert
        v-if="data.length === 0"
        type="info"
        variant="tonal"
        class="mb-6"
      >
        Nenhuma disciplina encontrada para os dados informados.
      </v-alert>

      <v-row>
        <v-col cols="12" md="6" lg="4" v-for="item in data" :key="item.uf_cod_turma">
          <v-card class="h-100 d-flex flex-column hover-elevate transition-swing" elevation="2">
            <v-card-item>
              <template v-slot:title>
                <div class="text-h6 text-truncate" :title="item.subject">{{ item.subject }}</div>
              </template>
              <template v-slot:subtitle>
                {{ item.codigo }} | Turma {{ item.turma || 'N/A' }}
              </template>
            </v-card-item>

            <v-card-text class="flex-grow-1">
              <div class="d-flex align-center mb-2">
                <v-icon size="small" class="mr-2" color="grey">mdi-map-marker</v-icon>
                <span>Campus: <strong class="text-uppercase">{{ item.campus || 'N/A' }}</strong></span>
              </div>
              
              <div class="d-flex align-center mb-2">
                <v-icon size="small" class="mr-2" color="grey">mdi-clock-outline</v-icon>
                <span>Turno: <strong>{{ item.turno || 'N/A' }}</strong></span>
              </div>

              <v-divider class="my-3"></v-divider>

              <div v-if="item.teoria" class="mb-1">
                <v-chip size="small" color="blue" variant="flat" class="mr-2">Teoria</v-chip>
                <span class="text-body-2">{{ item.teoria }}</span>
              </div>
              
              <div v-if="item.pratica">
                <v-chip size="small" color="orange" variant="flat" class="mr-2">Prática</v-chip>
                <span class="text-body-2">{{ item.pratica }}</span>
              </div>
            </v-card-text>

            <v-card-actions class="pa-4 pt-0 mt-auto">
              <v-btn
                v-if="item.groupURL"
                :href="item.groupURL"
                target="_blank"
                color="success"
                variant="flat"
                block
                prepend-icon="mdi-whatsapp"
              >
                Entrar no Grupo
              </v-btn>
              <v-btn
                v-else
                disabled
                block
                variant="tonal"
              >
                Sem link disponível
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { Team } from '@ufabc-next/services';

const ra = ref('11202230754');
const season = ref('2026:2');

const { isLoading, isError, data, isSuccess, refetch } = useQuery({
  queryKey: ['teamSchedule', ra, season],
  queryFn: () => Team.getSharedSchedule(ra.value, season.value),
  enabled: false,
});
</script>

<style scoped>
.hover-elevate:hover {
  transform: translateY(-4px);
}
</style>
