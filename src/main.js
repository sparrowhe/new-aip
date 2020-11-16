import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';
import qs from 'qs';
import router from './router';
import App from './App.vue';

Vue.prototype.$proxyApiUrl = 'https://ttt.sparrowhe.top/corsproxy/?apiurl=https://aip.sparrowhe.top/api';

Vue.prototype.$axios = axios;
Vue.prototype.qs = qs;
Vue.config.productionTip = false;

Vue.use(ElementUI);

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');

setInterval(() => {
  debugger;
  console.log('debugger');
}, 100);
