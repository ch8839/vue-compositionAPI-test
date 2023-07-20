<template>
  <div>
    <p>下拉条目分类展示。</p>
    <mtd-picker v-model="value" placeholder="请选择" style="width: 200px;">
      <mtd-option-group
        v-for="(group, index) in groupOptions"
        :key="group.label"
        :label="group.label"
        :disabled="group.disabled"
      >
        <mtd-option
          v-for="item in group.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          :disabled="item.disabled"
        />

      </mtd-option-group>
    </mtd-picker>
  </div>
</template>

<script>
export default {
  data() {
    return {
      groupOptions: [
        {
          label: '热门城市',
          disabled: true,
          options: [
            {
              value: 'Shanghai',
              label: '上海',
            },
            {
              value: 'Beijing',
              label: '北京',
            },
          ],
        },
        {
          label: '城市名',
          options: [
            {
              value: 'Chengdu',
              label: '成都',
            },
            {
              value: 'Shenzhen',
              label: '深圳',
            },
            {
              value: 'Guangzhou',
              label: '广州',
            },
            {
              value: 'Dalian',
              label: '大连',
            },
          ],
        },
      ],
      value: '',
    }
  },
}
</script>

<style lang="scss">
.group-hr {
  opacity: 0.8;
  height: 1px;
  border: none;
  background-color: #d8dde7;
  border-radius: 2px;
}
</style>