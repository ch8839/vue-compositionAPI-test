# 数字输入框 / InputNumber
又称步进器，用于输入标准的数字值，可定义范围

## 基础样式
:::include(src="./doc/base.vue")
:::

## 类型与用法
### 大小 <mtd-tag type='unbordered' size='small' theme="gray">属性</mtd-tag>
:::include(src="./doc/size.vue")
:::

### 类型
:::include(src="./doc/type.vue")
:::

### 状态
:::include(src="./doc/status.vue")
:::

### 数字对齐
:::include(src="./doc/text-align.vue")
:::

### 更多样式
某些业务下数字输入框需要进行步数增减、精度、和单位的控制
:::include(src="./doc/more.vue")
:::

## API
<api-doc name="InputNumber" :doc="require('./api.json')"></api-doc>