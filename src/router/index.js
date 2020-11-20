import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/view/Home.vue';
import Erc from '@/view/Erc.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/erc',
    name: 'ERC',
    component: Erc,
  },
  /// TODO: 航路图
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
