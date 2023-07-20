# 如何使用
## NPM 安装
使用 mnpm 的方式安装。
```
mnpm i @ss/mtd-vue2
mnpm i @vue/composition-api
```

## 全局引入

```js

// 引入组件库
import Vue from 'vue'
import VueCompositionApi from '@vue/composition-api'
import MTD_NEXT from '@ss/mtd-vue2'

// 引入主题 theme-chalk样式
import '@ss/mtd-vue2/lib/theme-chalk/index.css'

Vue.use(VueCompositionApi)
Vue.use(MTD_NEXT)

```
## 按需引入

```js
import Vue from 'vue'
import VueCompositionApi from '@vue/composition-api'

import '@ss/mtd-vue2/lib/theme-chalk/button.css'
import Button from '@ss/mtd-vue2/es/button'

Vue.use(VueCompositionApi)
Vue.component(Button.name, Button)
```


## 切换主题

如果我们期望使用别的主题，有以下的方式切换——我们以美团UI黄主题为例：


### 一般情况
```js
// 将你代码中的css路径切换主题命名前缀即可
// theme-chalk ---> theme-yellow

import '@ss/mtd-vue2/lib/theme-yellow/index.css' // 全局引入样式

import '@ss/mtd-vue2/lib/theme-yellow/button.css' // 按需引入样式
```


### 全局化配置方式引入了组件库
[接入方式](https://km.sankuai.com/collabpage/1393741062#id-%E4%B8%89%E3%80%81%E3%80%90%E5%85%B1%E5%AD%98%E6%B4%BE%E3%80%91%E5%A6%82%E6%9E%9C%E4%BD%A0%E5%B7%B2%E7%BB%8F%E6%9C%89%E7%BB%84%E4%BB%B6%E5%BA%93%EF%BC%8C%E4%BD%86%E6%98%AF%E5%90%8C%E6%97%B6%E6%83%B3%E5%BC%95%E5%85%A5%20MTD%203.0%20%E7%BB%84%E4%BB%B6%E5%BA%93%E9%83%A8%E5%88%86%E7%BB%84%E4%BB%B6)

修改scss变量的环节中，将主题前缀进行替换

```scss

// 将你代码中的css路径切换主题命名前缀即可
// theme-chalk ---> theme-yellow

$prefix: 'mtdu'; // 修改统一样式前缀
$icon-prefix: 'mtduicon';
$icon-font-family: 'mtduicon'; // 修改图标的 font-family 属性名
$icon-font-path: '~@ss/mtd-vue2/src/theme-yellow/fonts'; // ⚠️⚠️⚠️必填必填必填必填必填必填必填！！！！！！！！！！！！！！！！
@import '@ss/mtd-vue2/src/theme-yellow/index.scss'

```
