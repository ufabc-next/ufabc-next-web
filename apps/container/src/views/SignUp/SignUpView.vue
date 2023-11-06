<script setup lang="ts"></script>

<template>
  <v-container>
    <v-row>
      <img style="max-width: 200px; height: auto" src="@/assets/logo.svg" />
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <img style="max-width: 100%; height: auto" src="@/assets/signup.svg" />
      </v-col>

      <v-col cols="12" md="6">
        <section>
          <div>
            <div>
              <h1 style="font-size: 26px; font-weight: 700" class="mb-6">
                O que você faz na UFABC?
              </h1>
              <p>Selecione uma das opções:</p>
            </div>

            <div class="d-flex">
              <div
                class="d-flex elevate-3d pa-4 border cursor-pointer mr-3"
                style="width: 160px"
              >
                <v-icon class="mr-2">mdi-school</v-icon>
                <p>Aluno</p>
              </div>
              <div
                class="d-flex elevate-3d pa-4 border cursor-pointer mr-3"
                style="width: 160px"
              >
                <v-icon class="mr-2">mdi-account</v-icon>
                <p>Professor</p>
              </div>
            </div>
          </div>
          <div>
            <a>Já tenho uma conta no UFABC Next e quero recuperá-la</a>
          </div>

          <div></div>
          <div></div>
        </section>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6"></v-col>
      <v-col cols="12" md="6"></v-col>
    </v-row>
  </v-container>
</template>
