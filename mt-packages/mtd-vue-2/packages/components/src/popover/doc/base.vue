<template>
  <div>
    <mtd-popover trigger="hover" placement="top" title="标题" :append-to-container="false">
      <mtd-button style="margin-right: 40px"> hover 出现 </mtd-button>
      <template #content>
        <div class="demo-popover-content">
          hover时出现的弹出框的内容详情。
        </div>
      </template>
    </mtd-popover>

    <mtd-popover
      trigger="click"
      title="标题"
      placement="top"
      @clickoutside="clickoutside"
      :append-to-container="false"
    >
      <mtd-button style="margin-right: 40px"> click 出现 </mtd-button>
      <template #content>
        <div class="demo-popover-content">
          click时出现的弹出框的内容详情。
        </div>
      </template>
    </mtd-popover>

    <mtd-popover
      trigger="focus"
      title="标题"
      placement="top"
      :append-to-container="false"
    >
      <mtd-button> focus 出现 </mtd-button>
      <template #content>
        <div class="demo-popover-content">
          focus时出现的弹出框的内容详情。
        </div>
      </template>
    </mtd-popover>
  </div>
</template>
<script>
export default {
  methods: {
    clickoutside(e) {
      console.log(e)
    },
  },
}
</script>
