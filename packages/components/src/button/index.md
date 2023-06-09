# 按钮 / Button

是用于触发一个行动并形成决策的组件。

## 基础样式

:::include(src="./doc/base.vue")
:::

## 类型与用法

### 大小 <design-tag></design-tag>

:::include(src="./doc/size.vue")
:::

### 类型 <design-tag></design-tag>

根据场景的需要，不同按钮类型可表达操作的重要程度等级。
:::include(src="./doc/type.vue")
:::

<!-- > 文字按钮的形式和链接的形式非常像但用法不同,请参考 [链接/Link <i class="mtdicon mtdicon-link-o"></i>](/components/link)🤡引入报错-->

### 状态 <design-tag></design-tag>

以常规按钮为例，按钮状态有正常状态、hover 状态、激活状态、禁用状态、加载状态。
:::include(src="./doc/status.vue")
:::

### 颜色

可以通过颜色，潜示状态。
:::include(src="./doc/color.vue")
:::

### 幽灵按钮

:::include(src="./doc/ghost.vue")
:::

### 图标型

当图标为大众熟知时可直接使用，用法与文字按钮一致。如需突出重点可配置默认态为主色，无需突出可配置辅色使用。
:::include(src="./doc/icon.vue")
:::

### 图标 + 文字

当图标的表意不是很明确或者需要强调操作时可以图标结合文字一起使用。
:::include(src="./doc/text.vue")
:::

### 菜单型

按钮与下拉箭头之间无分割线，两者作为一个整体进行点击，展开折叠操作。
:::include(src="./doc/menu.vue")
:::

### 按钮组

一组相关联的操作聚合在一起成为按钮组，方便快捷操作。
:::include(src="./doc/group.vue")
:::

### 链接型

以链接的形式渲染按钮
:::include(src="./doc/link.vue")
:::

## API

<api-doc name="Button" :doc="require('./api.json')"></api-doc>
<api-doc name="IconButton" :doc="require('./../icon-button/api.json')"></api-doc>

<style lang="scss">
  .demo-btns{
    .mtd-btn + .mtd-btn{
      margin-left: 90px;
    }
  }
  .demo-btn-group {
    display: inline-block;
    .mtd-btn + .mtd-btn{
      margin-left: 18px;
    }
  }
  .demo-button{
    .mtd-btn + .mtd-btn{
      margin-left: 8px;
    }
  }
</style>
