# 自动完成 / Autocomplete

## 基础样式
通过 `data` 属性设置自动完成的数据源。
:::include(src="doc/base.vue") 通过 data 设置自动完成的数据源。
:::

## 类型与用法

### 自定义选项
除了使用 `data`，还可以直接传入 `Option` 组件作为 `slot`
:::include(src="./doc/custom.vue")
:::

:::include(src="./doc/customOption.vue")
:::

完全自定义 Option，显示复杂的布局。
:::include(src="./doc/super-custom.vue")
:::

过滤函数，配合`data`属性使用
:::include(src="./doc/filter.vue")
:::

### 远程提示
:::include(src="./doc/remote.vue")
:::

## API
<api-doc name="Autocomplete" :doc="require('./api.json')"></api-doc>