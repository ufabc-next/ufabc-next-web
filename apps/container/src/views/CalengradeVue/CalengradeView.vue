<template>
  <div class="calengrade-page">
    <div class="calengrade-page__container">
      <img src="../../assets/calengrade/calengrade-logo.svg" alt="logo do Calengrade" class="calengrade-logo" />

      <div class="calengrade-page__content">
        <WelcomeScreen v-if="currentStepName === CalengradeSteps.Welcome" @next-step="onNextStep" />
        <SummaryScreen v-else-if="currentStepName === CalengradeSteps.Summary" @next-step="onNextStep" />
        <PreviewScreen v-else-if="currentStepName === CalengradeSteps.Preview" @next-step="onNextStep" />
      </div>

      <h3 class="calengrade-page__footer-credits">
        O Calengrade foi desenvolvido em 2020 por
        <a href="https://link.cariri.tech/calengrade-linkedin">
          Marcelo Farias
        </a>, um ex aluno da UFABC.
      </h3>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import WelcomeScreen from './screens/WelcomeScreen.vue';
import SummaryScreen from './screens/SummaryScreen.vue';
import PreviewScreen from './screens/PreviewScreen.vue';
import { CalengradeSteps } from './types';


const currentStepName = ref<CalengradeSteps>(CalengradeSteps.Welcome);

const onNextStep = (step: CalengradeSteps) => {
  currentStepName.value = step;
};


</script>

<style scoped>
.calengrade-page {
  width: 100%;
}

.calengrade-page__container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  margin: auto;
  width: 100%;
  height: 100%;

  padding: 40px 20px;
  justify-content: space-between;

  background-color: white;
  border-radius: 16px;
}

.calengrade-logo {
  width: 100%;
  max-width: 150px;
  margin-bottom: 16px;
}

.calengrade-page__content {
  width: 100%;
  max-width: 800px;
}

.calengrade-page__footer-credits {
  font-size: 16px;
  font-weight: 400;
  text-align: center;
  margin-top: 24px;
}
</style>