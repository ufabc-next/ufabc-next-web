<script setup lang="ts">
import { ref } from 'vue';
import { useMutation } from '@tanstack/vue-query';
import { Users } from 'services';

// recoveryStep === 0: enter email
// recoveryStep === 1: recovery error
// recoveryStep === 2: success
const recoveryStep = ref(0);

const email = ref('');
const isFormValid = ref(false);
const rules = {
  required: (value: string) => !!value || 'Este campo é obrigatório',
  validEmail: (email: string) => {
    const regexStudentEmail = /^[A-Za-z0-9._%+-]+@aluno\.ufabc\.edu\.br$/;
    return regexStudentEmail.test(email)
      ? true
      : 'Digite um email UFABC válido';
  },
};

const { mutate: mutateRecover, isPending: isLoadingSubmit } = useMutation({
  mutationFn: () => Users.recovery(email.value),
  onSuccess: () => (recoveryStep.value = 2),
  onError: () => (recoveryStep.value = 1),
});
</script>

<template>
  <v-container>
    <v-row>
      <img style="max-width: 200px; height: auto" src="@/assets/logo.svg" />
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <img
          style="max-width: 100%; height: auto"
          class="pa-6"
          src="@/assets/recovery.svg"
        />
      </v-col>

      <v-col cols="12" md="6">
        <section v-if="recoveryStep === 0">
          <h1 style="font-size: 26px; font-weight: 700" class="mb-6">
            Criou uma conta no Next e não consegue acessar?
          </h1>
          <v-form @submit.prevent v-model="isFormValid">
            <v-text-field
              v-model="email"
              label="Insira seu email institucional"
              variant="solo"
              class="mb-4"
              placeholder="seu.email@aluno.ufabc.edu.br"
              prepend-inner-icon="mdi-email"
              :rules="[rules.required, rules.validEmail]"
            ></v-text-field>
            <div class="d-flex">
              <v-btn class="mr-2" rounded size="large" @click="$router.go(-1)">
                &#129052; Anterior
              </v-btn>
              <v-btn
                color="#4a90e2"
                rounded
                size="large"
                :loading="isLoadingSubmit"
                :disabled="!isFormValid"
                @click="mutateRecover()"
              >
                Próximo &#129050;
              </v-btn>
            </div>
          </v-form>
        </section>

        <section v-else-if="recoveryStep === 1">
          <h1 style="font-size: 26px; font-weight: 700" class="mb-4">
            Não foi possível recuperar sua conta 😔
          </h1>
          <p class="mb-4">Mas calma, nem tudo está perdido!</p>
          <div class="alert-wrapper">
            <p class="mb-4">
              O time do UFABC Next está trabalhando para resolver seu problema e
              continuar te ajudando na sua jornada pela UFABC.
            </p>
            <p class="mb-4">
              Envie uma DM para nosso
              <a href="https://www.instagram.com/ufabc_next/?hl=pt-br"
                >Instagram</a
              >
              e te atenderemos!
            </p>
            <p class="mb-4">
              Não esqueça de informar RA e e-mail institucional.
            </p>
            <p>
              Aproveite e conheça o projeto no
              <a href="https://github.com/ufabc-next/ufabc-next-web">GitHub</a>,
              sua ajuda será bem-vinda!
            </p>
          </div>
        </section>

        <section v-else-if="recoveryStep === 2">
          <h1 style="font-size: 26px; font-weight: 700" class="mb-4">
            Sua conta será recuperada! 🎉
          </h1>
          <p class="mb-4">
            Você recebeu um email para recuperar sua conta,
            <span class="cursor-pointer ufabcnext-link--text">clique aqui</span>
            para acessar seu email institucional.
          </p>

          <div class="alert-wrapper">
            <p class="mb-4">
              Caso você não tenha recebido o email de recuperação de conta,
              envie uma DM para nosso
              <a href="https://www.instagram.com/ufabc_next/?hl=pt-br"
                >Instagram</a
              >
              e te atenderemos!
            </p>
            <p class="mb-4">
              Não esqueça de informar seu RA e email institucional
            </p>
          </div>
        </section>
        <v-btn
          v-show="recoveryStep === 1"
          color="#4a90e2"
          class="mt-3"
          rounded
          size="large"
          @click="$router.push('/')"
        >
          Voltar para a home
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
p {
  font-size: 16px;
}

a {
  color: black;
  text-decoration: underline;
}

.alert-wrapper {
  background-color: #bbdefb;
  color: #1565c0;
  padding: 8px 16px;
  border-radius: 4px;
  overflow: hidden;
}
</style>
