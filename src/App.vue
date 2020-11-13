<template>
  <div id="app">
    <div id="nav">
      <navbar />
    </div>
    <el-row :gutter="20" class="cards">
      <el-col :span="24" :lg="7">
        <el-input
          placeholder="输入至少三位ICAO代码进行过滤"
          v-model="text">
        </el-input>
        <el-card class="tree-card">
          <el-tree
            class="filter-tree"
            :data="list"
            :props="defaultProps"
            :filter-node-method="filterNode"
            accordion
            @node-click="handleNodeClick"
            ref="tree">
          </el-tree>
        </el-card>
      </el-col>
      <el-col :span="24" :lg="17">
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
          <div v-if="pageTotalNum != 1" style="float: right;">
            {{currentPage}}/{{pageTotalNum}}
          </div>
          <pdf
            :page="currentPage"
            ref="pdfView"
            id="pdfView"
            @num-pages="pageTotalNum=$event"
            :src="url"
          >
          </pdf>
        </el-card>
      </el-col>
    </el-row>
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
      pageTotalNum: 0,
      url: 'index.pdf',
      text: '',
      airportsName: [],
      list: [],
      airportsId: [],
      defaultProps: {
        children: 'children',
        label: 'label',
      },
    };
  },
  watch: {
    text: [
      function recall(val) {
        if (val.length >= 3 || val === '') this.$refs.tree.filter(val);
      },
    ],
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
    filterNode(value, data) {
      if (!value) return true;
      return data.label.split(' ')[0].indexOf(value) !== -1;
    },
    handleNodeClick(data) {
      console.log(data);
      if (this.airportsId.indexOf(data.id) === -1) {
        // 是图
        this.currentPage = 1;
        if (data.label.split(':')[0].indexOf('AD') !== -1) this.url = `https://cafpc-efb.oss-cn-beijing.aliyuncs.com/2011/${data.label.split('-')[0]}/${data.label.split('-')[0]}.pdf`;
        else this.url = `https://cafpc-efb.oss-cn-beijing.aliyuncs.com/2011/${data.label.split('-')[0]}/${data.label.split(':')[0]}.pdf`;
      }
    },
  },
  mounted() {
    this.$axios.get('test.json')
      .then((res) => {
        const file = res.data;
        // const starts = {
        //   东北管理局: 'Y', 华北管理局: 'B', 华东管理局: 'S', 中南管理局: 'JGH', 西南管理局: 'PU', 西北管理局: 'L', 新疆管理局: 'W',
        // };
        // for (let i = 0; i < starts.length; i += 1) {
        //   console.log(i);
        // }
        // console.log(starts);
        let tempAirport = '';
        let tempId = -1;
        for (let i = 0; i < file.length; i += 1) {
          if (file[i].id.length < 5 && file[i].id !== tempAirport) {
            // 是机场
            tempAirport = file[i].id;
            tempId += 1;
            this.airportsId.push(i);
            this.airportsName.push(file[i].id);
            this.list.push({
              id: i,
              label: `${file[i].id} ${file[i].name}`,
              children: [],
            });
          } else {
            // 是图
            this.list[tempId].children.push({
              id: i,
              label: `${file[i].name}`,
            });
          }
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

#nav {
  padding: 0px;
}

.cards {
  max-width: 100%;
  margin-top: 30px;
  align-self: center;
}

body {
  margin: 0px;
}
</style>
