<template>
  <div>
    <mtd-dropdown trigger="hover">
      <mtd-button type="text-primary">
        <span style="margin-right: 4px;">产品服务</span>
        <i class="mtdicon mtdicon-down" />
      </mtd-button>
      <template #dropdown>
        <mtd-dropdown-menu>
          <mtd-dropdown-menu-item>计算</mtd-dropdown-menu-item>
          <mtd-dropdown-menu-item>网络</mtd-dropdown-menu-item>
          <mtd-dropdown-menu-item>存储</mtd-dropdown-menu-item>
          <mtd-dropdown-menu-item>数据库</mtd-dropdown-menu-item>
        </mtd-dropdown-menu>
      </template>
    </mtd-dropdown>
  </div>
</template>
