import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import '@mdi/font/css/materialdesignicons.css';

import 'vuetify/styles';
import { ThemeDefinition, createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const myCustomLightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    navigation: '#215096',
    primary: '#2e7eed',
    secondary: '#f3f6f7',
    'ufabcnext-green': '#56cdb7',
    'next-gray': '#404040',
    'next-light-gray': '#848687',
    error: '#f45576',
    background: '#ffffff',
  },
};

interface Device {
  cordova: string;
  model: string;
  platform: string;
  uuid: string;
  version: string;
}

declare global {
  interface Window {
    device: Device;
  }
}

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'myCustomLightTheme',
    themes: {
      myCustomLightTheme,
    },
  },
});

import elementPlus from 'element-plus';
import 'element-plus/dist/index.css';

createApp(App).use(router).use(vuetify).use(elementPlus).mount('#app');
