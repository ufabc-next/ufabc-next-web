import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import { router } from './router';
import './assets/main.css';
import App from './App.vue';

import 'primevue/resources/primevue.min.css';

const app = createApp(App);

app.use(router);
app.use(PrimeVue);

app.mount('#app');
