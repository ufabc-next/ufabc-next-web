<template>
  <div class="d-flex justify-center py-4">
    <v-progress-circular
      color="ufabcnext-green"
      indeterminate
      model-value="20"
    ></v-progress-circular>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CenteredLoading',
});
</script>
