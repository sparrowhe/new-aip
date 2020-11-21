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
    this.$nextTick(() => {
      if(localStorage.getItem('visit') !== 'true'){
        localStorage.setItem('visit',true);
        this.$notify({
          title: '警告',
          message: '本查看器所有航行资料来源于CAAC ATMB，仅限用于模拟飞行，不对数据的完整性和正确性做保证，不承担使用本查看器所造成的任何责任',
          duration: 0,
          type: 'warning',
        });
      }
    });
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
