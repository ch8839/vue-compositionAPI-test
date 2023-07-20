<template>
  <div style="height: 700px;width:250px;text-align: left;">
    <div style="height: 350px;">
      <p>1、带任务状态纵向流程(固定间距}</p>
      <mtd-steps :active="1" direction="vertical" :space="100">
        <mtd-step
          title="步骤 1"
          description="这是描述这" />
        <mtd-step
          title="步骤 2"
          description="这是描述这是描述这是描述" />
        <mtd-step
          title="步骤 3"
          description="这是描述这是描述这是描述这是描述这是描述这是描述这是描述" />

      </mtd-steps>
    </div>
    <br>
    <div style="height: 350px;">
      <p>2、无状态纵向多条步骤条</p>
      <mtd-steps :active="1" direction="vertical" dot>
        <mtd-step
          title="步骤 1"
          description="这是描述这是描述这是描述这是描述这是描述这是描述这是描述这是描述这是描述这是描述这是描述这是描述这是描述这是描述这是描述这是描述这是描述这是描述这是描述这是描述这是描述这是描述这是描述" />
        <mtd-step
          title="步骤 2"
          description="这是描述这是描述这是描述这是描述这是描述这是描述这是描述" />
        <mtd-step
          title="步骤 3"
          description="这是描述这是描述这是描述" />
      </mtd-steps>
    </div>
  </div>
</template>
