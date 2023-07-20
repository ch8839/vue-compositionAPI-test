<template>
  <mtd-upload
    class="upload-base"
    action="https://jsonplaceholder.typicode.com/posts/"
    multiple
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :before-remove="beforeRemove"
    :show-file-down="true"
    :file-list="fileList">
    <mtd-button icon="export-o">点击上传</mtd-button>
  </mtd-upload>
</template>
<script>
export default {
  data () {
    return {
      multiple: true,
      fileList: [
        {
          name: "food1.jepg",
          url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
          thumbUrl: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
          size: 25687,
          user: '团团/tuantaun',
          time: '2022/5/20',
        },
        {
          name: "food2.jepg",
          url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
          thumbUrl: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
          size: 25687,
          user: '团团/tuantaun',
          time: '2022/5/20',
        },
      ],
    };
  },
  methods: {
    handleRemove (file, fileList) {
      console.log(file, fileList);
    },
    handlePreview (file) {
      console.log(file);
    },
    beforeRemove (file, fileList) {
      return this.$mtd.confirm({
        title: '删除文件',
        message: `确定移除${file.name}？`,
      });
    },
  },
};
</script>
<style>
.upload-base{
  width: 360px;
  text-align:left;
}
</style>
