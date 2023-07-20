<script>
export default {
  data () {
    return {
      value1: [],
    };
  },
};

</script>
# 常见下拉框配置说明
mtd-vue 默认情况下会使用以下配置
```
popperOptions = {
  computeStyle: {
    gpuAcceleration: false,
  },
  preventOverflow: {
    boundariesElement: 'window',
    priority: ['left', 'right', 'bottom'],
  },
  hide: {
    enabled: false,
  },
}
```
来构造下拉框，从 0.3.2 版本开始可以使用 `popper-options` 属性来添加自己的配置，我们会将配置进行合并，其详细配置信息可参考 [popper modifiers](https://popper.js.org/docs/v1/#modifiers)。为方便用户使用，我们归纳出几种常见的场景配置:

**注：你可以通过改变浏览器窗口大小，滚动等方式来体验不同配置的区别**
<!-- **注：为了更直观的展示出各配置的不同，我们将示例中的边界区域判断元素改为 scrollParent 块。请使用时删除 `boundariesElement` 配置** -->

## 默认行为
:::demo
```html
<template>
<div id="demo-default">
  <mtd-date-picker type="datetimerange"
    v-model="value1"
    placeholder="选择时间"
    :popper-options="{
    }"
  />
</div>
<template>
```
:::

## 禁用自适应
禁用后下拉出现的位置将始终与 `placement` 属性配置保持一致

*注: 有可能会撑大容器元素*
:::demo
```html
<template>
<div id="demo-flip-disabled">
  <mtd-date-picker type="datetimerange"
    v-model="value1"
    placeholder="选择时间"
    :popper-options="{
      flip: { enabled: false },
    }"
  />
</div>
<template>
```
:::

## 允许分离
默认情况下下拉与输入框是紧挨着的，这种行为要求容器有足够的空间用于展示，当空间小时，可能会出现下拉框内容展示不全的情况。此时我们推荐使用此配置来解决由于空间不足而导致的下拉框展示内容不全问题。
:::demo
```html
<template>
<div id="demo-together-disabled">
  <mtd-date-picker type="datetimerange"
    v-model="value1"
    placeholder="选择时间"
    :append-to-container="false"
    :popper-options="{
      preventOverflow: {
        priority: ['left', 'right', 'bottom', 'top'],
      },
      keepTogether: { enabled: false },
    }"
  />
</div>
<template>
```
:::

<div style="height: 500px;">
<!-- 仅为了撑高页面 -->
</div>
