<template>
  <div class="demo-full-width">
    <mtd-row>
      <mtd-col :span="24">
        <div class="grid-content bg-purple-dark" />
      </mtd-col>
    </mtd-row>
    <mtd-row>
      <mtd-col :span="12">
        <div class="grid-content bg-purple" />
      </mtd-col>
      <mtd-col :span="12">
        <div class="grid-content bg-purple-light" />
      </mtd-col>
    </mtd-row>
    <mtd-row>
      <mtd-col :span="8">
        <div class="grid-content bg-purple" />
      </mtd-col>
      <mtd-col :span="8">
        <div class="grid-content bg-purple-light" />
      </mtd-col>
      <mtd-col :span="8">
        <div class="grid-content bg-purple" />
      </mtd-col>
    </mtd-row>
    <mtd-row>
      <mtd-col :span="6">
        <div class="grid-content bg-purple" />
      </mtd-col>
      <mtd-col :span="6">
        <div class="grid-content bg-purple-light" />
      </mtd-col>
      <mtd-col :span="6">
        <div class="grid-content bg-purple" />
      </mtd-col>
      <mtd-col :span="6">
        <div class="grid-content bg-purple-light" />
      </mtd-col>
    </mtd-row>
    <mtd-row>
      <mtd-col :span="4">
        <div class="grid-content bg-purple" />
      </mtd-col>
      <mtd-col :span="4">
        <div class="grid-content bg-purple-light" />
      </mtd-col>
      <mtd-col :span="4">
        <div class="grid-content bg-purple" />
      </mtd-col>
      <mtd-col :span="4">
        <div class="grid-content bg-purple-light" />
      </mtd-col>
      <mtd-col :span="4">
        <div class="grid-content bg-purple" />
      </mtd-col>
      <mtd-col :span="4">
        <div class="grid-content bg-purple-light" />
      </mtd-col>
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
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
}
</style>
