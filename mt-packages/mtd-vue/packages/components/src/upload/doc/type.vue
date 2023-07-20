<template>
  <div class="demo-full-width">
    <mtd-upload
      class="base-upload"
      :show-file-list="false"
      action="https://jsonplaceholder.typicode.com/posts/">
      <mtd-button icon="export-o">点击上传</mtd-button>
    </mtd-upload>
    <mtd-upload
      class="base-drag-upload"
      :show-file-list="false"
      drag
      action="https://jsonplaceholder.typicode.com/posts/">
      <i class="mtdicon-export-o" />
      <div class="mtd-upload-text">点击或将文件拖拽到这里上传</div>
    </mtd-upload>
  </div>
</template>
<style>
.base-upload{
  float: left;
  width: 50%;
}
.base-drag-upload {
  width: 50%;
  float:right;
}
.base-drag-upload .mtd-upload-dragger {
  width:240px;
  height: 120px;
}
.base-drag-upload .mtdicon-export-o {
  font-size: 26px;
  margin: 20px 0 0;
}
</style>
