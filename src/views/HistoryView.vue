<template>
  <div class="history">
    <h1>History</h1>
    <button @click="loginDev()">Login Dev</button>
    <HelloWorld name="React" />
  </div>
</template>

<script setup lang="ts">
import Auth from '@/services/Auth';
import User from '@/services/User';

import { defineFederatedReactComponent } from '../utils/moduleFederation';

async function loginDev() {
  try {
    Auth.token.value = 'DEVTOKEN';
    localStorage.setItem('token', 'DEVTOKEN');
    const res = await User.info();
    if (res.data) Auth.user = res.data;
  } catch (err) {
    Auth.user.value = null;
  }
}

const HelloWorld = defineFederatedReactComponent({
  loader: () => import('react/HelloWorld'),
  props: {
    name: { type: String, default: 'unknown' },
  },
  mounted() {
    //
  },
});
</script>
