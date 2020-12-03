<template>
<div>
  <h1>年轻人不讲武德，耗子尾汁</h1>
  <h2 @click="ar">{{ text }}</h2>
</div>
</template>

<script>
export default {
  name: 'Naip',
  data() {
    return {
      text: '需要授权',
    };
  },
  methods: {
    ar() {
      this.text = '授权成功，但你还是没有NAIP看';
    },
  },
};
</script>

<style>

</style>
