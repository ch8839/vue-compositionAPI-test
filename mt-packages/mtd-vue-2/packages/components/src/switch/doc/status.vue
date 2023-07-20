<template>
  <div>
    <mtd-switch v-model="value3" />
    <mtd-switch :model-value="true" loading />
    <mtd-switch :model-value="true" disabled />
    <br><br>
    <mtd-switch v-model="value6" />
    <mtd-switch :model-value="false" loading />
    <mtd-switch :model-value="false" disabled />
  </div>
</template>

<script>
export default {
  data () {
    return {
      value3: true,
      value4: true,
      value5: false,
      value6: false,
    }
  },
}
</script>
<style lang="scss">
  .mtd-switch {
    margin-right: 40px;
  }
</style>
