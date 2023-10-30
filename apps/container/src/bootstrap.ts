import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import {
  VueQueryPlugin,
  QueryClient as QueryClientVue,
} from '@tanstack/vue-query';
import client from './queryClient';
import { QueryClient } from '@tanstack/query-core';

import { ThemeDefinition } from 'vuetify/lib/framework.mjs';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import 'vuetify/styles';

import elementPlus from 'element-plus';
import 'element-plus/dist/index.css';

import '@mdi/font/css/materialdesignicons.css';

import HighchartsVue from 'highcharts-vue'
import Highcharts from "highcharts";
import annotationsInit from "highcharts/modules/annotations";

annotationsInit(Highcharts);

export const theme: ThemeDefinition = {
  dark: false,
  colors: {
    navigation: '#215096',
    primary: '#2e7eed',
    secondary: '#f3f6f7',
    'ufabcnext-green': '#56cdb7',
    'next-gray': '#404040',
    'next-light-gray': '#848687',
    'ufabcnext-yellow': '#FFCB17',
    'ufabcnext-red': '#E17472',
    error: '#f45576',
    background: '#ffffff',
  },
};

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'theme',
    themes: {
      theme,
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
    queryClient: QueryClient;
  }
}

const queryClient = new QueryClientVue({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queryCache: client.getQueryCache() as any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultOptions: client.getDefaultOptions() as any,
});

createApp(App)
  .use(router)
  .use(vuetify)
  .use(elementPlus)
  .use(VueQueryPlugin, {
    queryClient,
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  .use(HighchartsVue as any)
  .mount('#app');