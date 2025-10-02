import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import TemplateRender from './TemplateRender.vue';

const routes = [
  { path: '/', component: null },
  { path: '/:componentName', component: TemplateRender },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App).use(router).mount('#app');
