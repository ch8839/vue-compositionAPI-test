<template>
<div>
  <p style="text-align:left">1、固定宽</p>
  <mtd-steps :active="3" size="small" :space="150">
    <mtd-step title="步骤 1" />
    <mtd-step title="步骤 2" description="这是描述这是描述这是描述这是描述这是描述这是描述这是描述这是描述" />
    <mtd-step title="步骤 3" />
    <mtd-step title="步骤 4" description="这是描述这是描述这是描述这是描述这是描述这是描述这是描述这是描述" />
    <mtd-step title="步骤 5" description="这是描述这是描述这是描述这是描述这是描述这是描述这是描述这是描述" />
  </mtd-steps>
    <br><br><br>
  <p style="text-align:left">2、不设置固定宽自适应</p>
  <mtd-steps :active="3" size="small">
    <mtd-step title="步骤 1" />
    <mtd-step title="步骤 2" description="这是描述这是描述这是描述这是描述这是描述这是描述这是描述这是描述" />
    <mtd-step title="步骤 3" />
    <mtd-step title="步骤 4" description="这是描述这是描述这是描述这是描述这是描述这是描述这是描述这是描述" />
    <mtd-step title="步骤 5" description="这是描述这是描述这是描述这是描述这是描述这是描述这是描述这是描述" />
  </mtd-steps>
  <br><br><br>
  <p style="text-align:left">3、固定宽且超出容器部分会换行</p>
  <mtd-steps :active="3" size="small" :space="150">
    <mtd-step title="步骤 1" />
    <mtd-step title="步骤 2" description="这是描述这是描述这是描述这是描述这是描述这是描述这是描述这是描述" />
    <mtd-step title="步骤 3" />
    <mtd-step title="步骤 4" description="这是描述这是描述这是描述这是描述这是描述这是描述这是描述这是描述这是描述这是描述这是描述这是描述" />
    <mtd-step title="步骤 5" description="这是描述这是描述这是描述这是描述这是描述这是描述这是描述这是描述" />
    <mtd-step title="步骤 6" />
    <mtd-step title="步骤 7" description="这是描述这是描述这是描述这是描述这是描述这是描述这是描述这是描述" />
    <mtd-step title="步骤 8" />
    <mtd-step title="步骤 9" description="这是描述这是描述这是描述这是描述这是描述这是描述这是描述这是描述" />
    <mtd-step title="步骤 10" description="这是描述这是描述这是描述这是描述这是描述这是描述这是描述这是描述" />
  </mtd-steps>

</div>
</template>
