# 选择器 / Select
<high-performance-tag></high-performance-tag><br><br>
从预定的列表中选择一个或多个选项。<br><br>
该组件为高性能组件，支持虚拟滚动

## 基础样式

:::include(src="./doc/base.vue")
:::

 ## 类型与用法

## 大小

:::include(src="./doc/size.vue")
:::

## 类型

:::include(src="./doc/type.vue")
:::

## 状态

:::include(src="./doc/status.vue")
:::

## 长文本

:::include(src="./doc/tooltip.vue")
:::

## value 为对象

某些场景下需要将 value 值设置为对象。仅支持slot传入option的方式，将value绑定到对象本身，同时配置value-key。

:::include(src="./doc/value-object.vue")
:::

 ## 带搜索

:::include(src="./doc/search.vue")
:::

## 分类下拉框
:::include(src="./doc/group.vue")
::: 

<!-- ## 搜索高亮

:::include(src="./doc/highlight.vue")
:::
 -->
 ## 多选

:::include(src="./doc/multiple.vue")
::: 

## 自定义回显内容

:::include(src="./doc/custom-result.vue")
::: 

## 响应式省略标签

:::include(src="./doc/responsive.vue")
:::

## 自定义option 内容的虚拟滚动

:::include(src="./doc/custom-virtual.vue")
:::

## 创建条目
可以创建并选中选项中不存在的条目

:::include(src="./doc/allowCreate.vue")
:::
## API

<api-doc name="Select" :doc="require('./api.json')"></api-doc>
<api-doc name="OptionGroup" :doc="require('../option-group/api.json')"></api-doc>
<api-doc name="Option" :doc="require('../option/api.json')"></api-doc>
