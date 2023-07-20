<template>
  <div>
    <div class="demo-props-option">
      <span>菜单弹出位置：</span>
      <mtd-radio-group v-model="position">
        <mtd-radio-button value="top">top</mtd-radio-button>
        <mtd-radio-button value="top-start">top-start</mtd-radio-button>
        <mtd-radio-button value="top-end">top-end</mtd-radio-button>
        <mtd-radio-button value="bottom">bottom</mtd-radio-button>
        <mtd-radio-button value="bottom-start">bottom-start</mtd-radio-button>
        <mtd-radio-button value="bottom-end">bottom-end</mtd-radio-button>
      </mtd-radio-group>
    </div>
    <br><br><br>
    <mtd-dropdown :placement="position">
      <mtd-button type="text-primary">
        <span style="margin-right: 4px;">点击</span>
        <i class="mtdicon mtdicon-down" />
      </mtd-button>
      <mtd-dropdown-menu slot="dropdown">
        <mtd-dropdown-menu-item>计算</mtd-dropdown-menu-item>
        <mtd-dropdown-menu-item>网络</mtd-dropdown-menu-item>
        <mtd-dropdown-menu-item>存储</mtd-dropdown-menu-item>
        <mtd-dropdown-menu-item>数据库</mtd-dropdown-menu-item>
      </mtd-dropdown-menu>
    </mtd-dropdown>
  </div>
</template>

<script>
export default {
  data() {
    return {
      position:'bottom-start'
    }
  }
}
</script>>
