<!-- <template>
  <div v-if="step < 2">
    <div>
      <h1>{{ generatingCalendarMessage }}</h1>
      <h2>...</h2>
    </div>

    <div class="flex-fill d-flex align-center">
      <img src="../../../assets/calengrade/loading.svg" alt="Calendário acadêmico" />
    </div>
  </div>
  <div v-else>
    <div>
      <h1>Seu Calengrade está pronto!</h1>
      <h2>
        Abra o arquivo com seu aplicativo de calendário favorito e aproveite
        :)
      </h2>
    </div>
    <div>
      <img src="../../../assets/calengrade/calendar_done.svg" alt="Calendário" style="margin: 32px 0;" />
    </div>
    <div>
      <button @click="resetCalengrade">
        Fazer novo Calengrade
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useCalengradeContext } from '../../composables/useCalengradeContext'
import { handleCalendar } from '../../utils/calendar'

const { calengrade, setCalengrade, setActiveScreen } = useCalengradeContext()

enum generatingCalendarMessages {
  GENERATING = 'Gerando o seu calengrade',
  DOWNLOADING = 'Fazendo download'
}

const step = ref(0)
const generatingCalendarMessage = ref(generatingCalendarMessages.GENERATING)
const downloadTimer = ref<NodeJS.Timeout>()

const resetCalengrade = () => {
  setActiveScreen('summary')
  setCalengrade({
    classes: [],
    quarter: {},
    summary: ''
  })
}

onMounted(() => {
  downloadTimer.value = setInterval(() => step.value++, 1000)
})

onUnmounted(() => {
  if (downloadTimer.value) {
    clearInterval(downloadTimer.value)
  }
})

watch(step, (newStep) => {
  const { classes, quarter, calendar } = calengrade.value

  if (classes.length <= 0 || !quarter.startDate || !quarter.endDate) {
    setActiveScreen('summary')
    return
  }

  switch (newStep) {
    case 0: // Gerar
      const newCalendar = calendar
        ? calendar
        : handleCalendar({
          classes,
          startDate: quarter.startDate,
          endDate: quarter.endDate
        })

      setCalengrade({
        ...calengrade.value,
        calendar: newCalendar
      })
      break

    case 1: // Download
      try {
        const { calendar, quarter } = calengrade.value

        if (calendar && typeof calendar === 'string') {
          const blob = new Blob([calendar], { type: 'text/calendar' })
          const downloadURL = URL.createObjectURL(blob)
          const downloadLink = document.createElement('a')

          downloadLink.href = downloadURL
          downloadLink.download = `Meu Calengrade - ${quarter.title}.ics`
          downloadLink.click()

          URL.revokeObjectURL(downloadURL)
        } else {
          if (downloadTimer.value) clearInterval(downloadTimer.value)
          window.Toaster.error('Não foi possível baixar seu Calengrade!')
        }
      } catch (e) {
        console.log('ERROR', e)
        window.Toaster.error('Não foi possível baixar seu Calengrade!')
        if (downloadTimer.value) clearInterval(downloadTimer.value)
        setActiveScreen('summary')
      }
      break

    default:
      if (downloadTimer.value) clearInterval(downloadTimer.value)
      break
  }
})
</script> -->

<template>
  <div>

  </div>
</template>

<script lang="ts" setup>

</script>

<style></style>