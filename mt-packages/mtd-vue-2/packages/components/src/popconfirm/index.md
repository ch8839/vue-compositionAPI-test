<style lang="scss">
.demo-popconfirm {

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
.demo-popconfirm-content{
  max-width: 160px;
}
</style>


# 气泡确认框 / Popconfirm
## 基础样式
:::include(src="./doc/base.vue")
:::

## 类型与用法
### 位置
:::include(src="./doc/position.vue")
:::

### 自定义 Icon
:::include(src="./doc/icon.vue")
:::

## API

<api-doc name="Popconfirm" :doc="require('./api.json')">
  <p slot="props-desc">
    更多属性请参考 <a href="http://mtdui.sankuai.com/mtd/vue/components/popover#popover-props">popover</a>
  </p>
</api-doc>
