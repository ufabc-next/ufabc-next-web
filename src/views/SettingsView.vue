<template>
  <section>
    <v-container>
      <div class="title-settings mb-7">Configurações da conta</div>
      <v-row
        class="mb-4 text-md-left text-center"
        style="
          border: 2px solid #f1f1f1;
          padding: 2rem;
          border-radius: 3px;
          background: white;
        "
      >
        <v-col
          cols="12"
          md="2"
          class="mb-3 d-flex justify-center d align-center"
        >
          <v-avatar
            :size="80"
            color="primary"
            class="white--text"
            style="font-size: 32px; text-transform: uppercase"
          >
            {{ userInitials }}
          </v-avatar>
        </v-col>
        <v-col class="mb-3">
          <section class="mb-3">
            <div class="username-settings">{{ userLogin }}</div>
            <div class="email-settings">{{ user.value?.email }}</div>
            <div class="createdAt-settings mb-3">
              Usuário desde {{ createdAt }}
            </div>
            <div style="display: flex; flex-direction: column; gap: 10px">
              <a
                href="#"
                class="links-settings"
                v-if="user.value?.oauth && user.value?.oauth.facebook"
              >
                <v-icon color="ufabcnext-green">mdi-check</v-icon>
                Conta do Facebook associada
              </a>

              <a
                :href="addFacebookAccount"
                target="_blank"
                class="links-settings add-account"
                v-else-if="user"
              >
                <v-icon color="ufabcnext-blue" class="mr-2"
                  >mdi-plus-circle-outline</v-icon
                >
                Associar à uma conta do Facebook
              </a>

              <a
                href="#"
                class="links-settings"
                v-if="user.value?.oauth && user.value?.oauth.google"
              >
                <v-icon color="ufabcnext-green">mdi-check</v-icon>
                Conta do Google associada
              </a>

              <a
                :href="addGoogleAccount"
                target="_blank"
                class="links-settings add-account"
                v-else-if="user"
              >
                <v-icon color="ufabcnext-blue" class="mr-2"
                  >mdi-plus-circle-outline</v-icon
                >
                Associar à uma conta do Google
              </a>
            </div>
          </section>
        </v-col>
        <v-col
          cols="12"
          md="3"
          class="d-flex justify-center justify-md-end align-center"
        >
          <v-btn
            class="settings-button error--text"
            outlined
            variant="outlined"
            color="error"
            @click="dialog = true"
          >
            Desativar Conta
          </v-btn>
        </v-col>
      </v-row>

      <v-row
        style="
          border: 2px solid #f1f1f1;
          padding: 2rem;
          border-radius: 3px;
          background: white;
        "
      >
        <v-col>
          <h2 class="title-box-settings mb-3">
            Segurança e controle dos dados
          </h2>
          <p class="text-box-settings">
            Todos os seus dados que armazenamos (RA, histórico e avaliações)
            poderão ser excluídos a qualquer momento e você tem controle total
            sobre eles. Ao desativar sua conta, suas avaliações
            <b>não serão perdidas</b>.
          </p>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="dialog" width="450px">
      <v-card>
        <v-card-title class="text-h5"> Excluir conta </v-card-title>
        <v-card-text
          >Tem certeza que deseja excluir seu usuário? <br /><br />Caso deseje
          voltar, tudo estará aqui 😀</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green-darken-1" variant="text" @click="dialog = false">
            Agora não
          </v-btn>
          <v-btn color="error" variant="text" @click="removeAccount()">
            Excluir conta
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import Auth from '@/services/Auth';
import ErrorMessage from '@/helpers/ErrorMessage';
import AliasInitials from '@/helpers/AliasInitials';
import { API_URL } from '@/environment';
import User from '@/services/User';
import axios from 'axios';

// ------- dados do usuário ---------- //
const user = computed(() => Auth.user);
const userLogin = computed(() => {
  return user.value.value?.email.replace('@aluno.ufabc.edu.br', '');
});

const userInitials = computed(() =>
  userLogin.value ? AliasInitials(userLogin.value) : '',
); // argument type error here

const addGoogleAccount = computed(() => {
  const apiPath = API_URL.replace('/v1', '');
  return apiPath + '/connect/google?userId=' + user.value.value?._id;
});
const addFacebookAccount = computed(() => {
  const apiPath = API_URL.replace('/v1', '');
  return apiPath + '/connect/facebook?userId=' + user.value.value?._id;
});
const createdAt = computed(() => {
  return user.value.value?.createdAt.toLocaleDateString('pt-BR', {
    timeZone: 'UTC',
  });
});
// ------------------------------------------------------- //

// ------------ Modal ------------------ //
const dialog = ref(false);
// ------------------------------------------------ //

// ------- Lógica de remoção do usuário ---------- //
const loading = ref(false);

async function removeUser(): Promise<void> {
  try {
    loading.value = true;
    const res = await User.delete();

    loading.value = false;
    if (res.data) {
      Auth.logOut();
    }
  } catch (err) {
    loading.value = false;
    if (axios.isAxiosError(err)) {
      ElMessage({
        message: ErrorMessage(err),
        type: 'error',
      });
    }
  }
}

async function removeAccount() {
  dialog.value = false;
  removeUser();
}
// ---------------------------------------------------- //
</script>

<style scoped>
.title-settings {
  font-family: Lato, Roboto;
  font-size: 28px;
}

.username-settings {
  font-family: Lato, Roboto;
  line-height: 1.5;
  font-size: 26px;
  height: 45px;
  color: #444;
}

.email-settings {
  font-family: Lato, Roboto;
  color: #676767;
  font-size: 16px;
}

.createdAt-settings {
  font-family: Lato, Roboto;
  color: #676767;
  font-size: 16px;
}

.title-box-settings {
  font-family: Lato, Roboto;
  color: #444;
  font-size: 26px;
}
.text-box-settings {
  color: #676767;
  font-size: 16px;
}

.links-settings {
  display: flex;
  align-items: center;
  font-size: 16px;
  text-decoration: none;
}

.add-account {
  border: 2px dashed #1976d2;
  padding: 2px;
  border-radius: 6px;
}
</style>
