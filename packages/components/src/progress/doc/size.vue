<template>
  <div class="demo-box source">

    <div class="demo-progress-show-row">
      <mtd-progress :percentage="65" :stroke-width="4" class="demo-progress-small" />
      <mtd-progress :percentage="65" type="circle" :width="48" :stroke-width="3" />
    </div>

    <div class="demo-progress-show-row">
      <mtd-progress :percentage="65" class="demo-progress-small" />
      <mtd-progress :percentage="65" type="circle" :width="80" :stroke-width="4" />
    </div>

    <div class="demo-progress-show-row">
      <mtd-progress :percentage="65" :stroke-width="8" class="demo-progress-small" />
      <mtd-progress :percentage="65" type="circle" :width="116" :stroke-width="6" />
    </div>
  </div>
</template>

<style lang="scss">
  .demo-box{
    width: 350px;
    margin-left: 20px;
    display: inline-block;
    margin-bottom: 40px;
  }
  .demo-progress-width {
    width: 250px;
  }
  .demo-progress-show-row{
    text-align: left;
    display: flex;
    align-items: center;
    justify-content: space-around;

    margin-bottom: 16px;
  }
</style>
