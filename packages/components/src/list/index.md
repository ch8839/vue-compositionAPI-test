<style lang="scss">
.mtd-list {
  text-align: left;
}
.demo-content {
  display: flex;
  align-items: center;
  position: relative;
}
.demo-content-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;

  &-small {
    width: 20px;
    height: 20px;
  }

  &-large {
    width: 36px;
    height: 36px;
  }
}

.demo-content-username {
  margin-left: 10px;
}

.demo-more {
    text-align: center;
    margin: 9px 0;
    cursor: pointer;
    color: #4E73FF;
}
.demo-content-title {
  font-weight:500;
  color: #464646;
}
.demo-content-description {
  font-size: 12px;
  color: #ADADAD;
}
.demo-content-main {
  flex: 1 0;
  margin-left: 16px;
}
.demo-extra {
  font-size: 12px;
  color: #ADADAD;
  position: absolute;
  right: 0;
  top: 0;
}
.demo-small {
  font-size: 12px;
}
.demo-normal {
  font-size: 14px;
}
.demo-large {
  font-size: 16px;
}
.demo-editable {
  color: rgba(0,0,0,0.9);
  cursor: pointer;
}
</style>
# 列表 / List
多组同类、同级复杂数据信息的纵向排列，满足信息展示和操作指引等交互场景

## 基础样式
:::include(src="./doc/base.vue")
:::

## 类型与用法
### 大小 <design-tag></design-tag>
根据场景空间选择组件大小，常规可选用中号行高。在较为局限的空间内，如弹窗和卡片等可选用小号行高。
小号
:::include(src="./doc/small.vue")
:::

中号
:::include(src="./doc/normal.vue")
:::

大号
:::include(src="./doc/large.vue")
:::

### 加载更多
可通过点击加载更多数据。
:::include(src="./doc/load-more.vue")
:::
可通过触底滚动加载更多数据。
:::include(src="./doc/scroll-load-more.vue")
:::

### 作为导航目录
允许对项目进行点击，触发导航到相应详细信息页面。
:::include(src="./doc/navbar.vue")
:::

### 带操作列表
可配合操作按钮进行使用。
:::include(src="./doc/operation.vue")
:::

可以使用右键菜单、滑动操作。
:::include(src="./doc/contextmenu.vue")
:::

### 分类列表
列表可以按类型将信息进行分类
:::include(src="./doc/classify.vue")
:::

### 下拉列表
:::include(src="./doc/collapse.vue")
:::

## API
<api-doc name="List" :doc="require('./api.json')"></api-doc>
<api-doc name="ListItem" :doc="require('./../list-item/api.json')"></api-doc>
<api-doc name="ListItemGroup" :doc="require('./../list-item-group/api.json')"></api-doc>
