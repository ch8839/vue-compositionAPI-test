<template>
  <div>
    <mtd-steps :active="1" size="small">
      <mtd-step title="步骤 1" />
      <mtd-step title="步骤 2" />
      <mtd-step title="步骤 3" />
    </mtd-steps>
    <br>
    <mtd-steps :active="1">
      <mtd-step title="步骤 1" />
      <mtd-step title="步骤 2" />
      <mtd-step title="步骤 3" />
    </mtd-steps>
  </div>
</template>
