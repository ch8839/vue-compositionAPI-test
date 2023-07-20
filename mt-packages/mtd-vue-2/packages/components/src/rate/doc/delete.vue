<template>
  <mtd-row :gutter="20">
    <mtd-col :span="12">
      <mtd-rate v-model="value8" allow-clear />
      <span class="demonstration">允许清除</span>
    </mtd-col>
    <mtd-col :span="12">
      <mtd-rate v-model="value9" :allow-clear="false" />
      <span class="demonstration">不允许清除</span>
    </mtd-col>
  </mtd-row>
</template>
<script>
export default {
  data () {
    return {
      value8: 0,
      value9: 0,
    };
  },
};
</script>
