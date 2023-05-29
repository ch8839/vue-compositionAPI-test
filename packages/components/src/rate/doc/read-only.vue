<template>
  <div style="text-align:left">
    <mtd-rate v-model="value6" disabled>
      <template #default="scope">{{ scope.value }}分</template>
    </mtd-rate>
    <br>
    <mtd-rate v-model="value7" disabled>
      <template #default="scope">{{ scope.value }}分</template>
    </mtd-rate>
  </div>
</template>
<script>
export default {
  data () {
    return {
      value6: 2.5,
      value7: 4.6,
    }
  },
}
</script>
