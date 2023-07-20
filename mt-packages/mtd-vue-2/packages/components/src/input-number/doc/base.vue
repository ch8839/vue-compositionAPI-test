<template>
  <mtd-input-number v-model="value" :max="10" :min="1" />
</template>

<script>
export default {
  data () {
    return {
      value: 3,
    };
  },
};
</script>
