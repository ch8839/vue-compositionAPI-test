<template>
  <div class="demo-flex">
    <div>
      <p>标准型</p>
      <mtd-input-number v-model="value1" />
    </div>
    <div>
      <p>窄小型</p>
      <mtd-input-number v-model="value2" controls-position="right" />
    </div>
    <div>
      <p>简洁型</p>
      <mtd-input-number v-model="value3" :controls="false" />
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
