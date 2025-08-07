<template>
    <section>
        <v-container>
            <PaperCard title="Ajuda" class="text-md-left text-center">
                <v-form @submit.prevent="onSubmit">
                    <v-row class="mt-4">
                        <v-col cols="12">
                            <p class="text-body-1 mb-4">
                                Envie uma mensagem de ajuda sobre algum erro que você está enfrentando
                            </p>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12">
                            <v-text-field v-model="problemTitleField.value.value" :error-messages="problemTitleField.errorMessage.value"
                                label="Título do Problema" placeholder="Digite um título" outlined dense
                                :disabled="isPendingSubmit" />
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12">
                            <v-textarea v-model="problemDescriptionField.value.value"
                                :error-messages="problemDescriptionField.errorMessage.value" label="Descrição do Problema"
                                placeholder="Descreva o problema" outlined rows="4"
                                :disabled="isPendingSubmit" />
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12" class="text-center">
                            <v-btn type="submit" color="primary" :loading="isPendingSubmit"
                                :disabled="!meta.valid || isPendingSubmit" size="large">
                                Enviar problema
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-form>

              </PaperCard>
        </v-container>
    </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useMutation } from '@tanstack/vue-query';
import { useForm, useField } from 'vee-validate';
import { ElMessage } from 'element-plus';
import { AxiosError } from 'axios';

import { sendHelpForm, type HelpFormData } from 'services';
import { PaperCard } from '@/components/PaperCard';
import { RequestError } from 'types';

const successMessage = ref<string>('');

const { handleSubmit, meta, resetForm } = useForm({
    initialValues: {
        email: 'rafael@ufabc.edu.br',
        ra: '12345678',
        problemTitle: '',
        problemDescription: '',
    },
});

const problemTitleField = useField('problemTitle');
const problemDescriptionField = useField('problemDescription');

const { mutate: mutateSendForm, isPending: isPendingSubmit } = useMutation<void, Error, HelpFormData>({
    mutationFn: sendHelpForm,
    onSuccess: (response) => {
        successMessage.value = `Card criado com sucesso! Response: ${response}`;
        resetForm();
        ElMessage({
            message: 'Mensagem de ajuda enviada com sucesso!',
            type: 'success',
            showClose: true,
        });
    },
    onError: (error: Error) => {
        const message = error instanceof AxiosError 
            ? error.response?.data?.error || error.message
            : error.message;
            
        ElMessage({
            message: 'Erro ao enviar mensagem de ajuda: ' + message,
            type: 'error',
            showClose: true,
        });
    },
});

const onSubmit = handleSubmit((values) => {
    successMessage.value = '';
    mutateSendForm(values);
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