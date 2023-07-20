<template>
  <mtd-announcement
    title="公告信息"
    type="warning"
    :closable="false">
    <div>
      <span>平台推出了新的<a class="demo-announcement-link underline" >隐私政策</a></span>
      <span style="float:right">
        <mtd-button type="text-primary">拒绝</mtd-button>
        <mtd-button type="text-primary" style="margin-left:12px">接受</mtd-button>
      </span>
    </div>
  </mtd-announcement>
</template>

<style lang="scss">
  .demo-announcement-link:hover{
    text-decoration: underline;
    cursor: pointer;
  }
</style>
