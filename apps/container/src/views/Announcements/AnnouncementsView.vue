<template>
  <section>
    <v-container>
      <PaperCard title="Anúncios" class="text-md-left text-center">
        <v-form @submit.prevent="onSubmit">
          <v-row class="mt-4">
            <v-col cols="12">
              <p class="text-body-1 mb-4">
                Envie uma mensagem a grupos especificos do whatsapp
              </p>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="courseName.value.value"
                :error-messages="courseName.errorMessage.value"
                label="Nome do Curso"
                placeholder="Digite o nome do curso"
                outlined
                dense
                :disabled="isPendingSubmit"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-textarea
                v-model="announcementText.value.value"
                :error-messages="announcementText.errorMessage.value"
                label="Texto do Anúncio"
                placeholder="Digite o texto do anúncio"
                outlined
                rows="4"
                :disabled="isPendingSubmit"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" class="text-center">
              <v-btn
                type="submit"
                color="primary"
                :loading="isPendingSubmit"
                :disabled="!meta.valid || isPendingSubmit"
                size="large"
              >
                Enviar
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </PaperCard>
    </v-container>
  </section>
</template>

<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query';
import { sendAnnouncement } from '@ufabc-next/services/announcements';
import { RequestError } from '@ufabc-next/types';
import { toTypedSchema } from '@vee-validate/zod';
import { AxiosError } from 'axios';
import { ElMessage } from 'element-plus';
import { useField, useForm } from 'vee-validate';
import { ref } from 'vue';

import { PaperCard } from '@/components/PaperCard';
import { useAuthStore } from '@/stores/auth';

import { announcementValidationSchema } from './announcementValidationSchema';

const authStore = useAuthStore();
const successMessage = ref<string>('');

const validationSchema = toTypedSchema(announcementValidationSchema);

const { handleSubmit, meta, resetForm } = useForm({
  validationSchema,
  initialValues: {
    courseName: '',
    announcementText: '',
  },
});

const courseName = useField('courseName');
const announcementText = useField('announcementText');

const { mutate: sendAnnouncementData, isPending: isPendingSubmit } =
  useMutation({
    mutationFn: sendAnnouncement,
    onSuccess: () => {
      resetForm();
      ElMessage({
        message: 'Anúncio está sendo enviado para os grupos!',
        type: 'success',
        showClose: true,
      });
    },
    onError: (error: AxiosError<RequestError>) => {
      ElMessage({
        message:
          'Erro ao enviar anúncio: ' +
          (error.response?.data?.error || error.message),
        type: 'error',
        showClose: true,
      });
    },
  });

const onSubmit = handleSubmit((values) => {
  successMessage.value = '';

  sendAnnouncementData({
    courseName: values.courseName,
    announcementText: values.announcementText,
  });
});
</script>

<style scoped>
.container {
  min-height: calc(100vh - 64px);
  min-height: calc(100svh - 64px);
  display: flex;
  flex-direction: column;
}
</style>
