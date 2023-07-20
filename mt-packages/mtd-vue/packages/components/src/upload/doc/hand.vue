<template>
  <mtd-upload
    class="upload-demo"
    ref="upload"
    action="https://jsonplaceholder.typicode.com/posts/"
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :auto-upload="false">
    <mtd-button slot="trigger" icon="export-o">选取文件</mtd-button>
    <mtd-button style="margin-left: 10px;" @click="submitUpload">开始上传</mtd-button>
  </mtd-upload>
</template>
<script>
export default {
  methods: {
    submitUpload () {
      this.$refs.upload.submit();
    },
    handleRemove (file, fileList) {
      console.log(file, fileList);
    },
    handlePreview (file) {
      console.log(file);
    },
  },
};
</script>
<style>
.upload-demo{
  width: 360px;
  text-align:left;
}
</style>
