<template>
  <div class="demo-flex">

    <div class="type-and-use-size">
      <p>单选自定义回填文案</p>
      <mtd-select
        v-model="value1"
        :formatter="formatter"
       >
        <mtd-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          :disabled="item.disabled" />
      </mtd-select>
    </div>

    <div class="type-and-use-size">
      <p>多选自定义标签</p>
      <mtd-select
        v-model="value2" 
        multiple clearable>
        <mtd-option-group
          v-for="(group, index) in groupOptions"
          :key="group.label"
          :label="group.label">
          <mtd-option
            v-for="item in group.options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled" />
        </mtd-option-group>
        <template #tag="scope">
          <mtd-tooltip :content="scope.option.label">
            <mtd-tag theme="blue" type="ghost">{{ scope.option.label }}</mtd-tag>
          </mtd-tooltip>
        </template>
      </mtd-select>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      options: [{
        value: 'libai',
        label: '李白',
      }, {
        value: 'lihe',
        label: '李贺',
      }, {
        value: 'dufu',
        label: '杜甫',
        disabled: true,
      }, {
        value: 'baijuyi',
        label: '白居易',
      }, {
        value: 'quyuan',
        label: '屈原',
      }],
      groupOptions: [{
        label: '热门城市',
        options: [{
          value: 'Shanghai',
          label: '上海',
        }, {
          value: 'Beijing',
          label: '北京',
        }],
      }, {
        label: '城市名',
        options: [{
          value: 'Chengdu',
          label: '成都',
        }, {
          value: 'Shenzhen',
          label: '深圳',
        }, {
          value: 'Guangzhou',
          label: '广州',
        }, {
          value: 'Dalian',
          label: '大连',
        }],
      }],
      value1: undefined,
      value2: [],
    }
  },

  methods: {
    formatter ({value,label}) {
      return `${label}(${value})`
    },
  },
}
</script>
<style lang="scss">
  .group-hr {
    opacity: 0.8;
    height: 1px; border: none;
    background-color: #D8DDE7;
    border-radius: 2px;
  }
  .type-and-use-size p {
    font-size: 14px;
    color: #464646;
    letter-spacing: 0;
  }
  .type-and-use-size {
    margin: 0 20px;
    display:inline-block;
    width: 25%;
    text-align: left;
    vertical-align: top;
  }
</style>