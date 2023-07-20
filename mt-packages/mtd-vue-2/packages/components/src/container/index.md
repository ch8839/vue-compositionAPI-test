# 布局容器 / Layout

`<mtd-container>`：外层容器。当子元素中包含 `<mtd-header>` 或 `<mtd-footer>` 时，全部子元素会垂直上下排列，否则会水平左右排列。

`<mtd-header>`：顶栏容器。

`<mtd-aside>`：侧边栏容器。

`<mtd-main>`：主要区域容器。

`<mtd-footer>`：底栏容器。
## 常见页面布局
:::include(src="./doc/base.vue")
:::

## API
<api-doc name="Container" :doc="require('./api.json')"></api-doc>
<api-doc name="Header" :doc="require('./../header/api.json')"></api-doc>
<api-doc name="Aside" :doc="require('./../aside/api.json')"></api-doc>
<api-doc name="Main" :doc="require('./../main/api.json')"></api-doc>
<api-doc name="Footer" :doc="require('./../footer/api.json')"></api-doc>
