<style lang="scss">
  .demo-mtd-form-helper {
    font-size: 8px;
    color: #ADADAD;
    margin-left: 8px;
  }
  .demo-form-tooltip{
    margin-left: 12px;
  }
  .demo-form{
    .mtd-form {
      display: inline-block;
    }
  }
  .demo-form-title{
    text-align: left;
    font-size: 12px;
    color: #999
  }
</style>
# 表单 / Form
表单（Form）用以收集、校验或提交数据，主要由输入框、选择器、单选按钮组、复选框等录入项和操作按钮等构成。
## 基础样式
:::include(src="./doc/base.vue")
:::

> W3C 标准中有如下[规定](https://www.w3.org/MarkUp/html-spec/html-spec_8.html#SEC8.2)：
>
> When there is only one single-line text input field in a form, the user agent should accept Enter in that field as a request to submit the form.
>
>即：当一个 form 元素中只有一个输入框时，在该输入框中按下回车应提交该表单。如果希望阻止这一默认行为，可以在 ```<mtd-form>``` 标签上添加 @submit.native.prevent。

## 类型与用法
### 排列方式 <design-tag></design-tag>
提供两种标签和输入框的排列方式，默认左右排列，如果表单项少，垂直空间充足，可选择上下排列。

左右排列
:::include(src="./doc/position.vue")
:::

上下排列
:::include(src="./doc/position-top.vue")
:::

行内排列
:::include(src="./doc/position-inline.vue")
:::

### 帮助信息
有时只靠字段的措辞和输入框不足以给用户填写答案提供有用的线索，需要一些帮助信息来说明字段的含义和输入框填写注意事项。
<br />
<br />
#### 常显型
适合显示重要信息和用户输入时要随时查看的信息。
:::include(src="./doc/helper.vue")
:::

#### 用户激活型
如果不是十分重要的信息，可以只在用户需要的时候展示，有效减少视觉杂乱。
:::include(src="./doc/hover-helper.vue")
:::

### 校验与报错
为防止用户信息录入出错，应尽早让用户发现并纠正错误，以帮助用户理解问题并了解如何处理。

信息录入时的及时校验。
:::include(src="./doc/validate.vue")
:::

信息录入有时需要和后端进行数据校验，所以在异步校验时有 loading 的过程。
:::include(src="./doc/async-validate.vue")
:::

### 自定义校验规则
自定义校验时必须调用 callback 参数
:::include(src="./doc/custom-validate.vue")
:::

### 校验状态
:::include(src="./doc/validate-status.vue")
:::

### 动态表单
可通过循环的方式生成来动态生成表单项
:::include(src="./doc/dynamic.vue")
:::

<!-- ### HTML 片段提示
使用 v-html 方式展示错误提示
:::include(src="./doc/use-html-message.vue")
::: -->


## API
<api-doc name="Form" :doc="require('./api.json')"></api-doc>

### 校验规则
| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| trigger | 触发条件, 非必填, 可选值: 'blur'、'change'  | string | - |
| enum | 枚举类型 | string | - |
| len | 字段长度 | number | - |
| max | 最大长度 | number | - |
| message | 校验文案 | string | - |
| min | 最小长度 | number | - |
| pattern | 正则表达式校验 | RegExp | - |
| required | 是否必选 | boolean | `false` |
| transform | 校验前转换字段值 | function(value) => transformedValue:any | - |
| type | 内建校验类型，[可选项](https://github.com/yiminghe/async-validator#type) | string | 'string' |
| validator | 自定义校验（**注意 callback 必须被调用**）, 0.3.6 版本开始支持 source 参数，source 为当前表单 modal 属性值 | function(rule, value, callback, source) | - |
| whitespace | 必选时，空格是否会被视为错误 | boolean | `false` |

更多用法可参考 [async-validator](https://github.com/yiminghe/async-validator)。

<api-doc name="FormItem" :doc="require('../form-item/api.json')"></api-doc>
