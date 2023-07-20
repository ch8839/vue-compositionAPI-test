<style lang='scss'>
  .demo-tags-groups{
    .mtd-tag + .mtd-tag{
      margin-left: 80px;
    }
  }
  .demo-tags-compact-groups{
    .mtd-tag + .mtd-tag{
      margin-left: 40px;
    }
  }

  .demo-tags-compact-groups + .demo-tags-compact-groups{
    margin-top: 20px;
  }

</style>
# 标签 / Tag
是小块的信息项，用来通过视觉快速区分选择的内容。

## 基础样式
:::include(src="./doc/base.vue")
:::

## 类型与用法
### 大小 <design-tag></design-tag>
:::include(src="./doc/size.vue")
:::

### 类型 <design-tag></design-tag>
标签类型可表达操作重要程度，示例里按重要程度降序排列。
一般面型标签文案统一为白色；
线性标签中文案、描边保持和标准色一致；
面型+线性标签中文案保持和标准色一致，描边为不透明度10%的标准色；填充色为不透明度6%的标准色。
:::include(src="./doc/type.vue")
:::

### 颜色 <design-tag></design-tag>
可以通过颜色，潜示状态。
:::include(src="./doc/color.vue")
:::

### 可删除
:::include(src="./doc/delete.vue")
:::

### 动态增减标签
提供一种快速打标签的方式。
:::include(src="./doc/dynamics.vue")
:::

## API
<api-doc name="Tag" :doc="require('./api.json')"></api-doc>
