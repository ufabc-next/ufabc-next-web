<template>
  <div>
    <section>
      <h1>
        Adicione sua grade de matérias da UFABC ao seu calendário
      </h1>
      <h2>
        Gratuito e compatível com os principais aplicativos de celular e computador
      </h2>
    </section>

    <img src="../../../assets/calengrade/calendar.svg" alt="Calendário acadêmico" class="calendar-image" />

    <button @click="nextStep">
      Começar
    </button>
  </div>
</template>

<script setup lang="ts">

const emit = defineEmits(['nextStep']);

const nextStep = () => {
  emit('nextStep')
};
</script>

<style scoped>
.calendar-image {
  margin: 32px 0;
}
</style>
