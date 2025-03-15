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

    <button @click="handleClick">
      Começar
    </button>
  </div>
</template>

<script setup lang="ts">
const handleClick = () => {
  console.log('Clicou no botão');
};
</script>

<style scoped>
.calendar-image {
  margin: 32px 0;
}
</style>
