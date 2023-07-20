<style lang='scss'>
.demo-notification {
  .center-h {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .mtd-btn{
    margin-right: 20px;
  }
  .preview-btn {
    border-radius: 44px;
    font-weight: bold;
    width: 96px;
    margin-left: 40px;
  }
}
</style>

# 通知 / Notification
用于展示通知提示信息或用户操作反馈信息。

## 基础样式
用于系统主动推送的通知，内容较为复杂，可包含操作按钮、图片、链接等，在屏幕右上角展示。
:::include(src="./doc/base.vue")
:::

## 类型与用法
### 倾向 <design-tag></design-tag>
:::include(src="./doc/type.vue")
:::

### 消失方式 <design-tag></design-tag>
如果信息较轻量，不想打断用户，可出现3s后自动关闭；如果信息较重要，需用户确认，必须手动关闭才能消失。
:::include(src="./doc/disappear.vue")
:::

### 内容展示
出现在页面右上角的系统型通知可承载多种元素。
:::include(src="./doc/content.vue")
:::

## API

你可以通过 `this.$mtd.notify` 来直接调用组件，亦或者使用单独引用的方式调用组件
```
import { Notification } from '@ss/mtd-vue-next';
```
以下是 `Notification` 可配置参数
<api-doc name="Notification" :doc="require('./api.json')"></api-doc>
