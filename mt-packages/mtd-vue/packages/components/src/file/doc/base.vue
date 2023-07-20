<template>
  <div class="demo-full-width">
    <mtd-radio-group v-model="type" >
      <mtd-radio disabled value="text">文字型</mtd-radio>
      <mtd-radio value="border-panel">线框型</mtd-radio>
      <mtd-radio value="filled-panel">面板型</mtd-radio>
      <mtd-radio value="picture-card">图片型</mtd-radio>
    </mtd-radio-group>
    <ul >
      <mtd-file v-for="(file,index) in files" :file="file" :key="index" style="margin:0 8px 8px 0" :type="type"/>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      type: 'border-panel',
      files: [
        {
          name: "food1.jepg",
          status: "success",
          uid: 1660048779185,
          url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
          thumbUrl: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
          size: 25687,
          
          user: '团团/tuantaun',
          time: '2022/5/20',
        },
        {
          name: "food2.jepg",
          status: "uploading",
          percentage: 63,
          uid: 1660048779185,
          url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
          thumbUrl: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
          size: 25687,
        },
        {
          name: "food3.jepg",
          status: "fail",
          statusMsg: "上传错误",
          uid: 1660048779185,
          url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
          thumbUrl: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
          size: 25687,
        },
      ],
    };
  },
  methods: {
    handleChange(value) {
      console.log(value);
    },
  },
};
</script>
