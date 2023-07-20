<template>
  <div class="demo-box">
    <mtd-card class="card-box" title="卡片名称">
      <div slot="extra">
        <mtd-button class="btn-demo-item" type="text-primary">更多</mtd-button>
      </div>
      <mtd-row :gutter="8">
        <mtd-col :span="24"><div class="grid-content bg-purple-light" /></mtd-col>
      </mtd-row>
      <mtd-row :gutter="8">
        <mtd-col :span="12"><div class="grid-content bg-purple-light" /></mtd-col>
        <mtd-col :span="12"><div class="grid-content bg-purple-light" /></mtd-col>
      </mtd-row>
      <mtd-row :gutter="8">
        <mtd-col :span="8"><div class="grid-content bg-purple-light" /></mtd-col>
        <mtd-col :span="8"><div class="grid-content bg-purple-light" /></mtd-col>
        <mtd-col :span="8"><div class="grid-content bg-purple-light" /></mtd-col>
      </mtd-row>
      <mtd-row :gutter="8">
        <mtd-col :span="6"><div class="grid-content bg-purple-light" /></mtd-col>
        <mtd-col :span="6"><div class="grid-content bg-purple-light" /></mtd-col>
        <mtd-col :span="6"><div class="grid-content bg-purple-light" /></mtd-col>
        <mtd-col :span="6"><div class="grid-content bg-purple-light" /></mtd-col>
      </mtd-row>
      <mtd-row :gutter="8">
        <mtd-col :span="5"><div class="grid-content bg-purple-light" /></mtd-col>
        <mtd-col :span="5"><div class="grid-content bg-purple-light" /></mtd-col>
        <mtd-col :span="9"><div class="grid-content bg-purple-light" /></mtd-col>
        <mtd-col :span="5"><div class="grid-content bg-purple-light" /></mtd-col>
      </mtd-row>
    </mtd-card>
  </div>
</template>

<style lang="scss">
  .demo-box {
    display: inline-block;
    width: 400px;
    text-align: left;
    .card-box {
      width: 400px;
      text-align: left;
      .title {
        line-height: 22px;
        font-weight: 500;
        font-size: 16px;
        margin-bottom: 8px;
      }
      .grid-content {
        height: 12px;
      }
      .bg-purple-light {
        background: #e5e9f2;
      }
      .mtd-row {
        margin-top: 12px;
      }
    }
  }
</style>
