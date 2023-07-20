<template>
  <mtd-upload
    class="drag-upload"
    drag
    action="https://jsonplaceholder.typicode.com/posts/"
    multiple>
    <i class="mtdicon-export-o" />
    <div class="mtd-upload-text">将文件拖到此处，或<em>点击上传</em></div>
    <div class="mtd-upload-text sub-title">支持扩展名：.rar .zip .doc .docx .pdf .jpg...</div>
  </mtd-upload>
</template>
<style>
.drag-upload {
  text-align:left;
  width:360px;
}
.drag-upload .sub-title{
  font-size: 12px;
  color: #ADADAD;
}
</style>
