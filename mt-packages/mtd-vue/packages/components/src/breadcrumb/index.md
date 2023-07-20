# 面包屑 / Breadcrumb

用于展示当前页面的路径或层级，并且能够快速返回之前的任意页面。

## 基础样式

:::include(src="./doc/base.vue")
:::

## 类型与用法

### 大小

:::include(src="./doc/size.vue")
:::

### 当前节点
当前节点允许被隐藏或加粗使用
:::include(src="./doc/current-style.vue")
:::

### 折叠和子节点下拉
面包屑导航中可以在「中部」和「前部」进行层级的折叠，并通过下拉组件展示折叠的节点。折叠情况下最少暴露三个层级,多个平行层级的子节点可以通过节点下拉快速切换

:::include(src="./doc/dropmenu.vue")
:::


### 首页用图标展示

图形化展示利于突出首页层级。
:::include(src="./doc/icon.vue")
:::

### 自定义分隔符

面包屑导航中每个层级间的分隔符默认为「/」，并允许自定义替换为其他图标
:::include(src="./doc/custom-separator.vue")
:::

## API

<api-doc name="Breadcrumb" :doc="require('./api.json')"></api-doc>
<api-doc name="BreadcrumbItem" :doc="require('../breadcrumb-item/api.json')"></api-doc>
