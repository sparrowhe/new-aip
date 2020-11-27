<template>
  <el-card style="width: 800px auto; margin: auto; margin-top: 10px">
    <h1>关于</h1>
    <p>这是一款船新的AIP查看器，但他更像是一个EFB，汇集了模拟飞行中常用的工具和资料，而且在不断的完善和扩充中。</p>
    <p>在开发这款工具的同时，使用了许多开源的库和程序，为我的开发提供了极大的便利，在此一并向其表示感谢：</p>
    <ul>
      <li>Vue</li>
      <li>Element</li>
      <li>Leaflet</li>
      <li>OpenStreetMap</li>
      <li>Axios</li>
      <li>Webpack</li>
      <li>Express</li>
    </ul>
    <p>还有许多。按照开源界传统习俗，本查看器以GPLv2在GitHub开源：sparrowhe/new-aip。</p>
    <p>同时也获得了许多人的支持和帮助。目前该项目免费公开供大家使用，虽然前端架设在GitHubPages上，但后端服务器和CDN也是一笔不小的开支。</p>
    <p>如果你认可我的劳动成果并且想要支持我，可以扫描二维码打赏，备注打赏人和事项，我将会把这笔钱全部用在网站的维护上。</p>
    <el-avatar shape="square" :size="320" fit="scale-down" src="https://i.loli.net/2020/11/22/dkwET9sluOchJF4.jpg"></el-avatar>
    <p>真的<span @click="wahaha">{{ text }}</span>感谢</p>
  </el-card>
</template>

<script>
const TIPS = [
  '恭喜你发现彩蛋！（虽然没啥意义）',
  '你是真的无聊吗',
  '看在你这么无聊的份上就继续等把',
  '你真的不累吗',
  '你不累我都累了',
  '好了不和你斗了',
  '你赢了',
  '但是没有奖励',
  '所以你还是不肯走吗',
  '除了这个彩蛋真的没东西拉',
  '反正这个会一直循环下去，你不累电脑会累',
  '算了我还是帮你一把吧',
  '再不走的话就自动停止咯？',
  '看来你的确是不肯走了',
  '那就算了吧',
];
const YSRZ = '非常非常';
export default {
  name: 'About',
  data() {
    return {
      text: '非常非常',
      counter: 4,
      tipCounter: 0,
      handle: null,
    };
  },
  methods: {
    wahaha() {
      this.handle = this.handle || setInterval(() => {
        const TIP_DISTANCE = 100;
        if (this.counter >= (this.tipCounter + 1) * TIP_DISTANCE && TIPS[this.tipCounter]) {
          const TIP = TIPS[this.tipCounter];
          const ADD_POS = (this.counter++ - (this.tipCounter + 1) * TIP_DISTANCE);
          if (ADD_POS > TIP.length - 1) {
            this.tipCounter++;
          } else {
            this.text += TIP[ADD_POS];
          }
        } else if (!TIPS[this.tipCounter]) {
          clearInterval(this.handle);
          this.handle = null;
          this.text = '非常非常';
        } else {
          this.text += YSRZ[(this.counter++) % YSRZ.length];
        }
      }, 200);
    },
  },
};
</script>

<style>
</style>
