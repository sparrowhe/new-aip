<template>
<div>
  <el-row :gutter="8" class="cards">
    <el-col :span="24" :lg="7">
      <el-card shadow="never">
        <div>
          <el-input
            class="search"
            placeholder="起飞机场"
            v-model="dep"
            @keyup.enter.native="search"
            :disabled="isLoading"
          >
          </el-input>
          <el-input
            class="search"
            placeholder="降落机场"
            v-model="arr"
            @keyup.enter.native="search"
            :disabled="isLoading"
          >
          </el-input>
        <el-input
          class="search"
          placeholder="输入航路/导航台/航路点进行搜索"
          v-model="findText"
          @keyup.enter.native="search"
          :disabled="isLoading"
          >
        </el-input>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="danger" @click="clear">清空</el-button>
        </div>
        <div style="margin-top:5px;">
        <el-input
          class="search"
          placeholder="输入SINO上的机组呼号进行跟踪"
          v-model="callsign"
          :disabled="timer !== null"
        >
        </el-input>
        <el-button type="primary" @click="startCracker" :disabled="timer !== null">开始跟踪</el-button>
        <el-button type="primary" @click="loadPlan">载入计划</el-button>
        <el-button type="danger" @click="stopCracker" :disabled="timer == null">停止跟踪</el-button>
        </div>
        <div style="margin-top:5px">
          <el-switch
          v-model="followPosition"
          active-text="跟随位置"
          inactive-text="不跟随位置"
          active-color="#13ce66"
          inactive-color="#ff4949">
        </el-switch>
        <el-slider
        v-model="opacity"
        :show-tooltip="false"
        :min="0.1"
        :max="1"
        :step="0.01"
        class="silder">
      </el-slider>
        </div>
      </el-card>
      </el-col>
    <el-col :span="24" :lg="17">
      <div id="map">
      </div>
    </el-col>
  </el-row>
</div>
</template>

<script>
import marker_icon from 'leaflet/dist/images/marker-icon-2x.png';
import nav_icon from '@/assets/nav_station.png';
import airplane_icon from '@/assets/aircraft_autonavi.png';
import 'vue2-leaflet-rotatedmarker';

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
      route_line: null,
      markers: [],
      callsign: '',
      timer: null,
      planeMarker: null,
      followPosition: false,
      isLoading: false,
      dep: '',
      arr: '',
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
        const a = res.data.split('\n');
        for (let b = 0, c = a.length; b < c; b += 1) {
          const e = a[b].split(' ');
          this.airports[e[0]] = [e[1], e[2]];
        }
      });
    },
    setPosition(a, b, c) {
      const blueIcon = L.icon({
	      iconUrl: marker_icon,
	      iconSize: [25, 41],
	      iconAnchor: [13, 21],
	    });
      this.map.setZoom(c);
      this.map.flyTo([a, b]);
      this.markers.push(this.L.marker([a, b], { icon: blueIcon }).addTo(this.map));
    },
    setAirplaneMarker(a, b, c) {
      const AirplaneIcon = L.icon({
        iconUrl: airplane_icon,
        iconAnchor: [12, 12],
      });
      this.followPosition ? this.map.flyTo([a, b]) : null;
      if (this.planeMarker !== null) {
        this.planeMarker.setLatLng([a, b]);
      } else {
        this.planeMarker = this.L.marker([a, b], { icon: AirplaneIcon, rotationAngle:c}).addTo(this.map);
      }
    },
    routeParse(a) {
      let b = !0;
      a = a.split(' ');
      let c = [];
      for (d in a) a[d].trim() != '' && c.push(a[d].trim());
      let e = [];
      a = [];
      var d = 1;
      for (var f = c.length; d < f; d += 2) {
        if (d - 1 >= 0 && d + 1 <= f - 1) e.push([c[d], c[d - 1], c[d + 1]]);
        else {
          b = !1;
          break;
        }
      } if (b) {
        for (d in e) {
          c = e[d];
          if (!(c[0] in this.routes) && c[0] != 'DCT') {
            console.log(`route ${c[0]} does not exist`);
            b = !1;
            break;
          }
          if (c[0] == 'DCT') {
            console.log('route DCT does not support');
            b = !1;
            break;
          } else {
            f = this.routes[c[0]];
            let g = -1;
            let h = -1;
            for (d in f) {
              if (f[d].split('.')[0] == c[1] && (g = d), f[d].split('.')[0]
            == c[2] && (h = d), g != -1 && h != -1) break;
            }
            if (g == -1 || h == -1) console.log(`navs does not in route ${c[0]}`), b = !1;
            if (!b) break;
            g = parseInt(g);
            h = parseInt(h);
            if (g > h) for (d = g; d >= h; d--) a.push(f[d]);
            else for (d = g; d <= h; d++) a.push(f[d]);
          }
        }
      }
      f = a.length;
      for (d = f - 1; d >= 1; d--) a[d] == a[d - 1] && a.splice(d, 1);
      e = [];
      for (d in a) {
        if (!(a[d] in this.fixes)) {
          console.log(`fixes ${a[d]} does not exist`);
          b = !1;
          break;
        }
        e.push(this.fixes[a[d]]);
      }
      return {
        success: b,
        routes: a,
        latlng: e,
      };
    },
    addRouteMarker(a, b, c) {
      const NavIcon = L.icon({
	      iconUrl: nav_icon,
	      iconAnchor: [5, 5],
      });
      this.markers.push(this.L.marker([a, b], { icon: NavIcon, rotationAngle: c }).addTo(this.map));
    },
    setRoute(route, dep, arr) {
      const a = this.routeParse(route);
      let flag = false;
      if(dep !== '' && arr !== '') {
        if (dep in this.airports) {
          this.setPosition(this.airports[dep][0], this.airports[dep][1], 9);
          a.latlng.unshift([this.airports[dep][0], this.airports[dep][1]]);
          flag = true;
        } else {
          flag = false;
        }
        if (arr in this.airports) {
          this.setPosition(this.airports[arr][0], this.airports[arr][1], 9);
          a.latlng.push([this.airports[arr][0], this.airports[arr][1]]);
          flag = true;
        } else {
          flag = false;
        }
      }
      console.log(a);
      if (a.success) {
        for (var b in a.latlng) {
          if(flag) {
            if(b == 0 || b == a.latlng.length - 1) {
              continue;
            }
          }
          this.addRouteMarker(a.latlng[b][0], a.latlng[b][1]);
          this.map.flyTo([a.latlng[b][0], a.latlng[b][1]]);
        }
        this.route_line = L.polyline(a.latlng, { color: 'orange' })
          .addTo(this.map);
      } else {
        this.$notify.error({
          title: '错误',
          message: '你输入的航路貌似不正确，暂不支持包含DCT的航路',
        });
      }
    },
    search() {
      const str = this.text;
      this.clear();
      console.log(str);
      for (const a in this.fixes) {
        if (a.split('.')[0] == str) {
          console.log(this.fixes[a][0], this.fixes[a][1]);
          this.setPosition(this.fixes[a][0], this.fixes[a][1], 9);
          return;
        }
      }
      if (str in this.airports) {
        this.setPosition(this.airports[str][0], this.airports[str][1], 9);
        return;
      }
      if (str.indexOf(' ') !== -0) {
        this.setRoute(str, this.dep, this.arr);
        return;
      }
      this.$notify.error({
        title: '错误',
        message: '你输入的貌似并不是一个导航台/机场/航路',
      });
    },
    clear() {
      for (const i in this.markers) {
        this.markers[i].remove();
      }
      this.markers.length = 0;
      this.route_line !== null ? this.route_line.remove() : null;
      this.route_line = null;
    },
    startCracker() {
      this.timer = setInterval(this.getPositionSINO, 5000);
    },
    stopCracker() {
      clearInterval(this.timer);
      this.timer = null;
      this.planeMarker.remove();
      this.planeMarker = null;
    },
    getPositionSINO() {
      const call = this.callsign;
      this.$axios.get(`${this.$proxyWhazzupUrl}${Math.random()}`)
        .then((res) => {
          const whazzup = res.data.split('\n');
          const clients_position = whazzup.indexOf('!CLIENTS');
          for (const a in whazzup) {
            if (a > clients_position) {
              const line = whazzup[a].split(':');
              if (line.indexOf(call) == 0) {
                this.setAirplaneMarker(line[5], line[6], Math.round(((parseInt(line[line.length - 1]) & 4092) >> 2) / 1024 * 360));
              }
            }
          }
        });
    },
    loadPlan() {
      this.text = 'Loading...';
      this.dep = 'Loading...';
      this.arr = 'Loading...';
      this.isLoading = true;
      const call = this.callsign;
      this.$axios.get(`${this.$proxyWhazzupUrl}${Math.random()}`)
        .then((res) => {
          this.isLoading = false;
          const whazzup = res.data.split('\n');
          const clients_position = whazzup.indexOf('!CLIENTS');
          for (const a in whazzup) {
            if (a > clients_position) {
              const line = whazzup[a].split(':');
              if (line.indexOf(call) == 0) {
                this.text = line[30];
                this.dep = line[11];
                this.arr = line[13];
                this.search();
                return;
              }
            }
          }
          this.text = '404 Not Found';
          this.dep = '404 Not Found';
          this.arr = '404 Not Found';
        })
        .catch((err) => {
          this.text = 'Something Error.';
          this.dep = 'Something Error.';
          this.arr = 'Something Error.';
          console.log(err);
          this.isLoading = false;
        });
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
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
  width: 100%;
  height: 90vh;
}
.cards {
  max-width: 100%;
  margin-top: 30px;
  align-self: center;
}
</style>
