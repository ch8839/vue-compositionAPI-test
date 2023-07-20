<style lang="scss">
.demo-popover {

  .box {
    width: 500px;
    margin: 0 auto;
    .top {
      text-align: center;
    }

    .left {
      float: left;
      width: 60px;
    }

    .right {
      float: right;
      width: 60px;
    }

    .bottom {
      clear: both;
      text-align: center;
    }

    .item {
      margin: 4px;
      display: inline-block;
    }

    .top .mtd-btn,
    .bottom .mtd-btn {
      margin: 4px;
    }

    .left .mtd-btn,
    .right .mtd-btn {
      margin: 8px 10px;
    }
  }
}
.demo-popover-content{
  max-width: 160px;
}
</style>

# 弹出框 / Popover

弹出框（Popover）是一个非模态对话框，显示页面中选定元素的上下文信息或相关操作项。

<!-- - 与 0.x 版本，由于 Vue 取消了唯一根节点的限制，所以删除根 `<span class='mtd-popover-rel'>` 节点及对应的 tag 属性。 -->

## 基础样式

:::include(src="./doc/base.vue")
:::

<!-- > 如果承载的内容较多，操作较重时，建议使用 [对话框 /ModalDialog <i class="mtdicon mtdicon-link-o"></i>](/components/modal) 🤡-->

## 类型与用法

根据场景预留空间与信息重要程度，弹出框中文字大小分为：小号、默认

### 大小 <design-tag></design-tag>

:::include(src="./doc/size.vue")
:::

### 位置 <design-tag></design-tag>

:::include(src="./doc/position.vue")
:::

### 内容展示

弹出框可承载多种类型的内容
:::include(src="./doc/content.vue")
::: 

## API

<api-doc name="Popover" :doc="require('./api.json')"></api-doc>
