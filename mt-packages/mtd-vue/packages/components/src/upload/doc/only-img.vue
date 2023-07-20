<template>
  <mtd-upload
    class="avatar-uploader"
    action="https://jsonplaceholder.typicode.com/posts/"
    accept="image/*"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :on-error="handleAvatarError"
    :before-upload="beforeAvatarUpload">
    <img v-if="imageUrl" :src="imageUrl" class="avatar">
    <i v-else class="mtdicon-add avatar-uploader-icon" />
    <span class="avatar-uploader-text">上传图像</span>
  </mtd-upload>
</template>
<script>
export default {
  data () {
    return {
      imageUrl: '',
    }
  },
  methods: {
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    handleAvatarError (err) {
      console.log(err)
    },
    beforeAvatarUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$mtd.message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt2M
    },
  },
}
</script>
<style>
.avatar-uploader {
  text-align: left;
}
.avatar-uploader .mtd-upload {
  background-color: rgba(0,0,0,0.04);
  border-radius: 10px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
}
.avatar-uploader .mtd-upload:hover {
  background-color: rgba(0,0,0,0.06);
}
.avatar-uploader-icon {
  font-size: 28px;
  color: rgba(0,0,0,0.7);
  width: 100px;
  height: 100px;
  line-height: 80px;
  text-align: center;
}
.avatar-uploader-text{
  width: 100px;
  text-align: center;
  position: absolute;
  left: 0;
  bottom: 25px;
  font-size: 12px;
  color: rgba(0,0,0,0.9);
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>
