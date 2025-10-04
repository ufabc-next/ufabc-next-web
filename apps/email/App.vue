<template>
  <h1>Template Previewer</h1>
  <p><strong>Current route path:</strong> {{ $route.fullPath }}</p>
  <nav>
    <RouterLink to="/">Todos (Em construção)</RouterLink>
    <RouterLink to="/Welcome">Template de welcome</RouterLink>
  </nav>
  <main>
    <RouterView />
  </main>
</template>

<script setup></script>
<style scoped>
nav {
  display: flex;
  gap: 20px;
}
</style>
