<template>
  <div>
    <mtd-dropdown trigger="hover">
      <mtd-button type="text-primary" style="margin-right: 40px;">
        <span style="margin-right: 4px;">hover</span>
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

    <mtd-dropdown>
      <mtd-button type="text-primary">
        <span style="margin-right: 4px;">click</span>
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
