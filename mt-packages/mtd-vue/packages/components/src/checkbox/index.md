# 复选框 / Checkbox

单个复选框允许用户对单个称述语句设置真/假值，多个复选框使用户在一组相互独立的选项中选择一或多项。

## 基础样式

:::include(src="./doc/base.vue")
:::

<!-- > 单个复选框的用法类似 [开关/Switch <i class="mtdicon mtdicon-link-o"></i>](/components/switch) <br>

> 若选项过多，且无需全部展示出来时，推荐用 [Select/下拉选择 <i class="mtdicon mtdicon-link-o"></i>](/components/select)  里的多选形式 -->

## 类型与用法

### 大小 <design-tag></design-tag>

:::include(src="./doc/size.vue")
:::

### 状态 <design-tag></design-tag>

复选框有未选中态、未选中 hover 态、已选中态、中间态、未选中禁用态、已选中禁用态、中间禁用态。
:::include(src="./doc/status.vue")
:::

### 全选

:::include(src="./doc/all-checked.vue")
:::

### 嵌套型

可使用缩进来表示级联关系；当父级没有被选中时子级应该全部禁用。
:::include(src="./doc/nested.vue")
:::

## API

<api-doc name="Checkbox" :doc="require('./api.json')"></api-doc>
<api-doc name="CheckboxGroup" :doc="require('../checkbox-group/api.json')"></api-doc>
