<template>
<div class="demo-flex">
  <div>
    <p>通过搜索新建</p>
    <mtd-select v-model="value1" class="select-width"
      :filterable="true" :allow-create="true" multiple
      :clearable="true">
      <mtd-option
        v-for="item in options1"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        :disabled="item.disabled" />
    </mtd-select>
  </div>
  <div>
    <p>通过输入新建，本质上是修改数据源</p>
    <mtd-select v-model="value2" class="select-width"
      :filterable="true" :allow-create="true" multiple
      :clearable="true"
    >
      <mtd-option
        v-for="item in options2"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        :disabled="item.disabled" 
      >
        <div class="option-item">
          {{item.label}}
          <mtd-icon-button 
            v-if="item.customCreate"
            @click="remove(item.value)" 
            class="remove-btn" 
            type="secondary" 
            icon="delete-o" 
          />
        </div>
      </mtd-option>

      <div slot="footer" class="create-option">
        <mtd-input v-model="createName" style="width: 110px"/>
        <mtd-button type="text-primary" @click="create" :disabled="!createName">新建</mtd-button>
      </div>
    </mtd-select>
  </div>
</div>
</template>
<script>
export default {
  data () {
    const options = [{
      value: '李白',
      label: '李白',
    }, {
      value: '李贺',
      label: '李贺',
    }, {
      value: '杜甫',
      label: '杜甫',
      disabled: true,
    }, {
      value: '白居易',
      label: '白居易',
    }, {
      value: '屈原',
      label: '屈原',
    }];
    return {
      options1: [...options],
      options2: [...options],
      value1: '',
      value2: '',
      createName: '',
    };
  },
  methods: {
    remove(val) {
      this.options2.splice(this.options2.findIndex(item => item.value === val),1)
    },
    create() {
      this.options2.push({
        label: this.createName,
        value: this.createName,

        customCreate: true, // 用户自定义的属性
      })
      this.createName = ''
    }
  }
};
</script>

<style scoped>
  .remove-btn{
    float: right;
    
  }

  .option-item{
    width: 130px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>