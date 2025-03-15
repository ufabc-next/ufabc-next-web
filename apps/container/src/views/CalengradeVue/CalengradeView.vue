<template>
  <div id="calengrade">
    <div class="app">
      <img src="../../assets/calengrade/calengrade-logo.svg" alt="logo do Calengrade" class="calengrade-logo" />

      <div class="content">
        <WelcomeScreen />
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
import WelcomeScreen from './screens/WelcomeScreen.vue';


</script>

<style scoped>
#calengrade {
  height: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background-size: cover;
  -webkit-font-smoothing: antialiased !important;
}

.app {
  flex-grow: 1;
  max-width: 800px;
  margin: auto;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-content: center;
  padding: 16px 16px 16px;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  position: relative;
}

.calengrade-logo {
  width: 100%;
  max-width: 400px;
  max-height: 300px;
}

.content {
  width: 100%;
  background: #fff;
  border-radius: 10px;
  padding: 24px;
  flex-grow: 1;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
</style>