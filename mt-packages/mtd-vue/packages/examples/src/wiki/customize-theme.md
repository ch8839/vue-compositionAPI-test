# 自定义主题
`theme-chalk` 使用 `scss` 编写。你可以通过 `scss` 变量来实现自定义主题，或者使用覆盖样式达到自定义效果，**不推荐直接 fork 组件样式源文件**

## 使用定制主题工具 (待工具支持)：
进入[主题定制工具官网](https://mtdui.sankuai.com/theme#/sites)，具体步骤：新建站点 => 进入详情 => 主题管理 => 配置主题 => 发布。

发布成功后大象通知会给你返回一个主题包名@bfe/mtd-theme-xx，安装包，然后在项目入口文件引入自定义的主题样式。
```
  mnpm i @bfe/mtd-theme-xx; // 安装主题包
  import '@bfe/mtd-theme-xx/index.css'; // 入口文件引入样式
```

## 在项目中修改 `scss` 变量
**请尽量只使用基础变量，组件级别变量正在梳理中**

你可以新建一个样式文件，例如 `custom-theme.scss` 写入想要更改的变量，然后引入 `theme-chalk` 样式，如:
```
/* 改变 button 默认圆角大小 */
$button-radius: 2px;

/* 必须要改变字体路径 */
$icon-font-path: '~@ss/mtd-vue2/components/theme-chalk/fonts';
@import "@ss/mtd-vue2/components/theme-chalk/index.scss";
```
**覆盖字体路径变量是必需的，将其赋值为 mtd-vue 中 icon 图标所在的相对路径即可。**

之后，在项目中，引入以上样式文件即可：
```
import Vue from 'vue'
import MTD from '@ss/mtd-vue2'
import './custom-theme.scss'

Vue.use(MTD)
```
### 按需加载实现自定义主题
按需加载实现自定义主题也是使用 `scss` 变量覆盖的方式，不同的是当我们手动实现按需加载时能够灵活的指定组件样式的路径如:
```
// file: custom-button.scss
$button-radius: 10px;

/* 必须要改变字体路径 */
$icon-font-path: '~@ss/mtd-vue2/components/theme-chalk/fonts';
@import "@ss/mtd-vue2/components/theme-chalk/button.scss";

// entry.js
import Button from '@ss/mtd-vue2/lib/button'
import './custom-button.scss'

```
如果使用 [babel-plugin-component](https://github.com/ElementUI/babel-plugin-component) 插件实现按需的话，只需要修改插件 `styleLibraryName` 的配置:
```
{
  "plugins": [
    [
      "component",
      {
        "libraryName": "@ss/mtd-vue2",
        "styleLibraryName": "theme-chalk"
      }
    ]
  ]
}
```
