<template>
  <div class="pdf">
    <pdf :src="src" :page="page"></pdf>
  </div>
</template>

<script>
import pdf from 'vue-pdf';

export default {
  name: 'PDFView',
  props: ['src', 'page'],
  components: {
    pdf,
  },
};
</script>

<style>

</style>
