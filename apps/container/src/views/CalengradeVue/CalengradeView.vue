<template>
  <div class="calengrade-page">
    <div class="calengrade-page__container">
      <img src="../../assets/calengrade/calengrade-logo.svg" alt="logo do Calengrade" class="calengrade-logo" />

      <div class="calengrade-page__content">
        <component :is="currentStep" @next-step="onNextStep" />
      </div>

      <h3>
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
  height: 100vh;
}

.calengrade-page__container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  max-width: 800px;
  margin: auto;
  width: 100%;
  height: 100%;

  padding: 16px;
  justify-content: space-between;
}
</style>