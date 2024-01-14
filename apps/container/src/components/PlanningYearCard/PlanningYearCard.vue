<template>
  <v-card class="planning-year-card align-center" style="overflow: auto;">
  <v-card-text class="year">
      <p>{{ props.index + 1 }}° ano</p>
  </v-card-text>
  <template v-for="date in props.quadrimestres" :key="date">
    <div class="row">
      <div class="caixa quad">
        <h1 class="larger-text font-weight-bold">{{ date }}° QUAD</h1>
        <h3>{{ props.year }}.{{ date }}</h3>
        <h5>17 de 17 créditos</h5>
      </div>
      <div v-for="(item, index) in materias?.[Number(`${props.year}${date}`)]" :key="item" class="caixa materia" :style="{ gridColumn: (index) + 2 }" draggable="true">
        <p>Código</p>
        <p class="disci">{{ item.disciplina }}</p>
      </div>
    </div>
  </template>
  </v-card>
</template>


<script setup lang="ts">
// import { PlanningQuadCard } from '@/components/PlanningQuadCard';
const props = defineProps<{
  value: string | number;
  index: number;
  year: number;
  quadrimestres: string;
  color: string;
  materias: string;
}>();

</script>

<style lang="scss" scoped>
.row {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  justify-content: start;
}
.quad {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.quad,
.materia {
  flex: 0 0 100px;
  margin: 3px;
  font-weight: bold;
}
.disci {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.planning-year-card {
  padding: 20px; /* Correspondente a pa-5 */
  border-radius: 0.5rem; /* Correspondente a rounded-lg */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 10px 0px 10px 0px;
}

.year {
  background-color: #07060686;
  border-radius: 0.5rem;
  width: 7%;
  text-align: center;
  color: white;
  padding: 3px;
  margin-left: 4px;
}
p {
text-align: center;
}
.caixa {
  flex: 1;
  width: 200px;
  height: 120px;
  display: flex;
  flex-direction: column;
  padding: 0px 5px 0px 5px;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 3px;
}
.quad {
  background-color: purple;
  color: white;
}
.materia {
  background-color: #7fd37486;
  border: 2px solid rgb(0, 126, 0); /* apenas para visualização */
}
.caixa:hover {
  transform: scale(1.05);
}
</style>