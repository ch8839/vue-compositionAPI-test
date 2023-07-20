# Vue 2.x 版本迁移
## 介绍
本指南主要是为有 mtd-vue 经验的用户提供的，他们希望了解在 Vue 3.0 中 mtd 的新功能和更改。

## 语法变动
### slot & scopedSlot
Vue3 不在区分 slot 和 scopedSlot，所以在 mtd-vue-next 中，也必须按照 Vue3 语法来进行传递，下面是一个简单的例子
```html
<template>
  <mtd-tooltip>
    <template v-slot:content>
      文本提示
    </template>
  </mtd-tooltip>
</template>
```

### .sync
Vue3 将不在支持 `.sync` 修饰符，用户可以使用 `v-model:属性名` 来替代原有的 `属性名.sync`，并且事件名由原有的 连接符命名(如：`update:expanded-keys`)更改为驼峰式命名 (如: `update:expandedKeys`)

**仅有 update 事件更改了命名规则，其他事件仍然是连接符命名如: `toggle-expand`**

### v-model
`v-model` 对应的事件名从 Vue 2.x 的 `input` 事件变更为 Vue 3.x `update:modelValue` 事件

## 重大改变
### Modal 组件
现在 `Modal` 组件在 **首次打开** 前都不会在挂载内部的 `children` 节点，这意味着以下的代码:
```html
<mtd-modal>
  <mtd-form ref="form">
    something other
  </mtd-form>
</mtd-modal>
```
在首次 `Modal` 组件显示之前，通过 `this.$refs.form` 是获取不到正确的组件对象的。有类似的场景请在调用实例方法前增加非空判断。如 `this.$refs.form && this.$refs.form.validator()`
> 在此处的场景中我们推荐使用 Modal 的 :destroy-on-close="true" 属性让弹框在关闭时销毁内部的组件，而非使用 ref

### Select、Picker 组件
现在 Select、Picker 组件在 **首次打开** 时不再会触发 remote-method 方法，参考以下代码:
```html
<mtd-select filterable remote :remote-method="handler">
  <mtd-option v-for="opt in options" :key="opt.key" :value="opt.vlaue" :label="opt.label"></mtd-option>
</mtd-select>
<script>
  export default {
    data () {
      return { options: [] };
    },
    methods: {
      handler (query) {
        // do something
      }
    }
  }
</script>
```
如果有类似的场景，可以响应 `update:visible` 事件来实现之前的逻辑。
*注:  `remote-method` 的参数仍然可能是空字符串的情况*

### Tabs 组件
正如 0.x 版本中的提示，现在 `tabs` 不会在进行自动的激活匹配，这意味的以下下代码将不在显示激活状态:
```html
<mtd-tabs>
  <mtd-tab-pane label="Tab1" value="Tab1">
    示例内容: <br />
    明月几时有？把酒问青天。不知天上宫阙，今夕是何年。
  </mtd-tab-pane>
  <mtd-tab-pane label="Tab2" value="Tab2">
    示例内容: <br />
    我欲乘风归去，又恐琼楼玉宇，高处不胜寒。起舞弄清影，何似在人间！
  </mtd-tab-pane>
  <mtd-tab-pane label="Tab3" value="Tab3">
    示例内容: <br />
    转朱阁，低绮户，照无眠。 不应有恨，何事长向别时圆？
  </mtd-tab-pane>
  <mtd-tab-pane label="Tab4" value="Tab4" disabled>
    示例内容: <br />
    人有悲欢离合，月有阴晴圆缺，此事古难全。但愿人长久，千里共婵娟。
  </mtd-tab-pane>
</mtd-tabs>
```
*注: 上述代码缺少 `modelValue` 属性或者 `v-model` 配置*，且当没有正确匹配项时也不会在主动的激活第一项 `tab`

### TimePicker 组件
- 移除了 `element-id` 属性
- 不会在自动的进行类型推断，参考以下代码:
```html
<mtd-time-picker v-model="value"></mtd-time-picker>
<script>
  export default {
    data () {
      return {
        value: '',
      };
    },
  };
</script>
```
在 `@ss/mtd-vue@0.x` 版本中将会输出 `string` 类型的结果，但是在 `@ss/mtd-vue-next@3.x` 版本中默认将总是返回 `Date` 类型的结果，用户必须配置 `value-format` 属性来得到想要的格式类型如:
```html
<mtd-time-picker v-model="value" :value-format="HH:mm:ss"></mtd-time-picker>
```

### DatePicker 组件
同 `TimePicker` 组件，现在将不会自动推断 `modelValue` 值类型，用户可以配置 `value-format` 来得到想要的数据类型，参考 [示例](/components/date-picker#日期格式)

### Table 组件
- 移除了 `disableMouseEvent` 属性
- 事件名 `selection-change` 变更为 `update:selection` 参数与原有保持一致
- 多级表头语法变动，现在多级表头必须使用 `TableColumn` 组件的 `v-slot:group` 来实现，具体可查看 [示例](/components/table#多级表头)

### TableColumn 组件
- 移除了 `renderHeader` 属性，类似需求可使用 `v-slot:header`, 参考 [示例](/components/table#自定义表头)

### Tooltip 组件
移除了 dom `mtd-tooltip-rel` 节点，例如以下代码:
```html
<mtd-tooltip content="文字内容" default-visible placement="top">
  <span style="cursor: pointer;">示例</span>
</mtd-tooltip>
```
在 `@ss/mtd-vue@0.x` 版本中将生成如下的 dom 结构:
```html
<span class="mtd-tooltip-rel"><span style="cursor: pointer;">示例</span></span>
```
而在 `@ss/mtd-vue-next` 版本中则将 `mtd-tooltip-rel` 节点移除，其 dom 结构如下:
```html
<span style="cursor: pointer;">示例</span>
```

### Popover 组件
同 `Tooltip` 组件类似，移除了 dom `mtd-popover-rel` 节点

### Dropdown 组件
同 `Tooltip` 组件类似，移除了 dom `mtd-dropdown` 节点

### AnchorLink 组件
与 Vue Router 不同，现在 AnchorLink 组件接受的 `href` 属性仍然是必须 `encode` 的地址，如:
```html
<mtd-anchor-link href="#%E5%9B%BA%E5%AE%9A%E6%A8%A1%E5%BC%8F" title="固定模式"></mtd-anchor-link>
```

### ColorPicker 组件
在 `@ss/mtd-vue-next` 中我们移除了 `ColorPicker` 组件，后续我们将以独立的 `ColorPicker` 组件包的方式提供该组件的支持
