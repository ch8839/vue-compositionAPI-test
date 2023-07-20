<template>
  <div>
    <div class="demo-pie">
      <mtd-progress :percentage="72" type="pie" :width="16" />
    </div>
    <div class="demo-pie">
      <mtd-progress :percentage="100" type="pie" :width="16" status="success" />
    </div>
    <div class="demo-pie">
      <mtd-progress :percentage="72" type="pie" :width="16" status="error" />
    </div>
  </div>
</template>
<style lang="scss">
  .demo-pie {
    display: inline-block;
    width: 50px;
    font-size: 12px;
    text-align: center;
    color:rgba(0,0,0,0.9);
  }
</style>
