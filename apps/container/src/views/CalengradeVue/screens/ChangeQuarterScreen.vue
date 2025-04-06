<template>
  <div>
    <div>
      <h1 class="change-quarter__title">Selecione um quadrimestre</h1>
      <h2 class="change-quarter__title-subtitle">
        Datas disponíveis no
        <a class="hint" rel="noopener noreferrer" target="_blank" href="https://prograd.ufabc.edu.br/calendarios">
          Calendário acadêmico
        </a>
      </h2>
      <div style="
          margin: 32px 0;
        ">
        <label for="quarter">Quadrimestre</label>
        <select id="quarter" :value="selectedQuarter"
          @change="event => handleQuarterChange(Number((event.target as HTMLSelectElement).value))">
          <option v-for="(q, i) in definedQuarters" :key="i" :value="i">
            {{ q.title }}
          </option>
        </select>

        <label for="startDate">Início</label>
        <input inputmode="numeric" id="startDate" type="date" :value="startDate" :disabled="selectedQuarter !== 0" />

        <label for="endDate">Fim</label>
        <input inputmode="numeric" id="endDate" type="date" :value="endDate" :disabled="selectedQuarter !== 0" />
      </div>
    </div>

    <button class="calengrade-button" @click="goToSummaryScreen">Voltar</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { definedQuarters } from '../../../utils/quarters';

const emit = defineEmits<{
  (e: 'back'): boolean
  (e: 'changeQuarter', quarter: number): boolean
}>();

const selectedQuarter = ref(0);
const startDate = ref('');
const endDate = ref('');

onMounted(() => {
  // Initialize quarter based on current date
  const now = Date.now();
  for (let q = 1; q < definedQuarters.length; q++) {
    const quarterEndDate = new Date(
      `${definedQuarters[q].endDate}T00:00:00.000`,
    );
    if (now > quarterEndDate.getTime()) {
      selectedQuarter.value = q - 1;
      break;
    } else {
      const quarterStartDate = new Date(
        `${definedQuarters[q].startDate}T00:00:00.000`,
      );
      if (now >= quarterStartDate.getTime()) {
        selectedQuarter.value = q;
        break;
      }
    }
  }

  // Initialize start and end dates
  startDate.value = definedQuarters[selectedQuarter.value].startDate;
  endDate.value = definedQuarters[selectedQuarter.value].endDate;
});

const handleQuarterChange = (value: number) => {
  if (value !== 0) {
    startDate.value = definedQuarters[value].startDate;
    endDate.value = definedQuarters[value].endDate;
  }
  selectedQuarter.value = value;
  emit('changeQuarter', value);
};

const goToSummaryScreen = () => {
  emit('back');

};
</script>

<style scoped>
label {
  font-size: 14px;
  font-weight: bold;
  color: #444;
  line-height: 30px;
}

input[type='date']::-webkit-calendar-picker-indicator {
  display: none;
  -webkit-appearance: none;
}

input[type='date']::-webkit-inner-spin-button {
  display: none;
  -webkit-appearance: none;
}

input,
select {
  -webkit-appearance: none;
  appearance: none;
  border: 1px solid #ddd;
  background-color: #fff;
  border-radius: 5px;
  height: 45px;
  padding: 0 15px;
  font-size: 14px;
  cursor: pointer;
  color: #444;
  width: 100%;
  margin-bottom: 8px;
  outline: none;
}

input {
  background-color: #ddd;
}

.calengrade-button {
  border: 0;
  border-radius: 5px;
  width: 100%;
  height: 42px;
  padding: 0 20px;
  font-size: 16px;
  font-weight: bold;
  background: #2e7eed;
  color: #fff;
  cursor: pointer;
}

.calengrade-button:hover {
  background: #0c4594;
}

.change-quarter__title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
  text-align: center;
}

.change-quarter__title-subtitle {
  font-size: 16px;
  font-weight: 400;
  margin-bottom: 16px;
  text-align: center;
}
</style>
