# 全局化配置 / ConfigProvider

<div class="doc-warning">
受 Vue 组件要求必须有唯一根节点限制，以组件的方式使用时会创建一个 <code>div</code> 节点，在 Vue3.x 版本将会移除该节点。
</div>

:::include(src="./doc/base.vue")
:::

## 使用
### 组件
`ConfigProvider` 使用 `Vue` 提供的 [provider/inject](https://cn.vuejs.org/v2/api/#provide-inject)，只需要在应用中包裹即可生效。
```html
<template>
    <mtd-config-provider prefix-cls="xx">
      <App />
    </mtd-config-provider>
</template>
```
<br>

### 全局方法
你可以通过 `ConfigProvider.config` 来直接调用组件。
**注： 方法参数不同于组件属性，需要使用驼峰式写法，如：`prefixCls`**
```js
import { ConfigProvider } from '@ss/mtd-vue';
ConfigProvider.config({ prefixCls: 'xx' });
```
组件实例上的方法如：`this.$mtd.message`、`this.$mtd.notify`、`this.$mtd.confirm` 则必须通过上述方式来全局设置。

<br>

### 完整示例
针对 `prefixCls`、 `iconPrefixCls` 等配置项，需要结合 `scss` 来配合使用，示例如下：

**index.js** 文件
```js
// 也可采用组件形式
import { ConfigProvider } from '@ss/mtd-vue';
import './index.scss'; // 引入样式，无需在引入 mtd 的 css 文件
ConfigProvider.config({ prefixCls: 'xx', iconPrefixCls: 'xxicon' });
```
**index.scss** 文件
```scss
$prefix: 'xx'; // 修改统一样式前缀
$icon-prefix: 'xxicon'; // 修改图标 class 的前缀
$icon-font-family: 'xxicon'; // 修改图标的 font-family 属性名
$icon-font-path: '~@ss/mtd-vue/components/theme2/fonts'; // 必须要改变字体路径
@import "@ss/mtd-vue/components/theme2/index.scss";
```
## API
<api-doc :doc="require('./api.json')"></api-doc>
