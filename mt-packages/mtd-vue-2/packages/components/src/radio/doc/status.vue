<template>
  <div>
    <mtd-radio>未选中态</mtd-radio>
    <mtd-radio :value="true">已选中态</mtd-radio>
    <mtd-radio disabled>未选中禁用态</mtd-radio>
    <mtd-radio disabled :value="true">已选中禁用态</mtd-radio>
  </div>
</template>
