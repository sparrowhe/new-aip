<template>
  <div id="app">
    <navbar></navbar>
    <router-view></router-view>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';

export default {
  components: {
    navbar: Navbar,
  },
  mounted() {
    this.initCNZZ();
    this.$nextTick(() => {
      if (localStorage.getItem('visit') !== 'true') {
        localStorage.setItem('visit', true);
        this.$notify({
          title: '警告',
          message: '本查看器所有航行资料来源于CAAC ATMB，仅限用于模拟飞行，不对数据的完整性和正确性做保证，不承担使用本查看器所造成的任何责任',
          duration: 0,
          type: 'warning',
        });
      }
    });
  },

  methods: {
    initCNZZ() {
      // 添加脚本
      const script = document.createElement('script');
      script.src = 'https://s9.cnzz.com/z_stat.php?id=1279478936&web_id=1279478936';
      script.language = 'JavaScript';
      script.id = 'cnzz';
      document.body.appendChild(script);
    },
  },
  watch: {
    $route() {
      if (window._czc) {
        // 监听路由变化
        const { location } = window;
        const contentUrl = location.pathname + location.hash;
        const refererUrl = '/';
        window._czc.push(['_trackPageview', contentUrl, refererUrl]);
      }
    },
  },

};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

body {
  margin: 0px;
}
</style>
