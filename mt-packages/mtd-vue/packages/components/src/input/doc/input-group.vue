<template>
  <div class="demo-full-width" style="text-align:left">
    <mtd-input-group>
      <mtd-input style="width: 20%" v-model="value3" />
      <mtd-input style="width: 30%" v-model="value4" />
    </mtd-input-group>
    <br>
    <mtd-input-group size="large">
      <mtd-select v-model="selectValue1">
        <mtd-option value="Zhejiang" label="Zhejiang">Zhejiang</mtd-option>
        <mtd-option value="Jiangsu" label="Jiangsu">Jiangsu</mtd-option>
      </mtd-select>
      <mtd-input style="width: 50%" v-model="value5" />
    </mtd-input-group>
    <br>
    <mtd-input-group>
      <mtd-input style="width: 50%" v-model="value6" />
      <mtd-date-picker style="width: 50%" />
    </mtd-input-group>
    <br>
    <mtd-input-group>
      <mtd-select v-model="selectValue3">
        <mtd-option value="Option1-1" label="Option1-1">Option1-1</mtd-option>
        <mtd-option value="Option1-2" label="Option1-2">Option1-2</mtd-option>
      </mtd-select>
      <mtd-select v-model="selectValue4">
        <mtd-option value="Option2-1" label="Option2-1">Option2-1</mtd-option>
        <mtd-option value="Option2-2" label="Option2-2">Option2-2</mtd-option>
      </mtd-select>
    </mtd-input-group>
    <br>
    <mtd-input-group>
      <mtd-select v-model="selectValue5">
        <mtd-option value="1" label="Between">Between</mtd-option>
        <mtd-option value="2" label="Except">Except</mtd-option>
      </mtd-select>
      <mtd-input style=" width: 100px; text-align: center" placeholder="Minimum" />
      <mtd-input style=" width: 30px; border-left: 0;
      pointer-events: none;" placeholder="~" disabled />
      <mtd-input style="width: 100px; text-align: center;" placeholder="Maximum" />
    </mtd-input-group>
    <br>
    <mtd-input-group>
      <mtd-select v-model="selectValue6">
        <mtd-option value="Sign Up" label="Sign Up">Sign Up</mtd-option>
        <mtd-option value="Sign In" label="Sign In">Sign In</mtd-option>
      </mtd-select>
      <mtd-autocomplete
        placeholder="Email" />
    </mtd-input-group>
    <br>
    <mtd-input-group>
      <mtd-select style="width: 30%" v-model="selectValue7">
        <mtd-option value="Home" label="Home">Home</mtd-option>
        <mtd-option value="Company" label="Company">Company</mtd-option>
      </mtd-select>
      <mtd-cascader :data="address" style="width: 70%" placeholder="Select Address" />
    </mtd-input-group>
    <br>
    <mtd-input-group>
      <mtd-input style="width: 40%" v-model="value7" placeholder="输入用户名">
        <template slot="prepend">姓名</template>
      </mtd-input>
      <mtd-input style="width: 60%" v-model="value8" placeholder="输入邮箱" />
    </mtd-input-group>
  </div>
</template>
<script>
export default {
  data () {
    return {
      value1: '',
      value2: '',
      value3: '',
      value4: '',
      value5: '',
      value6: '',
      value7: '',
      value8: '',
      selectValue1: '',
      selectValue2: '',
      selectValue3: '',
      selectValue4: '',
      selectValue5: '',
      selectValue6: '',
      selectValue7: '',
      address: [{
        value: 'beijing',
        label: '北京',
        children: [{
          value: 'beijing',
          label: '北京',
        }],
      }, {
        value: 'hunan',
        label: '湖南',
        children: [{
          value: 'changsha',
          label: '长沙',
        }, {
          value: 'zhangjiajie',
          label: '张家界',
        }],
      }],
    };
  },
};
</script>
<style lang="scss">
  .demo-block .source .mtd-input-group {
    text-align: initial;
  }
</style>