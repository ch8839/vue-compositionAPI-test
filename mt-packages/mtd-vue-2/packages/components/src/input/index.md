# 文本输入框 / Input

指允许用户在区域内输入文本、数值等内容的组件。

<div class="doc-warning">
Input 为受控组件，它总会显示 Vue 绑定值。<br>
通常情况下，应当处理 input 事件，并更新组件的绑定值（或使用v-model）。否则，输入框内显示的值将不会改变。
</div>

## 基础样式

:::include(src="./doc/base.vue")
:::

## 类型与用法

### 大小 <design-tag></design-tag>

:::include(src="./doc/size.vue")
:::

### 类型 <design-tag></design-tag>

根据场景的需要，可以使用不同的文本输入框类型，来适应页面内不同的信息层级。
:::include(src="./doc/genre.vue")
:::

### 状态 <design-tag></design-tag>

根据输入场景需要，输入框状态有正常状态、hover 状态、激活状态、禁用状态、错误状态。
:::include(src="./doc/status.vue")
:::

### 辅助信息展示 <design-tag></design-tag>

根据输入场景需要，辅助信息可以更好地提示用户如何有效完成信息的输入，降低错误成本。
:::include(src="./doc/helper.vue")
:::

### 可清空 <design-tag></design-tag>

:::include(src="./doc/clearable.vue")
:::

### 长文本 <design-tag></design-tag>

如果文字过多，超出输入框长度，常规方法为遮挡前面输入内容，如需查看全部内容可利用 文字提示/Tooltip 展示。
:::include(src="./doc/overflow.vue")
:::

### 密码输入框 <design-tag></design-tag>

:::include(src="./doc/password.vue")
:::

### 文本计数 <design-tag></design-tag>

通过设置 maxLength 限制输入的文本的长度，超过限制则不能输入。 设置 showCount 来控制是否显示文字计数。 只有 maxLength 和 showCount 同时设置才会显示文字计数。
:::include(src="./doc/showCount.vue")
:::

### 搜索框 <design-tag></design-tag>
通过点击放大镜icon或者键入回车触发search事件

:::include(src="./doc/input-search.vue")
:::

>文字提示的出现规则及更多信息，请参考 [文字提示/Tooltip <i class="mtdicon mtdicon-link-o"></i>](#components/tooltip)

 ### 多行文本输入框

:::include(src="./doc/textarea.vue")
:::

### 可自适应高度的文本输入框

通过设置 autosize 属性可以使得文本域的高度能够根据文本内容自动进行调整，并且 autosize 还可以设定为一个对象，指定最小行数和最大行数。
:::include(src="./doc/autosize-textarea.vue")
:::

### 图标文本输入框

对于大众熟知的表单内容，标签放置框内可以配合 icon 使用，常用于登录或注册场景。
:::include(src="./doc/icon.vue")
:::

### 固定格式

根据输入场景的需求，可以定制输入框前后内容，用于适配固定组合。
:::include(src="./doc/combination.vue")
:::

### 输入框组合

:::include(src="./doc/input-group.vue")
:::

## API

<api-doc name="Input" :doc="require('./api.json')"></api-doc>
<api-doc name="Textarea" :doc="require('../textarea/api.json')">
<span slot="desc">
<code>Textarea</code> 属性同浏览器自带的 <a href="https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/textarea">textarea</a> 属性保持一致
</span>
</api-doc>
<api-doc name="InputGroup" :doc="require('../input-group/api.json')"></api-doc>
<api-doc name="InputSearch" :doc="require('../input-search/api.json')"></api-doc>
其余属性和 Input 一致。
