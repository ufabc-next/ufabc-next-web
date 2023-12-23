<template>
  <v-card class="planning-Quad-card align-center purple-background">
    <div class="d-flex align-center justify-center">
      <v-card-text class="white-text text-center">
        <p class="larger-text font-weight-bold mb-2">{{ props.quadri }}° QUAD</p>
        <p class="mb-2">{{ props.year }}.{{ props.quadri }}</p>
        <p class="mb-2">17 de 17 créditos</p>
      </v-card-text>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps<{
  quadri: number;
  year: number;
  credits: number;
}>();
</script>

<style lang="scss" scoped>
.planning-Quad-card {
  padding: 0px 5px 0px 5px;
  border-radius: 0.5rem;
  width: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.planning-Quad-card:hover {
  transform: scale(1.05);
}
.purple-background {
  background-color: purple; /* Define o fundo como roxo */
}

.white-text {
  color: white; /* Define a cor do texto como branco */
}

.d-flex {
  display: flex;
}

.align-center {
  align-items: center; /* Alinha verticalmente ao centro */
}

.justify-center {
  justify-content: center; /* Alinha horizontalmente ao centro */
}
.larger-text {
font-size: 24px; /* Ajuste o tamanho da fonte conforme necessário */
}
</style>