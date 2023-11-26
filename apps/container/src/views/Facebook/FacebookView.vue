<template>
  <h1>Teste {{ name }}</h1>
</template>

<script setup lang="ts">
import { ref } from 'vue'
console.log('foi?')


const name = ref('joabe')
</script>


  