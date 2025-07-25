<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useMutation, useQuery } from '@tanstack/vue-query';
import { Users } from 'services';
import { recoverySchema } from './recoveryValidationSchema'
import { toTypedSchema } from '@vee-validate/zod';
import { useForm, useField } from 'vee-validate';
import { useRouter } from 'vue-router';
import { FeedbackAlert } from '@/components/FeedbackAlert';

const router = useRouter();

const redirectToHome = () => (window.location.pathname = '/');

const validationSchema = toTypedSchema(recoverySchema as any);

const { handleSubmit, meta } = useForm({
  validationSchema,
});

const email = useField('email');
const ra = useField<string>('ra.ra');
const raConfirm = useField('ra.confirm');

const isFetchEmailEnabled = computed(() => raConfirm.value.value === ra.value.value);
const { refetch: fetchEmail, isLoading: isFetchEmailLoading, data: verifiedEmail, error: fetchEmailError } = useQuery({
  queryKey: ['email'],
  queryFn: () => Users.getEmail(ra.value.value),
  enabled: false,
});

const handleEmailError = computed(() => {
  if (!fetchEmailError.value) {
    return 'Um Erro inesperado ocorreu, tente novamente';
  }

  // crime here
  const error = fetchEmailError.value as any;

  if (error.response?.status === 400) {
    return error.response.data.message
  }

  if (error.response?.status === 403) {
    return error.response.data.message
  }

  return 'Um Erro inesperado ocorreu, tente novamente'
})

const getUserEmail = (fieldState: boolean) => {
  if (fieldState || !ra.value.value || !isFetchEmailEnabled.value) {
    return;
  }

  fetchEmail();
};

watch(() => verifiedEmail.value, (newEmail) => {
  if (newEmail) {
    email.value.value = newEmail.data.email
  }
})

const recoveryStep = ref(0);

const { mutate: mutateRecover, isPending: isPendingSubmit } = useMutation({
  mutationFn: Users.recovery,
  onSuccess: () => {
    recoveryStep.value = 2;
  },
  onError: () => {
    recoveryStep.value = 1;
  },
});

const onSubmit = handleSubmit(({ email }) =>
  mutateRecover(email.toLowerCase()),
);
</script>

<template>
  <v-container>
    <FeedbackAlert v-if="fetchEmailError" :text="handleEmailError" />

    <v-row>
      <img style="max-width: 200px; height: auto" src="@/assets/logo.svg" alt="logo do UFABC Next" />
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <img class="pa-6" src="@/assets/recovery.svg" style="width: 100%" alt="Imagem minimalista de dois estudantes" />
      </v-col>

      <v-col cols="12" md="6">
        <section v-if="recoveryStep === 0">
          <h1 style="font-size: 26px; font-weight: 700" class="mb-6">
            Criou uma conta no Next e não consegue acessar?
          </h1>
          <v-form @submit.prevent="onSubmit">
            <v-text-field v-model.trim="ra.value.value" @update:focused="getUserEmail" label="Insira seu RA"
              :disabled="isFetchEmailLoading" variant="solo" class="mb-4 w-100" placeholder="11201911111"
              prepend-inner-icon="mdi-school" :error-messages="ra.errorMessage.value" />

            <v-text-field v-model.trim="raConfirm.value.value" @update:focused="getUserEmail"
              :disabled="isFetchEmailLoading" label="Confirme seu RA" variant="solo" class="mb-4 w-100"
              placeholder="11201911111" prepend-inner-icon="mdi-school-outline"
              :error-messages="raConfirm.errorMessage.value" />

            <v-text-field v-model.trim="email.value.value" :loading="isFetchEmailLoading" :disabled="true"
              label="Email institucional" variant="solo" class="mb-4 w-100" placeholder="seu.email@aluno.ufabc.edu.br"
              prepend-inner-icon="mdi-email" :error-messages="email.errorMessage.value" readonly />

            <div class="d-flex">
              <v-btn :disabled="isFetchEmailLoading || isPendingSubmit" class="mr-2" rounded size="large"
                @click="router.go(-1)">
                <v-icon class="mr-1">mdi-arrow-left</v-icon> Anterior
              </v-btn>
              <v-btn color="#4a90e2" type="submit" rounded size="large" :loading="isPendingSubmit"
                :disabled="!meta.valid">
                Próximo <v-icon class="ml-1">mdi-arrow-right</v-icon>
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
              <a href="https://www.instagram.com/ufabc_next/?hl=pt-br" target="_blank">Instagram</a>
              e te atenderemos!
            </p>
            <p class="mb-4">
              Não esqueça de informar RA e e-mail institucional.
            </p>
            <p>
              Aproveite e conheça o projeto no
              <a href="https://github.com/ufabc-next/ufabc-next-web" target="_blank">GitHub</a>, sua ajuda será
              bem-vinda!
            </p>
          </div>
        </section>

        <section v-else-if="recoveryStep === 2">
          <h1 style="font-size: 26px; font-weight: 700" class="mb-4">
            Sua conta será recuperada! 🎉
          </h1>
          <p class="mb-4">
            Você recebeu um email para recuperar sua conta,
            <a href="https://www.outlook.com/aluno.ufabc.edu.br" target="_blank">clique aqui</a>
            para acessar seu email institucional.
          </p>

          <div class="alert-wrapper">
            <p class="mb-4">
              Caso você não tenha recebido o email de recuperação de conta,
              envie uma DM para nosso
              <a href="https://www.instagram.com/ufabc_next/?hl=pt-br" target="_blank">Instagram</a>
              e te atenderemos!
            </p>
            <p class="mb-4">
              Não esqueça de informar seu RA e email institucional
            </p>
          </div>
        </section>

        <v-btn v-show="recoveryStep === 1" color="#4a90e2" class="mt-3" rounded size="large" @click="redirectToHome()">
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
