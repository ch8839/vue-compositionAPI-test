<template>
  <div class="demo-box">
    <mtd-row type="flex" class="demo-slider-row" style="width: 100%">
      <mtd-col :span="16" >
        <mtd-slider v-model="value" :steps="steps"  />
      </mtd-col>
      <mtd-col :span="4" :offset="2">
        <mtd-input-number v-model="value" controls-position="right" :min="0" :max="100" :step="20"/>
      </mtd-col>
    </mtd-row>
  </div>
</template>
<script>
export default {
  data () {
    return {
      value: 0,
      steps: [20, 40, 60, 80],
    };
  },
};
</script>
