<template>
  <div class="demo-box">
    <mtd-card class="card-box" body-class="card-body-cover">
      <div class="card-info">
        <img class="card-info-pic" src="https://tse2-mm.cn.bing.net/th/id/OIP-C.QfPn3DuAJprYvy2NIcp_MgHaHa?w=170&h=180&c=7&r=0&o=5&dpr=2&pid=1.7">
        <div class="card-info-title">油焖大虾</div>
        <div class="card-info-desc">这是一道历史悠久的名菜，鲜香甜咸四种味道相辅相成，回味无穷。</div>
      </div>
      <div class="card-info-bottom" :style="'padding: 20px'">
        <span>为美食打分</span>
        <!-- <span>评分组件</span> -->
      </div>
    </mtd-card>
  </div>
</template>

<style lang="scss">
  .card-body-cover{
    padding: 0px;
  }
  .card-box {
    width: 400px;
    text-align: left;
    .card-info {
      border-bottom: 1px solid #EEEEEE;
      &::after {
        content: "";
        clear: both;
        display: table;
      }
      &-pic {
        float: left;
        width: 100px;
        height: 100px;
        margin-right: 20px;
      }
      &-title {
        font-weight: 500;
        padding: 10px 0 4px 0;
        font-size: 16px;
        color: #666666;
      }
      &-desc {
        font-size: 14px;
        color: #666666;
      }
    }
    .card-info-bottom {

    }
  }
</style>
