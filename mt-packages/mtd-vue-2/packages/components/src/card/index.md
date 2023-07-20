# 卡片 / Card
卡片是用于围绕单个主题相关信息组成的容器

## 基础样式

卡片可以含标题、内容和操作。
:::include(src="./doc/base.vue")
:::

## 类型与用法

### 阴影 <design-tag></design-tag>
卡片的应用可以有多种形式，可根据需要进行配置。
:::include(src="./doc/shadow.vue")
:::

### 载入方式 <design-tag></design-tag>
卡片内数据读入前加载时，需要想用户提供反馈
常规加载
:::include(src="./doc/loading.vue")
:::
预加载文本样式，预告用户卡片信息分布样式。
:::include(src="./doc/pre-loading.vue")
:::

### 简单卡片
卡片可以只包含文本的内容部分
:::include(src="./doc/easy.vue")
:::


### 带图片的卡片
卡片内容可以配置带图片的内容。
:::include(src="./doc/picture.vue")
:::

### 带交互的卡片
UI 控件可以包含在卡中以允许用户与卡的内容交互。
:::include(src="./doc/interaction.vue")
:::

### 列表卡
列表卡以列表格式显示一组项目或链接
:::include(src="./doc/list.vue")
:::

## API
<api-doc name="Card" :doc="require('./api.json')"></api-doc>
