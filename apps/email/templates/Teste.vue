<script setup>
import { Button, Hr, Html, Text } from '@vue-email/components';
defineProps({
  title: String,
});
</script>

<template>
  <Html lang="en">
    <Text>{{ title }}</Text>
    <Hr />
    <Button href="https://example.com">Click me</Button>
  </Html>
</template>
