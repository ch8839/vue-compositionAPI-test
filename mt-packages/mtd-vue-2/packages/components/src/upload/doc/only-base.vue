<template>
  <mtd-upload
    class="only-base-upload"
    :limit="1"
    ref="upload"
    :file-list="fileList"
    multiple
    action="https://jsonplaceholder.typicode.com/posts/">
    <mtd-button slot="trigger" icon="export-o" @click="clearFiles">点击上传</mtd-button>
  </mtd-upload>
</template>
<script>
export default {
  data () {
    return {
      multiple: true,
      fileList: [
        {
          name: 'food.jpeg',
          /* eslint-disable */
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
          /* eslint-disable */
        }
      ]
    }
  },
  methods: {
    clearFiles () {
      this.$refs.upload.clearFiles();
    },
  },
};
</script>
<style>
.only-base-upload{
  width: 360px;
  text-align:left;
}
</style>
