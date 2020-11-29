<template>
  <el-row :gutter="15" class="cards">
    <el-col :span="24" :lg="5">
      <el-card>
        <el-input
          class="search"
          placeholder="输入机场ICAO代码查询"
          v-model="text"
          @keyup.enter.native="search"
          >
        </el-input>
        <el-button type="primary" @click="search">查询</el-button>
      </el-card>
      <br>
      <el-card shadow="never">
        <p>本页面中所有时间均为UTC时间</p>
      </el-card>
    </el-col>
    <el-col :lg="7">
      <div v-for="(item,i) in weathers" :key="i">
      <el-card>
        {{ item.content }}
        <br>
        数据发布时间：{{ item.datatime }}
        <br>
        释义：{{ item.translation }}
      </el-card>
      <br>
      </div>
    </el-col>
    <el-col :span="24" :lg="12">
      <p v-if="otime !== ''">更新时间：{{ otime }}</p>
      <div v-for="(itema,i) in awos" :key="i">
        <el-card>
          <!-- {{ itema.runway_group }} -->
        <!-- <div v-for="(item,x) in itema.runway" :key="x"> -->
            <el-table
              :data="itema.runway"
              border
              style="width: 100%">
            <el-table-column
              prop="name"
              fixed
              label="跑道编号"
              width="180">
            </el-table-column>
            <el-table-column
              prop="mor"
              label="MOR(m)"
              width="180">
            </el-table-column>
            <el-table-column
              prop="rvr"
              label="RVR(m)">
            </el-table-column>
            <el-table-column
              prop="qnh"
              label="QNH(hPa)">
            </el-table-column>
            <el-table-column
              prop="qfe"
              label="QFE(hPa)">
            </el-table-column>
            <el-table-column
              prop="cbase"
              label="CBase(m)">
            </el-table-column>
            <el-table-column
              prop="humid"
              label="相对湿度(%)">
            </el-table-column>
            <el-table-column
              prop="temp"
              label="温度(°C)">
            </el-table-column>
           </el-table>
          <br>
        <!-- </div> -->
        </el-card>
        <br>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'Weather',
  data() {
    return {
      text: '',
      weathers: [],
      awos: [],
      otime: '',
    };
  },
  methods: {
    search() {
      if (this.text.length !== 4) {

      } else {
        this.$axios.post(`${this.$proxyWeatherUrl}/${this.text.toUpperCase()}`)
          .then((res) => {
            const { data } = res;
            if (data.status == 0) {
              const weatherMessage = data.data.weatherMessage[0].list;
              this.weathers.length = 0;
              for (const a in weatherMessage) {
                this.weathers.push({
                  content: weatherMessage[a].CONTENT,
                  datatime: weatherMessage[a].DATETIME,
                  translation: weatherMessage[a].TRANSLATION,
                });
              }
            } else {
              this.$message.error('目前暂无该机场的气象信息');
            }
          }).catch((err) => {
            this.$message.error('出现了一些微小的偏差');
            console.log(err);
          });
        this.$axios.post(`${this.$proxyWeatherUrl}/awos/${this.text.toUpperCase()}`)
          .then((res) => {
            const { data } = res;
            this.awos = [];
            if (data.status == 0) {
              const awosData = data.data;
              if(!awosData.length) {
                this.otime='';
                return;
              }
              this.data = 0;
              for (const a in awosData) {
                const dataTemp = {};
                // dataTemp.runway_group = awosData[a].rno;
                dataTemp.runway = [];
                for (const b in awosData[a].awos) {
                  console.log(awosData[a]);
                  dataTemp.runway.push({
                    name: awosData[a].awos[b].NAME,
                    mor: awosData[a].awos[b].MOR_1A.toString().replace('-999', '无数据'),
                    rvr: awosData[a].awos[b].RVR_1A.toString().replace('-999', '无数据'),
                    qnh: awosData[a].awos[b].QNH.toString().replace('-999', '无数据'),
                    qfe: awosData[a].awos[b].QFE.toString().replace('-999', '无数据'),
                    cbase: awosData[a].awos[b].CLD_HL.toString().replace('-999', '无数据'),
                    humid: awosData[a].awos[b].HUMID.toString().replace('-999', '无数据'),
                    temp: awosData[a].awos[b].TEMP.toString().replace('-999', '无数据'),
                  });
                  this.otime = awosData[a].awos[b].OTIME;
                }
                this.awos.push(dataTemp);
              }
            }
          });
      }
    },
  },
};
</script>

<style>

</style>
