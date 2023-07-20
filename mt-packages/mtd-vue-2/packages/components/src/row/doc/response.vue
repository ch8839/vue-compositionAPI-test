<template>
  <div class="demo-full-width">
    <mtd-row :gutter="10">
      <mtd-col :xs="8" :sm="6" :md="4" :lg="3" :xl="1"
        ><div class="grid-content bg-purple"
      /></mtd-col>
      <mtd-col :xs="4" :sm="6" :md="8" :lg="9" :xl="11"
        ><div class="grid-content bg-purple-light"
      /></mtd-col>
      <mtd-col :xs="4" :sm="6" :md="8" :lg="9" :xl="11"
        ><div class="grid-content bg-purple"
      /></mtd-col>
      <mtd-col :xs="8" :sm="6" :md="4" :lg="3" :xl="1"
        ><div class="grid-content bg-purple-light"
      /></mtd-col>
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
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
}
</style>
