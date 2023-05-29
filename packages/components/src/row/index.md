# 布局 / Gird

通过基础的 24 分栏，迅速简便地创建布局。

## 基础布局

使用单一分栏创建基础的栅格布局。
通过 row 和 col 组件，并通过 col 组件的 `span` 属性我们就可以自由地组合布局。
:::include(src="./doc/base.vue")
:::

## 类型与用法

### 分栏间隔

分栏之间存在间隔。
Row 组件 提供 `gutter` 属性来指定每一栏之间的间隔，默认间隔为 0。
:::include(src="./doc/gutter.vue")
:::

### 混合布局

通过基础的 1/24 分栏任意扩展组合形成较为复杂的混合布局。
:::include(src="./doc/mix.vue")
:::

### 分栏偏移

支持偏移指定的栏数。
通过制定 col 组件的 `offset` 属性可以指定分栏偏移的栏数。
:::include(src="./doc/offset.vue")
:::

### 对齐方式

通过 `flex` 布局来对分栏进行灵活的对齐。
将 `type` 属性赋值为 'flex'，可以启用 flex 布局，并可通过 `justify` 属性来指定 start, center, end, space-between, space-around 其中的值来定义子元素的排版方式。
:::include(src="./doc/align.vue")
:::

### 响应式布局

参照了 Bootstrap 的 响应式设计，预设了六个响应尺寸：`xs`、`sm`、`md`、`lg`、`xl`、`xxl`。
:::include(src="./doc/response.vue")
:::

## API

<api-doc name="Row" :doc="require('./api.json')"></api-doc>
<api-doc name="Col" :doc="require('../col/api.json')"></api-doc>
