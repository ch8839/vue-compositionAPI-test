# 更新日志

## 1.2.3
`2023`

#### Feature
- <b>Select</b> 新增作用域插槽 option ，用于配置 options 属性的时候也能自定义option内容
- <b>Select</b> 新增插槽 noMatched ，用于配置搜索无匹配时候的内容
- <b>Select</b> 新增prop virtualOption ，用于配置虚拟滚动的时候所基于每个项的高度是多少，决定计算每一次展示多少行数据

#### Bugfix
- <b>Icon</b> 自带mtdicon前缀的配置没有覆盖玩完全 
- <b>Picker| Select</b> 插槽为空的时候无法及时响应更新
- <b>Picker| Select</b> 局部引入的时候报错 “mtd-virtual” 未注册
- <b>Select</b> 非虚拟滚动状态下窗口抖动问题
- <b>Table</b> 异步更新数据从无到有，会导致empty状态无法关闭
- <b>Select</b> empty 插槽失效
- <b style="color: red"> 重要更新： </b> 修复所有弹窗类组件(modal、message等) ESC 无法关闭的问题

## 1.2.2
`2023-5-9`

#### Feature
- <b style="color: red"> 重要更新： </b> Icon 组件兼容 @ss/mtd-vue @ss/mtd-vue-next（旧组件库们）的用法
- <b style="color: red"> 重要更新： </b> 新增 config 全局方法，全局配置 组件的class prefix
- <b>Tooltip</b> 新增dangerouslyUseHTMLString属性,content支持html文本
- <b>Form</b> labelPosition 支持 left 配置项

#### Bugfix
- <b>Menu</b> accordion 在三级菜单中会异常
- <b>Menu</b> 修复只有第一级别菜单才可以使用icon的问题
- <b>DatePicker</b> 修复时间戳位数不正确的问题（dayjs.unix ---> valueOf）
- <b>DatePicker</b> pick-range 事件参数不正确
- <b>DatePicker</b> 周、半年、季度 无法使用 value-format
- <b>DatePicker</b> confirm/clear 事件没有暴露
- <b>Tree</b> getCheckNodes 方法失效
- <b>Table</b> fixed列无法进行筛选
- <b>Table</b> empty 和 loading 插槽失效
- <b>Table</b> bordered 条件下表尾合计失效
- <b>Table</b> 固定列样式背景色存在透明
- <b>Table</b> 表格固定高度的时候empty插槽丢失
- <b>Tooltip</b> content 插槽失效
- <b>Select</b> 多选的时候键盘事件失效
- <b>Select</b> loading 插槽失效
- <b>Select</b> ⚠️多选选择框在远程筛选后会清除未匹配的选项selected
- <b>Select</b> 多选功能下失焦操作会导致placeholder丢失
- <b>Select</b> 多选选择框在远程筛选后如果不匹配新的数据源，会无法显示
- <b>Select</b> 配置 options 的情况下无法展示loading页
- <b>Pagination</b> 分页器页数太多卡顿问题
- <b>Button</b> 无法新开标签页面跳转外链
- <b>Textarea</b> change二次触发 + 拼音过程也会触发change
- <b>Slider</b> 离散型的分割点样式丢失


## 1.2.1
`2023-4-7`

#### Bugfix
- <b style="color: red"> 重要更新： </b> 修复SCSS Warning 问题
- <b>TextArea</b> v-model 失效
- <b>DatePicker</b>面板上方的 年 月 滚轮选择器 append-to-container 失效

## 1.2.0
`2023-4-6`
#### Breaking Changes
- <b style="color: red"> 重要更新： </b>  此版本的所有源码都进行了 Vue2.x + 3.x 双版本的兼容适配化，目录结构和语法均有变更，更改了构建。（组件逻辑没有改变）
- <b>Form | FormItem</b> DOM结构发生变化，跟原来@ss/mtd-vue 旧组件库保持一致
- <b>Select、Cascader 等一系列应用到下拉菜单的组件 </b> 支持 class 和 style 的透传

#### Feature
- <b>Form</b> 支持 disabled 属性
- <b>Form | FormItem</b> 支持 contentDisplay 属性，用于配置item项的display样式，建议使用flex 或 block
- <b>Slider</b> 新增 事件 input，能够实时获取slider的值 [TT](https://tt.sankuai.com/ticket/detail?id=75413597)

#### Bugfix
- <b>Table</b> 虚拟滚动下固定列也会被隐藏
- <b>Table</b> 合并表头固定列计算宽计算异常效问题
- <b>Table</b> sord-change事件返回的是数组而不是对象
- <b>Table</b> 多级表头情况下，排序图标的 z-index 高于固定列
- <b>Table</b> 表格容器被固定在了300px高度且无法滚动
- <b>Cascader | Select</b> 多选的时候样式错误问题  [TT](https://tt.sankuai.com/ticket/detail?id=75131179)
- <b>Cascader</b> 事件 update:visible 不生效
- <b>Cascader</b> 设置visible 为 true 时点击选项不高亮
- <b>IconButton</b> size 属性不生效
- <b>Input | TextArea</b> maxLength属性不生效  [TT](https://tt.sankuai.com/ticket/detail?id=75413928)
- <b>Modal | Confirm</b> getPopupContainer 属性不生效
- <b>Upload</b> disabled 属性不生效
- <b>Upload</b> 文件大小显示不正确，单位计量错误
- <b>Form</b> 在mounted声明周期中中初始化rule，required 样式不生效
- <b>Textarea</b> placeholder 属性不生效





## 1.1.1
`2023-3-15`
#### Feature
- 组件 Cascader 新增插槽 addendum-header 和 addendum-footer


## 1.1.0
`2023-2-13`
#### Feature
- 增加 美团黄主题 theme-yellow

#### Breaking Change
- 1.1.0 之前引入源码主题的代码 '@ss/mtd-vue2/src/themes/index.scss' 中 "themes" 应该改成主题名称（theme-chalk/theme-yellow）

