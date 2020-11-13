import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';
import qs from 'qs';
import App from './App.vue';

Vue.prototype.$axios = axios;
Vue.prototype.qs = qs;
Vue.config.productionTip = false;

Vue.use(ElementUI);

new Vue({
  render: (h) => h(App),
}).$mount('#app');
