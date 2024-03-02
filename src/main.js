import { createApp } from 'vue';
import { createPinia } from 'pinia';

import axios from 'axios';
// eslint-disable-next-line import/no-extraneous-dependencies
import VueAxios from 'vue-axios';
// eslint-disable-next-line import/no-extraneous-dependencies
import Loading from 'vue-loading-overlay';

// eslint-disable-next-line import/no-extraneous-dependencies
import VueDatePicker from '@vuepic/vue-datepicker';
// eslint-disable-next-line import/no-extraneous-dependencies
import '@vuepic/vue-datepicker/dist/main.css';

import './assets/all.scss';
import App from './App.vue';
import router from './router';

const app = createApp(App);
app.component('VueLoading', Loading);
app.component('VueDatePicker', VueDatePicker);

app.use(createPinia());
app.use(router);
app.use(VueAxios, axios);

app.mount('#app');
