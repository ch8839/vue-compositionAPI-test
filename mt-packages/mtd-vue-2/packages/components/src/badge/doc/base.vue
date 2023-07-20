<template>
  <div class="demo-flex demo-full-width">
    <div class="badge-show-wrapper">
      <span>不显示数量</span>
      <mtd-badge dot />
    </div>
    <div class="badge-show-wrapper">
      <span>个位数</span>
      <mtd-badge :value="8"/>
    </div>
    <div class="badge-show-wrapper">
      <span>两位数</span>
      <mtd-badge :value="99"/>
    </div>
    <div class="badge-show-wrapper">
      <span>大于两位数</span>
      <mtd-badge :value="100" :max="99"/>
    </div>
    <div class="badge-show-wrapper">
      <span>文字</span>
      <mtd-badge value="Hot"/>
    </div>
  </div>  
</template>
<style lang="scss">
.example-badge {
  margin-right: 80px;
  vertical-align: middle;
}

.badge-show-wrapper{
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &>span {
    margin-bottom: 12px;
  }
}
</style>
