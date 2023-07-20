# 走马灯 / Carousel
在一定区域内，显示多个平级的图片或卡片，提升用户在有限空间里的阅读内容。

## 何时使用
轮播内容的数量最好在三到六个之间，数量太少没有意义，太多会让网页加载速度变慢。

## 基础样式
基本使用，通过 配置props。
:::include(src="./doc/base.vue")
:::

## 类型与用法
指示器的配置
:::include(src="./doc/indecator.vue")
:::

### 卡片型走马灯
:::include(src="./doc/type-card.vue")
:::

### 渐变型走马灯
:::include(src="./doc/type-fade.vue")
:::

### 垂直型走马灯
:::include(src="./doc/type-horizontal.vue")
:::

### speed控制动画速度
基本使用，通过 配置props。
:::include(src="./doc/speed.vue")
:::

### interval控制当前页停留时长
基本使用，通过 配置props。
:::include(src="./doc/interval.vue")
:::

### loop参数控制是否可以循环轮播
基本使用，通过 配置props。
:::include(src="./doc/loop.vue")
:::

### arrow参数控制箭头出现时机
基本使用，通过 配置props。
:::include(src="./doc/arrow.vue")
:::

## API
<api-doc name="Carousel" :doc="require('./api.json')"></api-doc>
