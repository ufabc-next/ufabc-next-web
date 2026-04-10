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
              <v-select
                v-model="courseId.value.value"
                :items="coursesList"
                item-title="name"
                item-value="id"
                :error-messages="courseId.errorMessage.value"
                label="Selecionar um Curso"
                placeholder="Selecione um curso"
                variant="outlined"
                prepend-inner-icon="mdi-school"
                :loading="isCoursesLoading"
                :disabled="isPendingSubmit"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="disciplineName.value.value"
                :error-messages="disciplineName.errorMessage.value"
                label="Nome da Disciplina"
                placeholder="Digite o nome da disciplina"
                variant="outlined"
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
                variant="outlined"
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
import { useMutation, useQuery } from '@tanstack/vue-query';
import { sendAnnouncement, Whatsapp } from '@ufabc-next/services';
import { RequestError, SearchCourseItem } from '@ufabc-next/types';
import { toTypedSchema } from '@vee-validate/zod';
import { AxiosError } from 'axios';
import { ElMessage } from 'element-plus';
import { useField, useForm } from 'vee-validate';
import { computed, ref } from 'vue';

import { PaperCard } from '@/components/PaperCard';
import { useAuthStore } from '@/stores/auth';

import { announcementValidationSchema } from './announcementValidationSchema';

const authStore = useAuthStore();
const isUserLoggedIn = computed(() => !!authStore.user);
const successMessage = ref<string>('');

const validationSchema = toTypedSchema(announcementValidationSchema);

const { handleSubmit, meta, resetForm } = useForm({
  validationSchema,
  initialValues: {
    courseId: undefined,
    disciplineName: '',
    announcementText: '',
  },
});

const courseId = useField<number | undefined>('courseId');
const disciplineName = useField('disciplineName');
const announcementText = useField('announcementText');

const { data: coursesData, isLoading: isCoursesLoading } = useQuery({
  queryKey: ['courses'],
  queryFn: () => Whatsapp.getCourses(),
  staleTime: 1000 * 60 * 60,
});

const coursesList = computed(() => {
  if (!coursesData.value) return [];
  return coursesData.value
    .filter((course: SearchCourseItem) => course.name && course.name.trim())
    .sort((a: SearchCourseItem, b: SearchCourseItem) =>
      a.name.localeCompare(b.name),
    );
});

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
  const selectedCourse = coursesList.value.find(
    (course: SearchCourseItem) => course.id === values.courseId,
  );

  sendAnnouncementData({
    courseName: selectedCourse?.name ?? '',
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
