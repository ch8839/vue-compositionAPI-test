<template>
  <mtd-tooltip :content="value" placement="top-start" :disabled="value.length < 10">
    <mtd-input type="text" v-model="value" />
  </mtd-tooltip>
</template>

<script>
export default {
  data () {
    return {
      value: '',
    };
  },
};
</script>
