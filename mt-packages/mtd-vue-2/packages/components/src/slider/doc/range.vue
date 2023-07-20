<template>
  <div class="demo-box" style="width: 600px">

    <h4>基本范围滑块</h4>
    <mtd-row type="flex" class="demo-slider-row" style="width: 100%">
      <mtd-col :span="16" >
        <mtd-slider v-model="value1" range @change="handleChange"/>
      </mtd-col>
      <mtd-col :span="6" :offset="2">
        <mtd-input-number v-model="value1[0]" :controls="false" :min="0" :max="100"/>
        <span style="margin: 0 4px">—</span>
        <mtd-input-number v-model="value1[1]" :controls="false" :min="0" :max="100"/>
      </mtd-col>
    </mtd-row>
    <br/><br/>

    <h4>固定范围滑块</h4>
    <p>同时配置range、fixed-range两个属性，并且通过给定初始值value数组决定滑块宽度</p>
    <mtd-row type="flex" class="demo-slider-row" style="width: 100%">
      <mtd-col :span="16" >
        <mtd-slider v-model="value2" range fixed-range />
      </mtd-col>
      <mtd-col :span="6" :offset="2">
        <mtd-input-number v-model="value2[0]" :controls="false" :min="0" :max="100"/>
        <span style="margin: 0 4px">—</span>
        <mtd-input-number v-model="value2[1]" :controls="false" :min="0" :max="100"/>
      </mtd-col>
    </mtd-row>
    <br/><br/>

    <h4>基本范围滑块 + 离散</h4>
    <mtd-row type="flex" class="demo-slider-row" style="width: 100%">
      <mtd-col :span="16" >
        <mtd-slider v-model="value3" range :steps="steps"/>
      </mtd-col>
      <mtd-col :span="6" :offset="2">
        <mtd-input-number v-model="value3[0]" :controls="false" :min="0" :max="100" :step="25"/>
        <span style="margin: 0 4px">—</span>
        <mtd-input-number v-model="value3[1]" :controls="false" :min="0" :max="100" :step="25"/>
      </mtd-col>
    </mtd-row>
    <br/><br/>

    <h4>固定范围滑块 + 离散</h4>
    <mtd-row type="flex" class="demo-slider-row" style="width: 100%">
      <mtd-col :span="16" >
        <mtd-slider v-model="value4" range fixed-range :steps="steps"/>
      </mtd-col>
      <mtd-col :span="6" :offset="2">
        <mtd-input-number v-model="value4[0]" :controls="false" :min="0" :max="100" :step="25"/>
        <span style="margin: 0 4px">—</span>
        <mtd-input-number v-model="value4[1]" :controls="false" :min="0" :max="100" :step="25"/>
      </mtd-col>
    </mtd-row>
    <br/><br/>

  </div>
</template>
<script>
export default {
  data () {
    return {
      value1: [10, 30],
      value2: [10, 30],
      value3: [0, 25],
      value4: [0, 25],
      steps: [25, 50, 75, 100],
    };
  },
  methods: {
    handleChange (v) {
      console.log(v);
    },
  },
};
</script>
