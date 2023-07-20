# 树选择器 / TreeSelect
## 基础样式
:::include(src="./doc/base.vue")
:::

## 类型与用法
### 可选父节点或子节点
:::include(src="./doc/changeOnSelect.vue")
:::

### 信息回显
回显选中路径，可明确提示和告知用户选中信息的分类来源。
`formatter` 仅支持返回 `string`
:::include(src="./doc/formatter.vue")
:::

### 动态加载
由于计算属性在调用 $set 时并不会触发 watch，所以动态加载时并不支持 data 属性值为计算属性。
:::include(src="./doc/load.vue")
::: 

### 搜索
异步搜索通过直接修改数据源 `data` 属性来实现，搜索过程中将 `loading` 属性设置成 `true`，同时由于 `value` 的值不一定在数据源中，所以需要配合 `formatter` 属性来自定义输入框的展示值
:::include(src="./doc/search.vue")
:::

### 自定义节点内容
:::include(src="./doc/custom.vue")
::: 

### 多选
:::include(src="./doc/multiple.vue")
::: 

## API
<api-doc name="TreeSelect" :doc="require('./api.json')"></api-doc>

