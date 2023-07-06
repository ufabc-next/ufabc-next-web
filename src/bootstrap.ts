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
    background: '#ffffff',
  },
};

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

import elementPlus from 'element-plus';
import 'element-plus/dist/index.css';

createApp(App).use(router).use(vuetify).use(elementPlus).mount('#app');
