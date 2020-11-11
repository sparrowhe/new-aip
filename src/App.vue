<template>
  <div id="app">
    <div id="nav">
      <navbar />
    </div>
    <el-card class="pdf-card">
      <el-button-group>
        <el-button icon="el-icon-zoom-in" @click="handleIn"></el-button>
        <el-button icon="el-icon-zoom-out" @click="handleOut"></el-button>
      </el-button-group>
      &nbsp;
      <el-button-group>
        <el-button icon="el-icon-arrow-left" @click="handlePrev"></el-button>
        <el-button icon="el-icon-arrow-right" @click="handleNext"></el-button>
      </el-button-group>
      <br>
      {{currentPage}}/{{pageTotalNum}}
      <pdf
        :page="currentPage"
        ref="pdfView"
        @num-pages="pageTotalNum=$event"
        src="https://cafpc-efb.oss-cn-beijing.aliyuncs.com/2011/ZSAM/ZSAM.pdf"
      >
      </pdf>
    </el-card>
    <router-view/>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import Pdf from 'vue-pdf';

export default {
  data() {
    return {
      scale: 100,
      currentPage: 1,
    };
  },
  components: {
    navbar: Navbar,
    pdf: Pdf,
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    handleOut() {
      this.scale -= 5;
      this.$refs.pdfView.$el.style.width = `${parseInt(this.scale, 0)}%`;
    },
    handleIn() {
      if (this.scale < 100) this.scale += 5;
      else return;
      this.$refs.pdfView.$el.style.width = `${parseInt(this.scale, 0)}%`;
    },
    handleNext() {
      if (this.currentPage < this.pageTotalNum) this.currentPage += 1;
    },
    handlePrev() {
      if (this.currentPage > 1) {
        this.currentPage -= 1;
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

#nav {
  padding: 0px;
}

.pdf-card {
  max-width: 80%;
  margin-top: 30px;
  align-self: center;
}

body {
  margin: 0px;
}
</style>
