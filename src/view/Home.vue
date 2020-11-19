<template>
<div>
  <el-row :gutter="15" class="cards">
    <el-col :span="24" :lg="7">
      <el-card class="tree-card" shadow="never">
        <el-input
          class="search"
          placeholder="输入至少三位ICAO代码进行过滤"
          v-model="findText">
        </el-input>
        <div class="tree-container" style = "height:750px;overflow:auto;">
          <el-tree
            class="filter-tree"
            :data="list"
            :props="defaultProps"
            :filter-node-method="filterNode"
            accordion
            @node-click="handleNodeClick"
            ref="tree">
          </el-tree>
        </div>
      </el-card>
      </el-col>
    <el-col :span="24" :lg="17">
      <el-card class="pdf-card" style="height:800px; overflow:auto;">
        <el-button-group>
          <el-button icon="el-icon-zoom-in" @click="handleIn"></el-button>
          <el-button icon="el-icon-zoom-out" @click="handleOut"></el-button>
        </el-button-group>
        &nbsp;
        <el-button-group>
          <el-button icon="el-icon-arrow-left"
            @click="handlePrev"
            :disabled="pageTotalNum == 1 && pageTotalNum !== undefined ? true : false">
          </el-button>
          <el-button icon="el-icon-arrow-right"
            @click="handleNext"
            :disabled="pageTotalNum == 1 && pageTotalNum !== undefined ? true : false"
          ></el-button>
        </el-button-group>
        <div v-if="pageTotalNum != 1 && pageTotalNum != undefined" style="float: right;">
          {{currentPage}}/{{pageTotalNum}}
        </div>
        <div style = "overflow-x:auto;">
        <pdf
          v-loading.fullscreen.lock="loadedRatio != 1"
          :page="currentPage"
          ref="pdfView"
          id="pdfView"
          @num-pages="pageTotalNum = $event"
          @progress="loadedRatio = $event"
          :src="url"
        >
        </pdf>
        </div>
      </el-card>
    </el-col>
  </el-row>
</div>
</template>

<script>
import Pdf from 'vue-pdf';

export default {
  data() {
    return {
      availableCycle: 0,
      scale: 100,
      currentPage: 1,
      loadedRatio: 0,
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
  computed: {
    findText: {
      get: function getText() {
        return this.text;
      },
      set: function setText(val) {
        this.text = val.toUpperCase();
      },
    },
  },
  watch: {
    text: [
      function recall(val) {
        if (val.length >= 3 || val === '') this.$refs.tree.filter(val);
        else this.$refs.tree.filter('');
      },
    ],
  },
  components: {
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
      if (this.scale < 180) this.scale += 5;
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
        if (data.label.split(':')[0].indexOf('AD') !== -1) this.url = `https://cafpc-efb.oss-cn-beijing.aliyuncs.com/2011/${data.label.split('-')[0]}/${data.label.split('-')[0]}.pdf`;
        else this.url = `https://cafpc-efb.oss-cn-beijing.aliyuncs.com/${this.availableCycle}/${data.label.split('-')[0]}/${data.label.split(':')[0]}.pdf`;
        this.currentPage = 1;
      }
    },
    async getCycleJson() {
      await this.getAvailableCycle();
      this.$axios.get(`${this.$proxyApiUrl}/${this.availableCycle}.json`)
        .then((res) => {
          const file = res.data;
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
    async getAvailableCycle() {
      await this.$axios.get(`${this.$proxyApiUrl}/available.json`).then((res) => {
        this.availableCycle = res.data.version;
      });
    },
  },
  mounted() {
    this.getCycleJson();
  },
};
</script>

<style>
.cards {
  max-width: 100%;
  margin-top: 30px;
  align-self: center;
}

.search {
  margin-bottom: 5px;
}
</style>
