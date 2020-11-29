import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/view/Home.vue';
import Erc from '@/view/Erc.vue';
import Weather from '@/view/Weather.vue';
import Naip from '@/view/Naip.vue';
import About from '@/view/About';

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
  {
    path: '/weather',
    name: 'Weather',
    component: Weather,
  },
  {
    path: '/naip',
    name: 'NAIP',
    component: Naip,
  },
  {
    path: '/about',
    name: 'About',
    component: About,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
