<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/config">Config</router-link>
  </nav>
  <transition name="slide-x-transition" mode="out-in">
    <router-view />
  </transition>
</template>

<style>
html {
  font-family: Roboto, Ubuntu, Helvetica Neue, Helvetica, PingFang SC,
    Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
}

#app {
  font-family: 'Roboto', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
