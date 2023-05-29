<template>
  <div class="demo-flex">
    <div>
      <p>小号</p>
      <mtd-input-number v-model="value1" size="small" />
    </div>
    <div>
      <p>中号</p>
      <mtd-input-number v-model="value2" />
    </div>
    <div>
      <p>大号</p>
      <mtd-input-number v-model="value3" size="large" />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      value1: 1,
      value2: 1,
      value3: 1,
    };
  },
};
</script>
