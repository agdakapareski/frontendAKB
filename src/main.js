import Vue from 'vue'
import App from './App.vue'
import vuetify from '@/plugins/vuetify'
import router from './router'
import axios from 'axios'
import VueHtmlToPaper from 'vue-html-to-paper';

const options = {
  name: '_blank',
  specs: [
    'fullscreen=yes',
    'titlebar=yes',
    'scrollbars=yes'
  ],
  styles: [
    'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.min.css',
    'https://unpkg.com/kidlat-css/css/kidlat.css'
  ],
  timeout: 1000, // default timeout before the print window appears
  autoClose: true, // if false, the window will not close after printing
  windowTitle: window.document.title, // override the window title
}

Vue.use(VueHtmlToPaper, options);

// or, using the defaults with no stylesheet
Vue.use(VueHtmlToPaper);

Vue.prototype.$htmlToPaper = VueHtmlToPaper;

Vue.config.productionTip = false

Vue.prototype.$http = axios;
Vue.prototype.$api = 'http://192.168.1.6:8000/api';

new Vue({
  vuetify,
  router,
  render: h => h(App),
}).$mount('#app')
