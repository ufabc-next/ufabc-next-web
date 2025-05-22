<template>
  <WppBanner></WppBanner>
  <WppRAInput></WppRAInput> //aqui falta arrumar o fato que o modal aparece por 0.5s ao entrar na tela
  <WppCard></WppCard>
</template>

<script setup lang="ts">
import { WppCard } from '@/components/WppCard';
import { WppBanner } from '@/components/WppBanner';
import { WppRAInput } from '@/components/WppRAInput';
</script>
