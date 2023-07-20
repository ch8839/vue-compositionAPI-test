<template>
  <div>
    <mtd-badge style="padding: 2px;" :value="12" class="example-badge">
      <span>系统通知</span>
    </mtd-badge>

    <span class="example-badge" style="display: inline-block;">
      <span style="display: inline-block; padding: 2px; vertical-align: middle;"
        >系统通知</span
      >
      <mtd-badge :value="12" style="vertical-align: middle; line-height: 1;" />
    </span>

    <mtd-badge :value="12" class="example-badge">
      <i
        class="mtdicon mtdicon-calendar-o"
        style="font-size: 20px; color: rgba(0,0,0,0.60);"
      />
    </mtd-badge>

    <span style="display: inline-block;">
      <div style="display: inline-flex; align-items:center">
        <i
          class="mtdicon mtdicon-calendar-o"
          style="font-size: 20px; color: rgba(0,0,0,0.60);"
        />
        <mtd-badge :value="12" style="vertical-align: middle;" />
      </div>
      
    </span>
  </div>
</template>
<style lang="scss">
.example-badge {
  margin-right: 80px;
  vertical-align: middle;
}
</style>
