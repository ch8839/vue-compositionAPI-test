<style lang='scss'>
.demo-dropdown-menu{
  .mtd-dropdown-menu{
    width: 180px;
    display: inline-block;
  }
  .demo-dropdown-menu-group{
    display: inline-block;
    vertical-align: top;
    text-align: left;
  }
}
</style>

# 下拉菜单 / DropdownMenu

收纳更多操作元素，由按钮、操作图标、指示器或其他控件触发。

## 基础样式

:::include(src="./doc/base.vue")
:::

## 类型与用法

### 大小 <design-tag></design-tag>

:::include(src="./doc/size.vue")
:::

### 呼出方式 <design-tag></design-tag>

:::include(src="./doc/hover.vue")
:::

### 呼出位置 <design-tag></design-tag>

:::include(src="./doc/position.vue")
:::
 
### 类型 <design-tag></design-tag>

基础下拉
:::include(src="./doc/base-drag.vue")
:::

图标型下拉 + 辅助说明
:::include(src="./doc/icon-drag.vue")
:::

下拉内容分类展示
:::include(src="./doc/classify.vue")
:::

长文本 
:::include(src="./doc/long-text.vue")
:::

<!-- 级联面板和树形面板
:::include(src="./doc/multi-level.vue")
:::

@luojie22 todo 给个demo
 -->

## API

<api-doc name="Dropdown" :doc="require('../dropdown/api.json')"></api-doc>
<api-doc name="DropdownMenu" :doc="require('./api.json')"></api-doc>
<api-doc name="DropdownMenuItem" :doc="require('../dropdown-menu-item/api.json')"></api-doc>
