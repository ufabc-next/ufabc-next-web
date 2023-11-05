<script setup lang="ts">
const rules = {
  required: (value: string) => !!value || 'Este campo é obrigatório',
  validEmail: (email: string) => {
    const regexStudentEmail = /^[A-Za-z0-9._%+-]+@aluno\.ufabc\.edu\.br$/;
    return regexStudentEmail.test(email)
      ? true
      : 'Digite um email UFABC válido';
  },
};
</script>

<template>
  <v-container>
    <v-row>
      <img style="max-width: 200px; height: auto" src="@/assets/logo.svg" />
    </v-row>

    <v-row>
      <v-col xs="12" sm="6">
        <img
          style="max-width: 100%; height: auto"
          class="pa-6"
          src="@/assets/recovery.svg"
        />
      </v-col>

      <v-col xs="12" sm="6">
        <section>
          <h1 style="font-size: 26px; font-weight: 700" class="mb-4">
            Criou uma conta no Next e não consegue acessar?
          </h1>
          <v-form>
            <v-text-field
              label="Insira seu email institucional"
              variant="solo"
              placeholder="seu.email@aluno.ufabc.edu.br"
              prepend-inner-icon="mdi-email"
              :rules="[rules.required, rules.validEmail]"
            ></v-text-field>
          </v-form>
        </section>

        <v-btn
          color="#4a90e2"
          class="mt-3"
          rounded
          size="large"
          @click="$router.push('/')"
        >
          Voltar para a home >
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
p {
  font-size: 16px;
}
</style>
