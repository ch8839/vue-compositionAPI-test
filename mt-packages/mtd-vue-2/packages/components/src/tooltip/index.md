<style lang="scss">
.demo-tooltip {
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
</style>
# 文字提示 / Tooltip
用于缩略信息的完整展示，不承载复杂文本和操作，通过鼠标移入显示、移出消失的方式查看。
不兼容更新:
 - 与 0.x 版本，由于 Vue 取消了唯一根节点的限制，所以删除根 `<span class='mtd-tooltip-rel'>` 节点及对应的 tag 属性。
## 基础样式
:::include(src="./doc/base.vue")
:::

## 类型与用法
### 大小 <design-tag></design-tag>
:::include(src="./doc/size.vue")
:::

### 颜色 <design-tag></design-tag>
:::include(src="./doc/color.vue")
:::

### 位置 <design-tag></design-tag>
:::include(src="./doc/position.vue")
:::

## API
<api-doc name="Tooltip" :doc="require('./api.json')"></api-doc>
