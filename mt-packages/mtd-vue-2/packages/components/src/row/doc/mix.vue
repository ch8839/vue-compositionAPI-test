<template>
  <div class="demo-full-width">
    <mtd-row :gutter="20">
      <mtd-col :span="16"><div class="grid-content bg-purple" /></mtd-col>
      <mtd-col :span="8"><div class="grid-content bg-purple" /></mtd-col>
    </mtd-row>
    <mtd-row :gutter="20">
      <mtd-col :span="8"><div class="grid-content bg-purple" /></mtd-col>
      <mtd-col :span="8"><div class="grid-content bg-purple" /></mtd-col>
      <mtd-col :span="4"><div class="grid-content bg-purple" /></mtd-col>
      <mtd-col :span="4"><div class="grid-content bg-purple" /></mtd-col>
    </mtd-row>
    <mtd-row :gutter="20">
      <mtd-col :span="4"><div class="grid-content bg-purple" /></mtd-col>
      <mtd-col :span="16"><div class="grid-content bg-purple" /></mtd-col>
      <mtd-col :span="4"><div class="grid-content bg-purple" /></mtd-col>
    </mtd-row>
  </div>
</template>
<style lang="scss">
.demo-row {
  .mtd-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .mtd-col {
    border-radius: 4px;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
}
</style>
