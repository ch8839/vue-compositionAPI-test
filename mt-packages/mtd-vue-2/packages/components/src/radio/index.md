<style lang="scss">
  .demo-radio-box {
    display: flex;
    justify-content: space-around;
  }
  .mtd-radio-group {
    line-height: auto;
  }
  .demo-mtd-radio-only-text .mtd-radio-group {
    margin-right: 20px;
    vertical-align: baseline;
  }
  .demo-mtd-radio-only-text .mtd-radio {
    vertical-align: baseline;
    margin-right: 10px;
  }
  .demo-mtd-radio-only-text .mtd-radio-checked,
  .demo-mtd-radio-only-text .mtd-radio:hover {
    color: #4477F0;
  }
  .demo-tags {
    display: inline-block;
    vertical-align: middle;
  }
  .demo-mtd-radio-card {
    display: inline-block;
    margin: 0 25px;
    padding: 12px 16px;
    border: 1px solid #D3D8E4;
    border-radius: 4px;
    cursor:pointer;
  }
  .demo-mtd-radio-card i {
    color: #B5BBD1;
  }
  .demo-mtd-radio-card-title {
    color: #464646;
  }
  .demo-mtd-radio-card-desc {
    color: #ADADAD;
    font-size: 12px;
  }
  .demo-mtd-radio-only-text .mtd-radio,
  .demo-mtd-radio-only-text .mtd-radio:hover,
  .demo-mtd-radio-card,
  .demo-mtd-radio-card i,
  .demo-mtd-radio-card .demo-mtd-radio-card-title,
  .demo-mtd-radio-card:hover,
  .demo-mtd-radio-card:hover i,
  .demo-mtd-radio-card:hover .demo-mtd-radio-card-title {
    transition: all .3s ease-in-out;
  }
</style>

# 单选框 / Radio

用于在多个互斥的选项中选择一项，成组出现。

## 基础样式

:::include(src="./doc/base.vue")
:::

<!-- > 若选项过多，（超过8个）推荐用 [选择器/Select <i class="mtdicon mtdicon-link-o"></i>](/components/select) -->

## 类型与用法

### 大小 <design-tag></design-tag>
:::include(src="./doc/size1.vue")
:::

### 选项卡的形式和大小 <design-tag></design-tag>

在类目少、名称短时，需要突出信息时使用。 图标选择卡形式应用对图标的识别性要求较高，优先使用文字单选按钮。

:::include(src="./doc/size2.vue")
:::

### 状态 <design-tag></design-tag>

以常规单选按钮组为例，单选按钮状态有正常状态、hover 状态、激活状态、未选中禁用状态、已选中禁用状态。
:::include(src="./doc/status.vue")
:::

<!-- ### 选项卡形式

在类目少、名称短时，需要突出信息时使用。
:::include(src="./doc/change-card.vue")
::: -->

<!-- > 选项卡形式可用作标签页切换，请参考 [标签页/Tabs <i class="mtdicon mtdicon-link-o"></i>](/components/tabs) -->

<!-- ### 单文字

多用于商品展示页品类的筛选。

:::include(src="./doc/text.vue")
::: -->

## API

<api-doc name="Radio" :doc="require('./api.json')"></api-doc>
<api-doc name="RadioButton" :doc="require('../radio-button/api.json')"></api-doc>
<api-doc name="RadioGroup" :doc="require('../radio-group/api.json')"></api-doc>
