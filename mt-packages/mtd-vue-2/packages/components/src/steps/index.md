# 步骤条 / Steps
是引导用户按照流程完成任务的分步导航条，可根据实际应用场景设定步骤，步骤不得少于 2 步。

## 基础样式
:::include(src="./doc/base.vue")
:::

## 类型与用法
### 大小 <design-tag></design-tag>
:::include(src="./doc/size.vue")
:::

### 含状态步骤条
:::include(src="./doc/status.vue")
:::

### 有描述的步骤条
每个步骤有其对应的步骤状态描述。
:::include(src="./doc/desc.vue")
:::

### 可控制描述文案位置的步骤条
:::include(src="./doc/position.vue")
:::

### 自定义步骤条的间距
通过space自定义步骤条的间距。只有固定宽的情况下才会换行。横向步骤条的min-width为150px，设置小于150的space可能将导致不生效（纵向则是min-height为50px）
:::include(src="./doc/space.vue")
:::

### 点状步骤条

该步骤条更多展示任务完成流程，任务状态表达较为隐晦，多适用于步骤数过多展示。
:::include(src="./doc/doc-scope.vue")
:::

### 带图标的步骤条

步骤条内可以启用各种自定义的图标，通过 icon 属性来设置图标，图标的类型可以参考 icon 组件的文档。
:::include(src="./doc/picture.vue")
:::

### 纵向步骤条
多适用于任务条数较多，状态流程较长，同时描述的信息较多等场景展示。
:::include(src="./doc/length-wise-direction.vue")
:::

## API
<api-doc name="Steps" :doc="require('./api.json')"></api-doc>
<api-doc name="Step" :doc="require('./../step/api.json')"></api-doc>
