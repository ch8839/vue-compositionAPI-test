<template>
  <div class="demo-flex">
    <div>
      <p>线框</p>
      <mtd-input v-model="value1" placeholder="具体文案" />
    </div>
    <div>
      <p>面型</p>
      <mtd-input v-model="value2" genre="area" placeholder="具体文案" />
    </div>
    <div>
      <p>单线</p>
      <mtd-input v-model="value3" genre="line" placeholder="具体文案" />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      value1: '',
      value2: '',
      value3: '',
    };
  },
};
</script>
