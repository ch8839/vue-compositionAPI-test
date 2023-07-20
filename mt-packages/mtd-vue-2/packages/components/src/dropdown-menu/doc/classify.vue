<template>
  <mtd-dropdown trigger="hover">
    <mtd-button type="text-primary">
      <span style="margin-right: 4px;">新鲜果蔬</span>
      <i class="mtdicon mtdicon-down" />
    </mtd-button>
    <template #dropdown>
      <mtd-dropdown-menu style="width: 100px;">
        <mtd-dropdown-menu-item-group header="水果">
          <mtd-dropdown-menu-item> 苹果 </mtd-dropdown-menu-item>
          <mtd-dropdown-menu-item> 香蕉 </mtd-dropdown-menu-item>
        </mtd-dropdown-menu-item-group>

        <mtd-dropdown-menu-item-group header="蔬菜">
          <mtd-dropdown-menu-item> 土豆 </mtd-dropdown-menu-item>
          <mtd-dropdown-menu-item> 辣椒 </mtd-dropdown-menu-item>
          <mtd-dropdown-menu-item> 白菜 </mtd-dropdown-menu-item>
        </mtd-dropdown-menu-item-group>
      </mtd-dropdown-menu>
    </template>
  </mtd-dropdown>
</template>
<style lang="scss">
  .demo-right-text {
    float: right;
    font-size: 12px;
    color: #ADADAD;
  }
</style>
