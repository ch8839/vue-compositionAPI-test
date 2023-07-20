# 消息提示 / Message

<style lang="scss">
.demo-message{
  .mtd-btn+.mtd-btn{
    margin-left: 20px;
  }
}
</style>
## 基础样式
:::include(src="./doc/base.vue")
:::

## 类型与用法
### 倾向 <design-tag></design-tag>
:::include(src="./doc/type.vue")
:::

### 消失方式 <design-tag></design-tag>
如果信息较轻量，不想打断用户，可出现3s后自动关闭；如果信息较重要，需用户确认，必须手动关闭才能消失。
:::include(src="./doc/duration.vue")
:::

## API
### Message
你可以通过 `this.$mtd.message` 来直接调用组件，亦或者使用单独引用的方式调用组件
```
import { Message } from '@ss/mtd-vue';
```
以下是 `Message` 可配置参数

<api-doc name="Message" :doc="require('./api.json')"></api-doc>
