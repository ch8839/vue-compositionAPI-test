<style>
.demo-menu.demo-block .source{
  text-align: left;
}

.demo-menu .mtd-submenu-icon img,
.demo-menu .mtd-menu-item-icon img{
  width: 16px;
  height: 16px;
}
</style>

# 导航菜单 / Menu

## 基础样式

:::include(src="./doc/base.vue")
:::

## 类型与用法

### 内嵌菜单

:::include(src="./doc/inline.vue")
:::

### 缩起内嵌菜单

:::include(src="./doc/collapse.vue")
:::

### 垂直菜单

子菜单是弹出的形式。
:::include(src="./doc/vertical.vue")
:::

### 主题

内建了两套主题 light | dark，默认 light，以下展示的是 dark 主题
:::include(src="./doc/theme.vue")
:::

## API

<api-doc name="Menu" :doc="require('./api.json')"></api-doc>
<api-doc name="SubMenu" :doc="require('./../submenu/api.json')"></api-doc>
<api-doc name="MenuItem" :doc="require('./../menu-item/api.json')"></api-doc>
