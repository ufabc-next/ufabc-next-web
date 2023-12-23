<template>
  <v-card class="planning-year-card align-center">
  <v-card-text class="year">
      <p>{{ props.year }}° ano</p>
  </v-card-text>
    <section class="d-flex flex-column mb-4 elevation-2 pa-3 bg-white rounded-lg">
      <div class="grid-container">
          <PlanningQuadCard
          :quadri="1"
          :year="2019"
          :credits="17"
          />
          
        <div class="grid-item">Item 2</div>
        <div class="grid-item">Item 3</div>
        <PlanningQuadCard
          :quadri="2"
          :year="2019"
          :credits="17"
          />
        <div class="grid-item">Item 5</div>
        <div class="grid-item">Item 6</div>
        <PlanningQuadCard
          :quadri="3"
          :year="2019"
          :credits="17"
          />
        <div class="grid-item">Item 8</div>
        <div class="grid-item">Item 9</div>
      </div>
    </section>
    
  </v-card>
</template>


<script setup lang="ts">
import { PlanningQuadCard } from '@/components/PlanningQuadCard';
const props = defineProps<{
  value: string | number;
  year: string;
  icon: string;
  color: string;
}>();

</script>

<style lang="scss" scoped>
.v-progress-linear {
  height: 6px;
  border-radius: 0.25rem;
}
.planning-year-card {
  padding: 20px; /* Correspondente a pa-5 */
  border-radius: 0.5rem; /* Correspondente a rounded-lg */
  width: 100%; /* Correspondente a w-100 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.grid-container {
display: grid;
grid-template-columns: repeat(3, 1fr); /* Define 3 colunas */
gap: 20px; /* Espaçamento entre os itens */
}
.year {
  background-color: #07060686;
}
.grid-item {
background-color: #ddd;
padding: 20px;
text-align: center;
}
.grid-item:hover {
transform: scale(1.05); /* Aumenta o tamanho em 5% */
}
</style>