<style>
  .demo-box {
    display: inline-block;
    width: 400px;
    text-align: left;
  }
</style>
# 滑块 / Slider
用于在一个数值区间内进行数值选择，并展示当前值。

## 基础样式
:::include(src="./doc/base.vue")
:::

## 类型与用法
### 大小 <design-tag></design-tag>
:::include(src="./doc/size.vue")
:::
### 状态 <design-tag></design-tag>
:::include(src="./doc/status.vue")
:::

### 离散型
可自定义拖动间隔，方便快速选择预定值。
:::include(src="./doc/discrete.vue")
:::

### 阈值滑块
当滑块位置超过特定数值时，改变颜色进行提示，方便区分区域状态。
:::include(src="./doc/thresholds.vue")
:::

### 范围滑块
:::include(src="./doc/range.vue")
:::

<!-- ### 具有初始值的滑块
初始位置可自定义，用来定义最小值起点。
:::include(src="./doc/fixedValue.vue")
::: -->

### 垂直滑块
:::include(src="./doc/vertical.vue")
:::

<!-- ### 带标签的滑块
:::include(src="./doc/marks.vue")
::: -->

### 轨道颜色伸展
滑块的轨道可以无填充、也可以将渐变添加到任何滑块的轨道，以赋予值范围更多意义
:::include(src="./doc/no-shade.vue")
:::

## API
<api-doc name="Slider" :doc="require('./api.json')"></api-doc>
