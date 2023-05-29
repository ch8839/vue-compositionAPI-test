# 标签页 / Tabs

用于展示同一信息对象的不同类别或视角，可以互相之间快速切换。

## 基础样式
:::include(src="./doc/base.vue")
:::
<!-- > Radio可作为更次级的标签页来使用, 请参考 [单选项/Radio <i class="mtdicon mtdicon-link-o"></i>](/components/Radio) -->

## 类型与用法
### 大小 <design-tag></design-tag>
:::include(src="./doc/size.vue")
:::

### 类型 <design-tag></design-tag>
提供不同的类型用作层级区分。
:::include(src="./doc/type.vue")
:::
:::include(src="./doc/text.vue")
:::
:::include(src="./doc/card.vue")
:::
<!-- > 在类目少、名称短时，或者用作层级区分时使用选项卡型，请参考 [单选/Radio <i class="mtdicon mtdicon-link-o"></i>](/components/radio) -->

### 带图标型
需要强调标题内容时可以加图标予以区分。
:::include(src="./doc/picture.vue")
:::

### 多标签项
当页面标签项过多或页面空间受限时，可以将超出的标签项收起或隐藏。
:::include(src="./doc/multi-label.vue")
:::
:::include(src="./doc/multi-label-tab.vue")
:::

### 其他位置

:::include(src="./doc/vertical.vue")
:::

### 标签页添加
用于新建或打开新的标签页。
:::include(src="./doc/add.vue")
:::

## API
<api-doc name="Tab" :doc="require('./api.json')"></api-doc>
<api-doc name="TabPane" :doc="require('./../tab-pane/api.json')"></api-doc>
<api-doc name="TabDrop" :doc="require('./../tab-drop/api.json')"></api-doc>
