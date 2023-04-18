<template>
  <div class="history">
    <h1>History</h1>
    <button @click="loginDev()">Login Dev</button>
  </div>
</template>

<script setup lang="ts">
import Auth from '@/services/Auth';
import User from '@/services/User';

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
</script>
