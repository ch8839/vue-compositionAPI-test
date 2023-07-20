<template>
  <div>
    <span class="example-badge">
      <mtd-badge dot class="my-badge" status="error" />
      <span>错误</span>
    </span>
    <span class="example-badge">
      <mtd-badge dot class="my-badge" status="success" />
      <span>成功</span>
    </span>
    <span class="example-badge">
      <mtd-badge dot class="my-badge" status="process" />
      <span>进行中</span>
    </span>
    <span class="example-badge">
      <mtd-badge dot class="my-badge" status="disabled" />
      <span>过期</span>
    </span>
    <span class="example-badge">
      <mtd-badge dot class="my-badge" status="warning" />
      <span>警告</span>
    </span>
  </div>
</template>
<style lang="scss">
.example-badge {
  margin-right: 80px;
  vertical-align: middle;

  .my-badge {
    margin-right: 8px;
  }
}
</style>
