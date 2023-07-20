<template>
  <div>
    <div class="demo-circle">
      <mtd-progress :percentage="72" type="circle" :width="32" :stroke-width="3" :show-info="false" />
      <div>72%</div>
    </div>
    <div class="demo-circle">
      <mtd-progress :percentage="100" type="circle" :width="32" :stroke-width="3" status="success" :show-info="true" />
      <div>完成</div>
    </div>
    <div class="demo-circle">
      <mtd-progress :percentage="72" type="circle" :width="32" :stroke-width="3" status="error" :show-info="false" />
      <div>失败</div>
    </div>
  </div>
</template>
<style lang="scss">
  .demo-circle {
    display: inline-block;
    width: 50px;
    font-size: 12px;
    text-align: center;
    color:rgba(0,0,0,0.9);
  }
</style>
