<template>
  <div>
    <mtd-rate v-model="value" @change="handleChange"/>
  </div>
</template>
<script>
export default {
  data () {
    return {
      value: 3,
    };
  },
  methods: {
    handleChange (val) {
      console.log('currentRateValue', val);
    },
  },
};
</script>
