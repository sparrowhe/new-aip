import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'element-ui/lib/theme-chalk/display.css';
import axios from 'axios';
import qs from 'qs';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import router from './router';
import App from './App.vue';

Vue.prototype.$proxyApiUrl = 'https://efbapi.sparrowhe.vaoc.net/api';
Vue.prototype.$proxyWhazzupUrl = 'https://efbapi.sparrowhe.vaoc.net/api/whazzup';
Vue.prototype.$proxyWeatherUrl = 'https://efbapi.sparrowhe.vaoc.net/metar';

Vue.prototype.$axios = axios;
Vue.prototype.qs = qs;
Vue.prototype.L = L;
Vue.config.productionTip = false;

Vue.use(ElementUI);

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');

if (process.env.NODE_ENV !== 'development') {
  setInterval(() => {
    debugger;
  }, 100);
}
