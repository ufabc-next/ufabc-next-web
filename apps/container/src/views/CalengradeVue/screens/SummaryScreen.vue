<template>
  <div>
    <div class="summary">
      <h1>Cole aqui o seu resumo de disciplinas disponível no</h1>
      <h2>
        <a class="hint" rel="noopener noreferrer" target="_blank"
          href="https://matricula.ufabc.edu.br/matricula/resumo">
          Portal de Matrículas
        </a>
      </h2>

      <h3>
        <div>
          <strong>Quadrimestre:</strong> {{ calengrade.quarter.title }} (
          <button @click="setActiveScreen('quarter')" class="quadri">
            <u>alterar</u>)
          </button>
        </div>
      </h3>

      <textarea ref="textareaRef" id="summary" placeholder="Exemplo: 
        BIR0603-15 - Ciência, Tecnologia e Sociedade A1-Noturno (Santo André) - TPI (3 - 0 - 4) - Campus Santo André
        Terça-feira das 21:00 às 23:00 - quinzenal (I)
        Quinta-feira das 19:00 às 21:00 - semanal
        NHT1057-15 - Genética II A-Noturno ..." v-model="summaryText" @input="handleChange(summaryText)"
        style="min-height: 400px; margin: 32px 0 0" />
      <p :class="message[1] || ''">{{ message[0] || '. . .' }}</p>
    </div>
    <button v-if="summaryText === ''" @click="handlePaste">
      Colar
    </button>
    <button v-else @click="handleClick">
      Gerar Calengrade!
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { definedQuarters } from '../../../utils/quarters';
import { handleSummary } from '../../../utils/summary';
import { reactive } from 'vue';
import { CalengradeInfo } from '../types';

// todo: fazer no component pai desses steps para salvar o estado
const quarter = computed(() => {
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
});

const calengrade = reactive<CalengradeInfo>({
  quarter: {},
  classes: [],
  summary: '',
})

const textareaRef = ref<HTMLTextAreaElement | null>(null);
const summaryText = ref<string>(calengrade.summary || '');
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
      calengrade.classes = newClasses;
      calengrade.summary = value;
    } else {
      message.value = ['Nenhuma disciplina identificada :(', 'error'];
      calengrade.classes = [];
      calengrade.summary = value;
    }
  } else {
    message.value = [];
  }
};

const handleClick = () => {
  if (summaryText.value === '') {
    message.value = ['Cole seu resumo de disciplinas!!!', 'error'];
  } else if ((calengrade.classes || []).length <= 0) {
    message.value = ['Nenhuma disciplina identificada :(', 'error'];
  } else {
    // próxima tela
    console.log("próxima tela!!!!")
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
</script>

<style scoped>
.error {
  color: red;
}

.info {
  color: green;
}

.quadri {
  background: none;
  border: none;
  color: blue;
  cursor: pointer;
  padding: 0;
}
</style>