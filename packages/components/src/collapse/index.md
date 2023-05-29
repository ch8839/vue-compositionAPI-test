<style lang='scss'>
  .demo-collapse{
    .source{
      p{
        text-align: left;
      }
      pre{
        padding: 0px;
        margin: 0px;
      }
    }
  }
</style>
# 折叠面板 / Collapse
允许用户折叠和展开一块内容区域，利用折叠面板更加有效利用空间。

## 基础样式
:::include(src="./doc/base.vue")
:::
## 类型与用法
### 类型
:::include(src="./doc/drag.vue")
:::

:::include(src="./doc/sample.vue")
:::

:::include(src="./doc/area.vue")
:::

### 展开方式
可同时展开多个面板。
将 `value` 值设置成数组可同时展开多个
:::include(src="./doc/multi.vue")
:::

展开步进载入。
:::include(src="./doc/loading.vue")
:::

### 文件类
用于展开或收起更多与之相关的内容。
使用 `mtd-collapse-transition` 组件能够实现下拉动画
:::include(src="./doc/file.vue")
:::

### 嵌套折叠面板
面板抽屉内可嵌套多个子级折叠面板。
:::include(src="./doc/fold.vue")
:::

### 折叠按钮分类
:::include(src="./doc/icon.vue")
:::


## API
<api-doc name="Collapse" :doc="require('./api.json')"></api-doc>
<api-doc name="CollapseItem" :doc="require('../collapse-item/api.json')"></api-doc>
