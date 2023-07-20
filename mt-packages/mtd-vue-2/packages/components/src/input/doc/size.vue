<template>
  <div class="demo-flex">
    <div>
      <p>表内文本输入框</p>
      <mtd-input v-model="value1" size="small" placeholder="具体文案" />
    </div>
    <div>
      <p>基础文本输入框</p>
      <mtd-input v-model="value2" placeholder="具体文案" />
    </div>
    <div>
      <p>大型文本输入框</p>
      <mtd-input v-model="value3" size="large" placeholder="具体文案" />
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
