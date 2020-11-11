import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import router from './router';
import axios from 'axios'
import qs from 'qs'

Vue.prototype.$axios = axios;
Vue.prototype.qs = qs;
Vue.config.productionTip = false;

Vue.use(ElementUI);

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
});
