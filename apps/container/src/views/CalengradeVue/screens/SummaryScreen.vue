<template>
  <div v-if="!isShowingChangeQuarterScreen" class="calengrade-summary">
    <div class="calengrade-summary__container">
      <h1 class="calengrade-summary__title">Cole aqui o seu resumo de disciplinas disponível no</h1>
      <h2 class="calengrade-summary__title-link">
        <a class="hint" rel="noopener noreferrer" target="_blank"
          href="https://matricula.ufabc.edu.br/matricula/resumo">
          Portal de Matrículas
        </a>
      </h2>

      <h3 class="calengrade-summary__quad-label">
        <div>
          <strong>Quadrimestre:</strong> {{ currentQuarter.title }}
          <button @click="showChangeQuarter(true)">
            (<u>alterar</u>)
          </button>
        </div>
      </h3>

      <textarea ref="textareaRef" id="summary" placeholder="Exemplo: 
        BIR0603-15 - Ciência, Tecnologia e Sociedade A1-Noturno (Santo André) - TPI (3 - 0 - 4) - Campus Santo André
        Terça-feira das 21:00 às 23:00 - quinzenal (I)
        Quinta-feira das 19:00 às 21:00 - semanal
        NHT1057-15 - Genética II A-Noturno ..." v-model="summaryText" @input="handleChange(summaryText)"
        style="min-height: 400px; margin: 24px 0 16px" />
      <p :class="message[1] || ''">{{ message[0] || '. . .' }}</p>
    </div>
    <button v-if="summaryText === ''" @click="handlePaste" class="calengrade-button">
      Colar
    </button>
    <button v-else @click="handleClick" class="calengrade-button">
      Gerar Calengrade!
    </button>
  </div>

  <ChangeQuarterScreen @change-quarter="onChangeQuarter" @back="isShowingChangeQuarterScreen = false" v-else />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { definedQuarters } from '../../../utils/quarters';
import { handleSummary } from '../../../utils/summary';
import { CalengradeSteps, Classes } from '../types';
import ChangeQuarterScreen from './ChangeQuarterScreen.vue';

const emit = defineEmits<{
  (e: 'nextStep', step: CalengradeSteps): boolean
}>()

const currentQuarter = ref(definedQuarters[0]);
const classes = ref<Classes>();
const summary = ref<string>('');


function getQuarterFromCurrentDate() {
  const now = Date.now();
  for (let q = 1; q < definedQuarters.length; q++) {
    const quarterEndDate = new Date(
      `${definedQuarters[q].endDate}T00:00:00.000`,
    );
    if (now > quarterEndDate.getTime()) {
      return q - 1;
    } else {
      const quarterStartDate = new Date(
        `${definedQuarters[q].startDate}T00:00:00.000`,
      );
      if (now >= quarterStartDate.getTime()) {
        return q;
      }
    }
  }
  return 0;
}

onMounted(() => {
  const quarter = getQuarterFromCurrentDate();
  currentQuarter.value = definedQuarters[quarter];
});

function onChangeQuarter(quarter: number) {
  currentQuarter.value = definedQuarters[quarter];
}

const textareaRef = ref<HTMLTextAreaElement | null>(null);
const summaryText = ref<string>(summary.value || '');

const message = ref<[string, 'info' | 'error'] | []>([]);
const handleChange = (value: string) => {
  summaryText.value = value;

  if (value === '') {
    message.value = ['Cole seu resumo de disciplinas ;)', 'error'];
  } else if (value.length > 50) {
    const newClasses = handleSummary(value);
    const classesCount = newClasses.length;
    if (classesCount > 0) {
      message.value = [
        `${classesCount} ${classesCount === 1
          ? 'disciplina identificada'
          : 'disciplinas identificadas'
        }`,
        'info',
      ];
      classes.value = newClasses;
      summary.value = value;
    } else {
      message.value = ['Nenhuma disciplina identificada :(', 'error'];
      classes.value = [];
      summary.value = value;
    }
  } else {
    message.value = [];
  }
};

const handleClick = () => {
  if (summaryText.value === '') {
    message.value = ['Cole seu resumo de disciplinas!!!', 'error'];
  } else if ((classes.value || []).length <= 0) {
    message.value = ['Nenhuma disciplina identificada :(', 'error'];
  } else {
    emit('nextStep', CalengradeSteps.Preview);
  }
};

const handlePaste = async () => {
  try {
    textareaRef.value?.focus();
    const copied = await navigator.clipboard.readText();
    summaryText.value = copied;
    handleChange(copied);
  } catch (error) {
    textareaRef.value?.focus();
  }
};

const isShowingChangeQuarterScreen = ref(false);
const showChangeQuarter = (value: boolean) => {
  isShowingChangeQuarterScreen.value = value;
};
</script>

<style scoped>
.calengrade-summary__container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
}

.calengrade-summary__title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
}

.calengrade-summary__title-link {
  font-size: 18px;
  font-weight: 400;
  margin-bottom: 16px;
  text-decoration: underline;
  color: black;
}

.hint {
  color: rgb(29, 29, 29);
}

.calengrade-summary__quad-label {
  font-size: 16px;
  font-weight: 400;
  text-align: center;
  margin-bottom: 8px;
}

textarea {
  width: 100%;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 16px;
  flex-grow: 1;
  margin-bottom: 16px;
}

textarea:focus {
  outline: none;
  border-color: #0000001f;
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
</style>