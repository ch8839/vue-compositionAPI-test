<template>
<div class="demo-flex">
  <mtd-textarea
    autosize
    placeholder="请输入内容"
    v-model="textarea1" />
  <mtd-textarea
    :autosize="{ minRows: 2, maxRows: 4}"
    placeholder="请输入内容"
    v-model="textarea2" />
</div>
</template>
<script>
export default {
  data () {
    return {
      textarea1: '',
      textarea2: '',
    };
  },
};
</script>
