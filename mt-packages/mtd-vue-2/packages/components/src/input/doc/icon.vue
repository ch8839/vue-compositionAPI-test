<template>
  <div>
    <mtd-input prefix-icon="home-o" v-model="value"
      placeholder="" style="margin-right: 100px;" />
    <mtd-input suffix-icon="home-o" v-model="value1" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      value: '',
      value1: '',
    };
  },
};
</script>
