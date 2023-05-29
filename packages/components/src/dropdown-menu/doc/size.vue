<template>
  <div>
    <div class="demo-dropdown-menu-group" style="margin-right: 60px;">
      <p>小号</p>
      <mtd-dropdown-menu size="small" class="mtd-popper">
        <mtd-dropdown-menu-item>文件大小</mtd-dropdown-menu-item>
        <mtd-dropdown-menu-item>文件说明</mtd-dropdown-menu-item>
        <mtd-dropdown-menu-item>文件说明</mtd-dropdown-menu-item>
      </mtd-dropdown-menu>
    </div>
    <div class="demo-dropdown-menu-group">
      <p>默认</p>
      <mtd-dropdown-menu class="mtd-popper" style="margin-right: 60px;">
        <mtd-dropdown-menu-item>文件大小</mtd-dropdown-menu-item>
        <mtd-dropdown-menu-item>文件说明</mtd-dropdown-menu-item>
        <mtd-dropdown-menu-item>文件说明</mtd-dropdown-menu-item>
      </mtd-dropdown-menu>
    </div>
    <div class="demo-dropdown-menu-group">
      <p>大号</p>
      <mtd-dropdown-menu size="large" class="mtd-popper">
        <mtd-dropdown-menu-item>文件大小</mtd-dropdown-menu-item>
        <mtd-dropdown-menu-item>文件说明</mtd-dropdown-menu-item>
        <mtd-dropdown-menu-item>文件说明</mtd-dropdown-menu-item>
      </mtd-dropdown-menu>
    </div>
  </div>
</template>

<style lang='scss'>
  .demo-dropdown-menu-group {
    display: inline-block;
    vertical-align: top;
    text-align: left;
  }
</style>
