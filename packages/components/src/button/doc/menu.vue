<style lang="scss">
.demo-dropdown-btn-group {
  .mtd-dropdown + .mtd-dropdown {
    margin-left: 80px;
  }
}
</style>

<template>
  <div>
    <div class="demo-dropdown-btn-group source">
      <mtd-dropdown>
        <mtd-button type="text">
          <span style="margin-right: 4px">更多</span>
          <i class="mtdicon mtdicon-down" />
        </mtd-button>
        <template #dropdown>
          <mtd-dropdown-menu>
            <mtd-dropdown-menu-item>添加</mtd-dropdown-menu-item>
            <mtd-dropdown-menu-item>删除</mtd-dropdown-menu-item>
            <mtd-dropdown-menu-item>复制</mtd-dropdown-menu-item>
          </mtd-dropdown-menu>
        </template>
      </mtd-dropdown>
      <mtd-dropdown>
        <mtd-button type="text">
          <i class="mtdicon mtdicon-edit-o" style="margin-right: 4px" />
          <i class="mtdicon mtdicon-down" />
        </mtd-button>
        <template #dropdown>
          <mtd-dropdown-menu>
            <mtd-dropdown-menu-item>添加</mtd-dropdown-menu-item>
            <mtd-dropdown-menu-item>删除</mtd-dropdown-menu-item>
            <mtd-dropdown-menu-item>复制</mtd-dropdown-menu-item>
          </mtd-dropdown-menu>
        </template>
      </mtd-dropdown>
      <mtd-dropdown>
        <mtd-button type="primary">
          更多
          <i class="mtdicon mtdicon-down" />
        </mtd-button>
        <template #dropdown>
          <mtd-dropdown-menu>
            <mtd-dropdown-menu-item>添加</mtd-dropdown-menu-item>
            <mtd-dropdown-menu-item>删除</mtd-dropdown-menu-item>
            <mtd-dropdown-menu-item>复制</mtd-dropdown-menu-item>
          </mtd-dropdown-menu>
        </template>
      </mtd-dropdown>
      <mtd-dropdown>
        <mtd-button>
          <i class="mtdicon mtdicon-edit-o" style="margin-right: 4px" />
          <i class="mtdicon mtdicon-down" />
        </mtd-button>
        <template #dropdown>
          <mtd-dropdown-menu>
            <mtd-dropdown-menu-item>添加</mtd-dropdown-menu-item>
            <mtd-dropdown-menu-item>删除</mtd-dropdown-menu-item>
            <mtd-dropdown-menu-item>复制</mtd-dropdown-menu-item>
          </mtd-dropdown-menu>
        </template>
      </mtd-dropdown>
    </div>
  </div>
</template>
