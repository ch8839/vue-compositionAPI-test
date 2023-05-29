<template>
  <div class="demo-timeline-wrap">
    <mtd-timeline class="demo-timeline-item-content-1">
      <mtd-timeline-item>
          12:45:24
          <mtd-tag type="unbordered" size="small" theme="green">最新</mtd-tag>
        <div><b>开始发布分组</b></div>
        <template #dot>
          <i class="mtdicon-success-circle demo-timeline-success" />
        </template>
      </mtd-timeline-item>
      <mtd-timeline-item>
        12:45:24
        <div><b>开始发布分组</b></div>
        <template #dot>
          <i class="mtdicon-error-circle demo-timeline-error" />
        </template>
      </mtd-timeline-item>
      <mtd-timeline-item type="master">
        12:45:24
        <div><b>开始发布分组</b></div>
        <div>开始发布分组内容</div>
      </mtd-timeline-item>
      <mtd-timeline-item>
        12:45:24
        <div><b>开始发布分组</b></div>
      </mtd-timeline-item>
      <mtd-timeline-item type="hollow" ghost>
        12:45:24
        <div><b>开始发布分组</b></div>
      </mtd-timeline-item>
      <mtd-timeline-item type="disabled">
        12:45:24
        <div><b>开始发布分组</b></div>
      </mtd-timeline-item>
    </mtd-timeline>
  </div>
</template>
<style lang="scss">
  .demo-timeline-success {
    color: #5ABB3C;
  }
  .demo-timeline-error {
    color: #FF6459
  }
  .demo-timeline-warning {
    color: #FF9801;
  }
  .demo-timeline-primary {
    color: #4E73FF;
  }
</style>
