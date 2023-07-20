# 进度条 / Progress

向用户传达特定进程的进度，告知用户当前状态和预期。

## 基础样式
:::include(src="./doc/base.vue")
:::

## 类型与用法
### 大小 <design-tag></design-tag>
:::include(src="./doc/size.vue")
:::

### 状态 <design-tag></design-tag>
进度条会根据进程情况出现成功、失败两种状态。
:::include(src="./doc/status.vue")
:::

### 环形进度条
多用于屏幕空间受限区域的进度展示。
:::include(src="./doc/circle.vue")
:::

### 微型饼图进度条
适用于空间局限、且仍需要展示进度的情况，Hover可显示进度。
:::include(src="./doc/pie.vue")
:::

<!-- ### 自定义样式
进度条的颜色、动效等样式支持自定义
:::include(src="./doc/custom.vue")
::: -->


<!-- ### 步骤进度条
适用于分阶段运行、且需要展示此区分的情况。
:::include(src="./doc/step.vue")
::: -->

## API
<api-doc name="Progress" :doc="require('./api.json')"></api-doc>
