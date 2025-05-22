<template>
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
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authStore } from 'stores'

const router = useRouter()
const dialog = ref(true)
const ra = ref('')

const { isLoggedIn, user, logOut } = authStore.getState()

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

function submitRA() {
  if (ra.value.trim().length > 0) {
    //logica de cadastrar o RA como confirmed = false
    dialog.value = false
  } else {
    alert('Por favor, preencha o RA.')
  }
}

watch(dialog, () => {
  console.log('RA definido:', ra.value)
  //logica de pegar as materias do quad atual pelo RA
})

onMounted(() => {
  if (isLoggedIn() && user) {
    if (checkLoginExpiration()) {
      ra.value = user.ra
      dialog.value = false
    }
  }
})
</script>
