<style lang='scss'>
.demo-rate {
  &.demo-block .source {
    .mtd-rate-text {
      display: inline-block;
      width: 50px;
    }
  }
  .demonstration {
    display: block;
    font-size: 14px;
    color: #636777;
    margin-top: 15px;
  }
}
</style>
# 评分 / Rate

## 基础样式
:::include(src="./doc/base.vue")
:::

## 类型与用法

### 颜色 <design-tag></design-tag>
支持用不同颜色区分等级，用于对评价的等级需要突出强调的场景。
:::include(src="./doc/color.vue")
:::

### 辅助文字
用辅助文字直接地表达对应评分。
:::include(src="./doc/text.vue")
:::

### 半星
支持选中半星。
:::include(src="./doc/half.vue")
:::

### 只读
只读的评分用来展示分数，允许出现半星，无法进行鼠标交互。只读模式支持看到精准的分数，用于对评价的分数有精准需求的场景。
:::include(src="./doc/read-only.vue")
:::

### 清除
支持允许或者禁用清除。
:::include(src="./doc/delete.vue")
:::

### 自定义图标和个数

:::include(src="./doc/other.vue")
:::

## API
<api-doc name="Rate" :doc="require('./api.json')"></api-doc>
