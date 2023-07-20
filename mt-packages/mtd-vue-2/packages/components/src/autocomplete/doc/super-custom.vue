<template>
  <mtd-autocomplete v-model="autoValue" placeholder="请输入">
    <div class="mtd-demo-autocomplete-super"
      v-for="(item, i) in options" :key="i">
      <div class="mtd-demo-autocomplete-super-title">
        <span class="mtd-progress-success">选项</span>
        <span class="mtd-demo-autocomplete-super-more">更多</span>
      </div>
      <mtd-option :key="i"
        :value="item.content">
        <span>{{ item.content }}</span>
        <span class="mtd-demo-autocomplete-super-count"> {{ item.count }} </span>
      </mtd-option>
    </div>
  </mtd-autocomplete>
</template>
<script>
export default {
  data () {
    return {
      options: [{
        content: 'mtd',
        count: 1,
      }, {
        content: 'meituan',
        count: 2,
      }, {
        content: 'autocomplete',
        count: 3,
      }],
      autoValue: '',
    };
  },
};
</script>

<style lang="scss">
.mtd-demo-autocomplete-super {
  &-title {
    padding: 5px 10px 0 10px;
  }
  &-more {
    float: right;
  }
  &-count {
    float: right;
    color: #ccc;
  }
  border-bottom: 1px solid #f5f6f7;
}
</style>
