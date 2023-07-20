<template>
  <div class="demo-flex">
    <div>
      <p>左对齐</p>
      <mtd-input-number v-model="value1" :style="{textAlign: 'left'}" />
    </div>
    <div>
      <p>居中对齐</p>
      <mtd-input-number v-model="value2" />
    </div>
    <div>
      <p>右对齐</p>
      <mtd-input-number v-model="value3" :style="{textAlign: 'right'}" />
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
