<template>
  <v-alert
    :type="type"
    :title="title"
    :text="text"
    closable
    variant="elevated"
    position="fixed"
    class="alert"
  />
</template>
<style lang="scss" scoped>
.alert {
  z-index: 1000;
  right: 15px;
  width: 350px;
  bottom: 15px;
}
</style>
<script lang="ts">
import { PropType } from 'vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'FeedbackAlert',
  props: {
    type: {
      type: String as PropType<'error' | 'success' | 'warning' | 'info'>,
      default: 'error',
    },
    title: {
      type: String,
      default: 'Ops, algo deu errado',
    },
    text: {
      type: String,
      default:
        'Não foi possível buscar as informações, tente novamente mais tarde',
    },
  },
});
</script>
