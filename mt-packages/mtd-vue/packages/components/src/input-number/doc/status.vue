<template>
  <div class="demo-flex">
    <div>
      <p>正常态</p>
      <mtd-input-number v-model="value1" />
    </div>
    <div>
      <p>禁用态</p>
      <mtd-input-number v-model="value2" disabled />
    </div>
    <div>
      <p>错误态</p>
      <div>
        <mtd-input-number v-model="value3" status="error" />
        <div class="mtd-form-item-error-tip" style="text-align:left">输入不可为空</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      value1: 1,
      value2: 1,
      value3: '',
    };
  },
};
</script>
