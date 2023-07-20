<template>
  <div class="demo-full-width">
    <mtd-steps :active="1">
      <mtd-step title="已完成" />
      <mtd-step status="cancel" title="撤销" />
      <mtd-step title="步骤 3" />
    </mtd-steps>
    <br>
    <mtd-steps :active="1">
      <mtd-step title="已完成" />
      <mtd-step status="error" title="失败" />
      <mtd-step title="步骤 3" />
    </mtd-steps>
  </div>
</template>
