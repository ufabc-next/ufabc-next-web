<template>
  <div class="meu-layout">
    <PerformanceCard :cr="4.0" title="Seu maior CR até hoje">
      <v-icon
        class="mb-1 mdi theme--light mdi-chart-line-variant text-ufabcnext-green"
      >
      </v-icon>
    </PerformanceCard>
    <PerformanceCard :cr="103" title="Possuem um CR muito próximo ao seu">
      <v-icon
        class="mb-1 mdi theme--light mdi-chart-bell-curve text-ufabcnext-blue"
      >
      </v-icon>
    </PerformanceCard>
    <PerformanceCard :cr="4.0" title="Seu melhor quadrimestre">
      <v-icon class="mb-1 mdi theme--light mdi-trophy-outline"> </v-icon>
    </PerformanceCard>
    <PerformanceCard :cr="4.0" title="Quadrimestre com mais créditos">
      <v-icon class="mb-1 mdi theme--light mdi-fire"> </v-icon>
    </PerformanceCard>
  </div>
</template>

<script setup lang="ts">
import PerformanceCard from '@/components/PerformanceCard.vue';
</script>

<style>
.meu-layout {
  display: flex;
  justify-content: space-between;
}
.PerformanceCard {
  flex: 1;
  margin: 10px;
}
</style>
