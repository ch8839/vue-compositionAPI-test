<template>
  <mtd-dropdown trigger="hover">
    <mtd-button type="text-primary">
      <span style="margin-right: 4px;">产品服务</span>
      <i class="mtdicon mtdicon-down" />
    </mtd-button>
    <template #dropdown>
      <mtd-dropdown-menu slot="dropdown">
        <mtd-dropdown-menu-item class="demo-dropdown-menu-item">
          <i class="mtdicon mtdicon-calculator-o" />计算<span class="demo-right-text">我是计算的说明</span>
        </mtd-dropdown-menu-item>
        <mtd-dropdown-menu-item class="demo-dropdown-menu-item">
          <i class="mtdicon mtdicon-paste-code-o" />网络<span class="demo-right-text">我是网络的说明</span>
        </mtd-dropdown-menu-item>
        <mtd-dropdown-menu-item class="demo-dropdown-menu-item">
          <i class="mtdicon mtdicon-save-o" />存储<span class="demo-right-text">我是存储的说明</span>
        </mtd-dropdown-menu-item>
        <mtd-dropdown-menu-item class="demo-dropdown-menu-item">
          <i class="mtdicon mtdicon-database-o" />数据库<span class="demo-right-text">我是数据库的说明</span>
        </mtd-dropdown-menu-item>
      </mtd-dropdown-menu>
    </template>
  </mtd-dropdown>
</template>
<style lang='scss'>
  .demo-dropdown-menu-item {
    width: 300px;

    .mtdicon {
      color: rgba(0,0,0,0.90);
      margin-right: 8px;
      font-size: 16px;
      vertical-align: -20%;
    }

    .demo-right-text {
      float: right;
      font-size: 12px;
      color: #ADADAD;
    }

  }
</style>
