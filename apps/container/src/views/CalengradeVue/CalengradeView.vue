<template>
  <div class="calengrade-page">
    <div class="calengrade-page__container">
      <img src="../../assets/calengrade/calengrade-logo.svg" alt="logo do Calengrade" class="calengrade-logo" />

      <div>
        <component :is="currentStep" @next-step="onNextStep" />
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
import ChangeQuarterScreen from './screens/ChangeQuarterScreen.vue';
import { computed } from 'vue';

// todo: refactor this step logic!!!
const steps = ref([
  WelcomeScreen,
  SummaryScreen,
  PreviewScreen,
  ChangeQuarterScreen,
]);

const currentStepIndex = ref(0);
const currentStep = computed(() => steps.value[currentStepIndex.value]);

const onNextStep = () => {
  currentStepIndex.value += 1;
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

.calengrade-page__footer-credits {
  font-size: 16px;
  font-weight: 400;
  text-align: center;
  margin-top: 8px;
}
</style>