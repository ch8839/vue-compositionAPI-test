<template>
  <div class="demo-flex" style="text-align:left">
    <div>
      <p>常驻辅助信息</p>
      <mtd-input v-model="value" style="width: 300px;" />
      <div class="mtd-form-item-helper">最少包含4个中文字符，不能含有标点、英文字符。</div>
    </div>
    <div>
      <p>占位符样式（简短的说明或举例）</p>
      <mtd-input type="email" placeholder="email@example.com" style="width: 300px;"
        v-model="value1" />
    </div>
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
