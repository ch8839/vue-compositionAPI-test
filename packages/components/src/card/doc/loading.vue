<template>
  <div class="demo-box">
    <mtd-card class="card-box" title="卡片名称">
      <div  style="margin: 32px">
        <mtd-loading />
      </div>
    </mtd-card> 
  </div>
</template>

<style lang="scss">
  .demo-box {
    display: inline-block;
    width: 400px;
    text-align: left;
    .card-box {
      .title {
        line-height: 22px;
        font-weight: 500;
        font-size: 16px;
        margin-bottom: 8px;
      }
    }
  }
</style>
