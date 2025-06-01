<template>
  <v-container v-if="isLoading" class="text-center py-10">
    <v-progress-circular indeterminate color="primary" size="40" />
  </v-container>
  <v-container v-if="!isLoading">
    <v-dialog v-model="dialog" persistent max-width="400">
      <v-card>
        <v-card-title class="text-h6 text-center">
          Digite seu RA para continuar
        </v-card-title>

        <v-card-text>
          <v-text-field v-model="ra" label="RA" type="number" outlined dense @keyup.enter="submitRA" />
        </v-card-text>

        <v-card-actions class="justify-center">
          <v-btn color="primary" @click="submitRA">Enviar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>

  <v-row class="mt-6" dense>
    <v-col v-for="(groupInfo, index) in groupsInfo" :key="index" cols="12" sm="6" md="4">
      <WppCard :cardInfo="groupInfo" />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authStore } from 'stores'
import { WppCard } from '../WppCard'

type wppCardInfo = {
  color: string;
  title: string;
  turma: string;
  campus: string;
  season: string;
  professor: string;
  link: string;
}

const router = useRouter()
const dialog = ref(false)

const update = ref(false)
//const error = ref(null) adicionar caso de erro
const isLoading = ref(false)

const ra = ref<number>()

const { isLoggedIn, user, logOut } = authStore.getState()
const groupsInfo = ref<wppCardInfo[]>([])

function checkLoginExpiration() {
  const expirationPeriod = 1 * 24 * 60 * 60
  const currentTime = Math.floor(Date.now() / 1000)
  const expirationTime = user.iat + expirationPeriod

  if (expirationTime < currentTime) {
    logOut()
    router.push('/')
    alert('Sessão expirada. Faça login novamente.')
    return false
  }

  return true
}

function generateUniqueColors(): string[] {
  const baseColors = ['red', 'blue', 'green', 'orange', 'purple', 'indigo', 'pink', 'teal', 'cyan', 'amber']

  const shuffled = baseColors
    .sort(() => 0.5 - Math.random())

  return shuffled
}

function submitRA() {
  if (ra.value) {
    //logica de cadastrar o RA como confirmed = false (do or not?)
    dialog.value = false
    update.value = true
    isLoading.value = true
  } else {
    alert('Por favor, preencha o RA.')
  }
}

watch(update, async () => {
  //logica de pegar as materias do quad atual pelo RA

  await new Promise(resolve => setTimeout(resolve, 2000))

  isLoading.value = false
  const uniqueColors = generateUniqueColors()

  groupsInfo.value = groupsInfo.value = [
    {
      color: uniqueColors[0],
      title: '1',
      turma: '1A',
      campus: 'SA',
      season: '2024:1',
      professor: 'Ana Paula',
      link: 'http://hardcoded-link.com'
    },
    {
      color: uniqueColors[1],
      title: '2',
      turma: '2A',
      campus: 'SA',
      season: '2024:2',
      professor: 'Marcelo Werneck',
      link: 'http://hardcoded-link.com'
    },
    {
      color: uniqueColors[2],
      title: '3',
      turma: '1B',
      campus: 'SA',
      season: '2024:3',
      professor: 'Joao Schmidt',
      link: 'http://hardcoded-link.com'
    },
    {
      color: uniqueColors[3],
      title: '4',
      turma: '2B',
      campus: 'SBC',
      season: '2025:1',
      professor: 'Armando Caputi',
      link: 'http://hardcoded-link.com'
    },
    {
      color: uniqueColors[4],
      title: '5',
      turma: '3B',
      campus: 'SBC',
      season: '2025:2',
      professor: 'Leonardo Manguito',
      link: 'http://hardcoded-link.com'
    },
    {
      color: uniqueColors[5],
      title: '6',
      turma: '3B',
      campus: 'SBC',
      season: '2025:2',
      professor: 'Leonardo Manguito',
      link: 'http://hardcoded-link.com'
    },
    {
      color: uniqueColors[6],
      title: '7',
      turma: '3B',
      campus: 'SBC',
      season: '2025:2',
      professor: 'Leonardo Manguito',
      link: 'http://hardcoded-link.com'
    }
  ]
})

onMounted(() => {
  if (isLoggedIn() && checkLoginExpiration() && user) {
    ra.value = user.ra
    update.value = true
    isLoading.value = true
  } else {
    return dialog.value = true
  }
})
</script>
