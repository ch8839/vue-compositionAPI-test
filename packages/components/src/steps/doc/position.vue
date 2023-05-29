<template>
  <div class="demo-full-width">

    <div>
      <span>指示器位置：</span>
      <mtd-radio-group v-model="type">
        <mtd-radio-button value="center">居中</mtd-radio-button>
        <mtd-radio-button value="right">右边</mtd-radio-button>
        <!-- <mtd-radio-button value="navigation">导航</mtd-radio-button> -->
      </mtd-radio-group>
    </div>
    <br><br><br>

    <mtd-steps v-model="active" :type="type">
      <mtd-step title="步骤 1"
        description="这是可控制描述文案位置的步骤条中关于此步骤的具体描述" />
      <mtd-step title="步骤 2"
        description="这是可控制描述文案位置的步骤条中关于此步骤的具体描述" />
      <mtd-step title="步骤 3"
        description="这是可控制描述文案位置的步骤条中关于此步骤的具体描述" />
    </mtd-steps>
  </div>
</template>

<script>
export default {
  data () {
    return {
      type: 'right',
      active: 1,
    };
  },
};
</script>

