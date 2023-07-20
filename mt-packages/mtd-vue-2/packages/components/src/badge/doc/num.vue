<template>
  <div>
    <span class="example-badge">
      design v0.2
      <mtd-badge dot class="badge-dot-center badge" />
    </span>

    <mtd-badge dot class="example-badge">
      <i
        class="mtdicon mtdicon-calendar-o"
        style="font-size: 20px; color: rgba(0,0,0,0.60);"
      />
    </mtd-badge>

    <mtd-badge style="padding: 2px;" value="new" class="example-badge">
      <div>系统通知</div>
    </mtd-badge>

    <mtd-badge style="padding: 2px;" value="hot" class="example-badge">
      <div>系统通知</div>
    </mtd-badge>
  </div>
</template>
<style lang="scss">
.example-badge {
  margin-right: 80px;
  vertical-align: middle;
}
</style>
