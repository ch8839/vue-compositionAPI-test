<template>
  <div>
    <mtd-switch v-model="value1" size="small" />
    <mtd-switch v-model="value2" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      value1: true,
      value2: true,
    };
  },
};
</script>
<style lang="scss">
  .mtd-switch {
    margin-right: 50px;
  }
</style>
