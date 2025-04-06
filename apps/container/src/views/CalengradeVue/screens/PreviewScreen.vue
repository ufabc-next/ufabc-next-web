<template>
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
import { handleCalendar } from '../../../utils/calendar'
import { CalengradeInfo, CalengradeSteps } from '../types';

const props = defineProps<{
  calengrade: CalengradeInfo
}>()

const emit = defineEmits<{
  (e: 'nextStep', step: CalengradeSteps): boolean
  (e: 'resetCalengrade'): void
}>()

enum generatingCalendarMessages {
  GENERATING = 'Gerando o seu calengrade',
  DOWNLOADING = 'Fazendo download'
}

const step = ref(0)
const generatingCalendarMessage = ref(generatingCalendarMessages.GENERATING)
const calendar = ref<string>()

const downloadTimer = ref<NodeJS.Timeout>()
onMounted(() => {
  downloadTimer.value = setInterval(() => step.value++, 1000)
})

onUnmounted(() => {
  if (downloadTimer.value) {
    clearInterval(downloadTimer.value)
  }
})

const resetCalengrade = () => {
  emit('resetCalengrade')
}

watch(step, (newStep) => {
  const { classes, quarter } = props.calengrade

  if (!classes || !quarter) {
    emit('nextStep', CalengradeSteps.Summary)  // todo: create fallback screen
    return
  }

  if (classes.length <= 0 || !quarter.startDate || !quarter.endDate) {
    emit('nextStep', CalengradeSteps.Summary)
    return
  }

  switch (newStep) {
    case 0: // Gerar
      const newCalendar =
        handleCalendar({
          classes,
          startDate: quarter.startDate,
          endDate: quarter.endDate
        })

      calendar.value = newCalendar
      break

    case 1: // Download
      try {
        const { quarter } = props.calengrade

        if (calendar.value && typeof calendar.value === 'string') {
          const blob = new Blob([calendar.value], { type: 'text/calendar' })
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
        emit('nextStep', CalengradeSteps.Summary)
      }
      break

    default:
      if (downloadTimer.value) clearInterval(downloadTimer.value)
      break
  }
})
</script>


<style scoped></style>