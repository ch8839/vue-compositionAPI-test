<template>
  <mtd-row>
    <mtd-col :span="12">
      <mtd-button type="primary">基础按钮</mtd-button>
      <mtd-button type="primary" loading>基础按钮</mtd-button>
      <mtd-button type="primary" disabled>基础按钮</mtd-button>
    </mtd-col>
    <mtd-col :span="12">
      <mtd-button>次要按钮</mtd-button>
      <mtd-button loading>次要按钮</mtd-button>
      <mtd-button disabled>次要按钮</mtd-button>
    </mtd-col>
    <mtd-col :span="12" style="margin-top: 40px">
      <mtd-button type="text-primary">文字按钮</mtd-button>
      <mtd-button type="text-primary" loading>文字按钮</mtd-button>
      <mtd-button type="text-primary" disabled>文字按钮</mtd-button>
    </mtd-col>
  </mtd-row>
</template>
