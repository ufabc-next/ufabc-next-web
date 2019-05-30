import _ from 'lodash'
import Performance from '@/services/Performance'

export default {
  name: 'Simulation',

  data() {
    return {
      history: null,
      simulatedSeason: [
        { disciplina: 'Mineração de Dados', conceito: 'A', creditos: 4 },
      ],
      loading: false,
      conceptsColor: {
        'A': 'rgb(63, 207, 140)',
        'B': 'rgb(184, 233, 134)',
        'C': 'rgb(248, 183, 76)',
        'D': 'rgb(255, 160, 4)',
        'F': 'rgb(249, 84, 105)',
        'O': 'rgb(169, 169, 169)',

        // exceptions
        'I': 'rgb(25, 118, 210)',
        'E': 'rgb(25, 118, 210)',
        'null': 'rgb(0, 0, 0)',
      }
    }
  },

  computed: {
    creditosAtuais() {
      if (this.history && this.history.length > 0) {
        return this.history[this.history.length - 1].accumulated_credits
      } else {
        return 0
      }
    },
    crAtual() {
      if (this.history && this.history.length > 0) {
        return this.history[this.history.length - 1].cr_acumulado
      } else {
        return 0
      }
    },
    creditosSimulados() {
      let creditos = 0
      for (let disciplina of this.simulatedSeason) {
        creditos += disciplina.creditos
      }
      return creditos
    },
    crSimulado() {
      let somaConceitos = 0
      for (let disciplina of this.simulatedSeason) {
        somaConceitos += converterConceito(disciplina.conceito) * disciplina.creditos
      }
      const totalCreditos = this.creditosAtuais + this.creditosSimulados
      return (this.crAtual * this.creditosAtuais + somaConceitos) / totalCreditos
    }
  },

  async created() {
    await this.fetch()
  },

  methods: {
    addDisciplina() {
      this.simulatedSeason.push({
        disciplina: "NOME",
        creditos: 4,
        conceito: 'A',
      })
    },
    remove(index) {
      this.simulatedSeason.splice(index, 1)
    },
    async fetch() {
      this.loading = true

      try {
        let res = await Performance.getCrHistory()

        this.loading = false
        if (res.data) {
          this.history = res.data
        }
      } catch (err) {
        this.loading = false
        this.$message({
          type: 'error',
          message: ErrorMessage(err),
        })
      }
    }
  }
}

function converterConceito(conceito) {
  if (conceito === 'A') return 4
  else if (conceito === 'B') return 3
  else if (conceito === 'C') return 2
  else if (conceito === 'D') return 1
  return 0
}