<template>
<div>
  <el-row :gutter="15" class="cards">
    <el-col :span="24" :lg="7">
      <el-card shadow="never">
        <el-input
          class="search"
          placeholder="输入航路/导航台/航路点进行搜索"
          v-model="findText"
          @keyup.enter.native="search"
          >
        </el-input>
        <div class="block">
        </div>
      </el-card>
      </el-col>
    <el-col :span="24" :lg="17">
      <el-slider
        v-model="opacity"
        :show-tooltip="false"
        :min="0.1"
        :max="1"
        :step="0.01"
        class="silder">
      </el-slider>
      <div id="map">
      </div>
    </el-col>
  </el-row>
</div>
</template>

<script>
import marker_icon from 'leaflet/dist/images/marker-icon-2x.png';

export default {
  name: 'Erc',
  data() {
    return {
      text: '',
      map: null,
      url: 'https://cafpc-efb.oss-cn-beijing.aliyuncs.com/2009/ENR6/Fixed/',
      opacity: 1,
      map_layer: null,
      fixes: {},
      airports: {},
      routes: {},
      user_route: [],
      route_points: [],
      markers: []
    };
  },
  watch: {
    opacity: [
      function recall(val) {
        this.map_layer.setOpacity(val);
      },
    ],
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
  methods: {
    findRoute() {
      return 'TODO';
    },
    initMap() {
      const map = this.L.map('map', {
        minZoom: 3,
        maxZoom: 14,
        center: [39.550339, 116.114129],
        zoom: 8,
        zoomControl: true,
      });
      this.map = map;
      window.map = map;
      this.L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' },
      ).addTo(this.map);
      this.map_layer = this.L.tileLayer(
        `${this.url}{z}/{x}/{y}.png`,
        { attribution: '&copy; <a href="http://www.atmb.net.cn/">ATMB</a> contributors' },
      ).addTo(this.map);
    },
    initFAR(url) {
      this.$axios.get(`${url}/fixes.db`).then((res) => {
        const a = res.data.split('\n');
        for (let b = 0, c = a.length; b < c; b += 1) {
          const e = a[b].split(' ');
          // console.log(e);
          this.fixes[e[0]] = [e[1], e[2]];
        }
      });
      this.$axios.get(`${url}/routes.db`).then((res) => {
        const a = res.data.split('\n');
        for (let b = 0, c = a.length; b < c; b += 1) {
          for (let e = a[b].split(' ')[0].trim(), d = a[b].split(' ').slice(1), f = 0, g = d.length; f < g; f += 1) {
            e in this.routes || (this.routes[e] = []), this.routes[e].push(d[f].trim());
          }
        }
      });
      this.$axios.get(`${url}/airports.db`).then((res) => {
        const a = res.data.split("\n");
        for (let b = 0, c = a.length; b < c; b += 1) {
          let e = a[b].split(" ");
          this.airports[e[0]] = [e[1], e[2]]
        }
      });
    },
    setPosition(a, b, c) {
      var blueIcon = L.icon({
	      iconUrl:marker_icon,
	      iconSize: [25, 41],
	      iconAnchor: [13, 21]
	    });
      this.map.setZoom(c)
      this.map.flyTo([a,b]);
      this.markers.push(this.L.marker([a,b], { icon: blueIcon }).addTo(this.map))
    },
    search() {
      const str = this.text;
      console.log(str);
      for(let a in this.fixes) {
        if(a.split('.')[0] == str) {
          console.log(this.fixes[a][0], this.fixes[a][1]);
          this.setPosition(this.fixes[a][0], this.fixes[a][1], 9);
          return;
        }
      }
      if(str in this.airports) {
        this.setPosition(this.airports[str][0], this.airports[str][1], 9);
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initMap();
      this.initFAR('https://cafpc-efb.oss-cn-beijing.aliyuncs.com/Others');
    });
  },
};
</script>

<style>
#map {
  position: fixed;
  width: 100%;
  height: 90vh;
  z-index:-1;
}
.silder {
  position: absolute;
  right: 15px;
  width: 150px;
}
</style>
