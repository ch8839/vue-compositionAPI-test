<template>
  <div class="demo-full-width">
    <mtd-upload
      class="picture-list"
      action="https://jsonplaceholder.typicode.com/posts/"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :file-list="fileList">
      <i class="mtdicon-add" />
    </mtd-upload>
    <mtd-modal v-model="dialogVisible">
      <img :src="dialogImageUrl" />
    </mtd-modal>
  </div>
</template>
<script>
export default {
  data () {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      fileList: [
        {
          name: 'food.jpeg',
          /* eslint-disable */
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
          /* eslint-disable */
        }
      ]
    };
  },
  methods: {
    handleRemove (file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
  },
};
</script>
<style>
.picture-list{
  text-align:left;
}
</style>
