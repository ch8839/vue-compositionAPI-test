 # 时间选择框 / DatePicker
用于选择或输入日期，时间。
<style lang='scss'>
  .demo-picker-group{
    display: inline-block;
    text-align: left;
    +.demo-picker-group{
      margin-left: 60px;
    }
  }
</style>
 ## 基础样式
:::include(src="./doc/base.vue")
:::

## 类型与用法
### 大小 <design-tag></design-tag>
:::include(src="./doc/size.vue")
:::

### 选择日期点
:::include(src="./doc/date.vue")
:::

### 多选
:::include(src="./doc/multiple.vue")
::: 

### 选择日期段
:::include(src="./doc/range.vue")
::: 

### 选择其他颗粒度
可快速具体的选择某一月、年。
:::include(src="./doc/type.vue")
:::

 ### 带快捷选择
可快捷选择定义好的时间点或时间段。
:::include(src="./doc/quick.vue")
:::

### 日期格式
:::include(src="./doc/value-format.vue")
:::
使用 `format` 指定输入框的格式；使用 `value-format` 指定绑定值的格式。

默认情况下，组件接受并返回 `Date` 对象。以下为可用的格式化字串，以 UTC 2017年1月2日 03:04:05 为例：

| 格式 | 含义 | 备注 | 举例 |
|------|------|------|------|------|
| `yyyy` | 年 | | 2017 |
| `M`  | 月 | 不补0 | 1 |
| `MM` | 月 | | 01 |
| `d`  | 日 | 不补0 | 2 |
| `dd` | 日 | | 02 |
| `H`  | 小时 | 24小时制；不补0 | 3 |
| `HH` | 小时 | 24小时制 | 03 |
| `h`  | 小时 | 12小时制，须和 `A` 或 `a` 使用；不补0 | 3 |
| `hh` | 小时 | 12小时制，须和 `A` 或 `a` 使用 | 03 |
| `m`  | 分钟 | 不补0 | 4 |
| `mm` | 分钟 | | 04 |
| `s`  | 秒 | 不补0 | 5 |
| `ss` | 秒 | | 05 |
| `A`  | AM/PM | 仅 `format` 可用，大写 | AM |
| `a`  | am/pm | 仅 `format` 可用，小写 | am |
| `timestamp` | number 类型时间戳, 0.1.44 版本新增 | 仅 `value-format` 可用；| 1483326245000 |
| `W`  | 周 | 仅周选择器的 format 可用，不补0 | 1 |
| `WW` | 周 | 仅周选择器的 format 可用  01 |


### 不可选择日期和时间
:::include(src="./doc/disabled.vue")
:::

## API
<api-doc name="DatePicker" :doc="require('./api.json')"></api-doc>

#### DatePicker options
| 参数 | 说明 | 类型 | 默认值 |
|--- |--- |--- |--- |--- |
| shortcuts | 设置快捷选项，详细查看 **带快捷选择** demo | { type: string, value: Function, onClick: Function } | - |
| disabledDate | 设置不可选择的日期，参数为当前的日期，需要返回 Boolean 是否禁用这天 | boolean | - |
