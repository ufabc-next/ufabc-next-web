<template>
  <header class="app-header">
    <div class="app-header__title">
      <div>
        <img src="../assets/logo.svg" width="150px" alt="" />
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: 0 24px;
  border-bottom: 1px solid #e2e8f0;
  background-color: #ffffff;
}

.app-header__title {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: 16px;
}
</style>
