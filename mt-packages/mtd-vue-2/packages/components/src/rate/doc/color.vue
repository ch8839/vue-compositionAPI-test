<template>
  <mtd-row :gutter="20">
    <mtd-col :span="12">
      <mtd-rate v-model="value1" />
      <span class="demonstration">默认不区分颜色</span>
    </mtd-col>
    <mtd-col :span="12">
      <mtd-rate v-model="value2"
        :color="{ 0: '#FFCE32', 3: '#F7BA2A', 5: '#FF9900' }" />
      <span class="demonstration">区分颜色</span>
    </mtd-col>
  </mtd-row>
</template>
<script>
export default {
  data () {
    return {
      value1: 1,
      value2: 3,
      value3: 4,
    };
  },
};
</script>
