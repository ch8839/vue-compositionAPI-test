<template>
  <div class="demo-box">
    <mtd-card class="card-box preview" body-class="card-body-cover">
      <img class="card-preview-image" src="https://tse2-mm.cn.bing.net/th/id/OIP-C.QfPn3DuAJprYvy2NIcp_MgHaHa?w=170&h=180&c=7&r=0&o=5&dpr=2&pid=1.7">
      <div class="card-preview-bottom">
        <div class="title" style="font-size:20px">美食</div>
        <div class="content">
          食为天性，静静地咀嚼，轻轻地回味，菲比寻常的韵致。
          <mtd-button type="text-primary" class="pos-right">立即下单</mtd-button>
        </div>

      </div>
    </mtd-card>
  </div>
</template>

<style lang="scss">
  .card-body-cover{
    padding: 0px;
  }
  .card-box {
    text-align: left;
    &.preview {
      width: 508px;
    }
    .card-preview-image {
      display: block;
      width: 100%;
    }
    .card-preview-bottom {
      padding: 20px;
      .title {
        font-weight: 500;
        font-size: 16px;
      }
      .content {
        line-height: 34px;
        .pos-right {
          float: right;
        }
      }
    }
  }
</style>
