# 确认框 / Confirm
## 基础样式
:::include(src="./doc/base.vue")
:::

## 类型与用法
### 自定义内容
:::include(src="./doc/custom.vue")
:::

### 延迟关闭
:::include(src="./doc/promise.vue")
:::

### 动态确认
:::include(src="./doc/dynamic.vue")
:::

## API
### 全局引入
你可以通过 `this.$mtd.confirm` 方法来来直接调用组件
### 单独引入
如果是单独引入，你可以通过以下方式来引入 Confirm 并使用
```
import { Confirm } from '@ss/mtd-vue';
Confirm(options);
```

**注意: this.$mtd.confirm / Confirm 方法总是返回 promise，需要使用 promise.catch() 来阻止 rejected promise 报错。**

**0.3.21 版本后，增加 $$mtd 标识在帮助在 owl 处进行过滤，详细查看：<a href="https://ones.sankuai.com/ones/product/4348/workItem/requirement/detail/40843044">Ones</a>**
<api-doc name="Confirm" :doc="require('./api.json')"></api-doc>
