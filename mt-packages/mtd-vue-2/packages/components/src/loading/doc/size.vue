<template>
  <div>
    <div class="demo-loading-group">
      <mtd-loading size="small" /><br>
      <mtd-loading size="small" message-position="right"/><br>
      <div>小</div>
    </div>
    <div class="demo-loading-group">
      <mtd-loading /><br>
      <mtd-loading message-position="right"/><br>
      <div>中</div>
    </div>
    <div class="demo-loading-group">
      <mtd-loading size="large"/><br>
      <mtd-loading size="large" message-position="right" /><br>
      <div>大</div>
    </div>
  </div>
</template>
<style lang="scss">
.demo-loading-group {
  display: inline-block;
  i {
    margin-bottom: 4px;
  }
}
.demo-loading-group + .demo-loading-group {
  margin-left: 110px;
}
</style>
