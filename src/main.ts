import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const vuetify = createVuetify({
  components,
  directives,
});

import elementPlus from 'element-plus';
import 'element-plus/dist/index.css';

createApp(App).use(router).use(vuetify).use(elementPlus).mount('#app');
