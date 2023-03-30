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
    '--ufabcnext-green': '#3fcf8c',
    '--ufabcnext-blue': '#4f60ed',
    '--ufabcnext-darkgrey': 'rgba(0,0,0,0.8)',
    '--ufabcnext-yellow': '#ffcb17',
    '--ufabcnext-grey': 'rgba(0,0,0,0.5)',
    '--ufabcnext-lightgrey': 'rgba(0,0,0,0.3)',
    navigation: '#215096',
    '--ufabcnext-red': '#e17472',
    '--ufabcnext-nav-blue': '#409eff',
    '--ufabcnext-blue-light': '#6e6fda',
    '--ufabcnext-like': '#909090',
    '--ufabcnext-liked': '#065fd4',
    primary: '#2e7eed',
    background: '#ffffff',
    '--ufabcnext-secondary': '#393e56',
    '--ufabcnext-charcoal-grey': '#323544',
    '--ufabcnext-orange': '#ffc618',
    '--ufabcnext-purple': '#9007fb',
    '--ufabcnext-pink': '#d87dc6',
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

import elementPlus from 'element-plus';
import 'element-plus/dist/index.css';

createApp(App).use(router).use(vuetify).use(elementPlus).mount('#app');
