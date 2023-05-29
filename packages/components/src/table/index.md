<style>
  .mtd-table .warning {
    background: #fdf5e6;
  }

  .mtd-table .success {
    background: #f0f9eb;
  }

  .demo-table .name-wrapper {
    display: inline-block;
  }

  .demo-table .demo-table-expand {
    label {
      width: 90px;
      color: #99a9bf;
    }
    .mtd-form-item {
      margin-right: 0;
      margin-bottom: 0;
      width: 50%;
    }
  }
</style>

# 表格 / Table
<high-performance-tag></high-performance-tag> 
<br><br>
一个二维数组，各类数据出现在单元格中，从行和列的交集中获取其上下文，使信息易于检索，便于用户查找和比较。<br><br>
该组件为高性能组件，支持纵横向虚拟滚动

 ## 基础样式
:::include(src="./doc/base.vue")
:::

## 类型与用法
### 大小 <design-tag></design-tag>
根据场景选择，在一些小区域内如弹窗和卡片内用小号表格。
`striped`属性可以创建带斑马纹的表格。它接受一个 `Boolean`，默认为 `false`，设置为 `true` 即为启用。
:::include(src="./doc/size.vue")
:::

### 样式 <design-tag></design-tag>
一般用基础样式，为加强行阅读引导，可用斑马行样式；为突出纵列数据对比，可显示列分割线。
:::include(src="./doc/striped.vue")
:::

### 带状态表格
可将表格内容高亮显示，方便区分「成功、信息、警告、危险」等内容。
可以通过指定 Table 组件的 `row-class` 属性来为 Table 中的某一行添加 class，表明该行处于某种状态。
:::include(src="./doc/stated.vue")
:::

### 表头固定、列固定
一屏内展示大量数据，需要下滚时仍能看到表头标题，可固定表头。对于列数很多的表格，有些列需要在横向滚动时常显，可固定列。
只要在`mtd-table`元素中定义了`height`属性，即可实现固定表头的表格，而不需要额外的代码。
:::include(src="./doc/fixed.vue")
:::

### 多级表头
多级表头用来展现数据列标题的层次关系。
只需要在 mtd-table-column 里面嵌套 mtd-table-column，就可以实现多级表头。
:::include(src="./doc/cascade.vue")
:::

### 多选
选择多行数据时使用 复选框 / Checkbox。
实现多选非常简单: 手动添加一个`mtd-table-column`，设`type`属性为`selection`即可。
:::include(src="./doc/selection.vue")
:::

### 保留选中状态
默认情况下当 `data` 属性变化时选中状态会被清空，可以使用 `reserve-selection` 属性来取消这一默认行为。
:::include(src="./doc/reserve-selection.vue")
:::

### 自定义选择项
通过在 TableColumn[type='selection'] 的列中使用 $scopedSlots.selection 来实现自定义，详细请参数查看下方 [API 说明](http://mtdui.sankuai.com/mtd/vue/components/table#table-column-scoped-slot)
:::include(src="./doc/custom-selection.vue")
:::

### 排序
可排序的栏会配有上下箭头标识，对表格进行排序。
在列中设置`sortable`属性即可实现以该列为基准的排序，接受一个`Boolean`，默认为`false`。可以通过 Table 的`sort-order`属性设置默认的排序列和排序顺序。可以使用`sort-method`或者`sort-by`使用自定义的排序规则。如果需要后端排序，需将`sortable`设置为`custom`，同时在 Table 上监听`sort-change`事件，在事件回调中可以获取当前排序的字段名和排序顺序，从而向接口请求排序后的表格数据。
:::include(src="./doc/sortable.vue")
:::

### 自定义列模板
自定义列的显示内容，可组合其他组件使用。
通过 `scoped slot` 可以获取到 row, column, $index 和 store（table 内部的状态管理）的数据，用法参考 demo。
:::include(src="./doc/custom.vue")
:::

### 自定义表头
:::include(src="./doc/header.vue")
:::

### 表内折叠行
如果表格项内容过多，或包含更多详细信息，想采取一种比较轻的形式在页面内展示，可用折叠行的方式。展开行可设置为可同时展开多个和一次只能展开一个。
:::include(src="./doc/expand.vue")
:::


### 合并行或列
多行或多列共用一个数据时，可以合并行或列。
通过给`table`传入`span-method`方法可以实现合并行或列，方法的参数是一个对象，里面包含当前行`row`、当前列`column`、当前行号`rowIndex`、当前列号`columnIndex`四个属性。该函数可以返回一个包含两个元素的数组，第一个元素代表`rowspan`，第二个元素代表`colspan`。 也可以返回一个键名为`rowspan`和`colspan`的对象。
:::include(src="./doc/combo.vue")
:::

### 超长显示文字提示
表格单元格内内容过长时省略，鼠标 hover 时显示 tooltip。
:::include(src="./doc/overflow-tooltip.vue")
:::

### 表格分页
表格条数过多时，配合分页来更好地浏览数据。
:::include(src="./doc/pagination.vue")
:::

### 表尾合计
对于单元格里是数字的表格可能需要在表尾显示合计
:::include(src="./doc/summary.vue")
::: 

### 筛选
:::include(src="./doc/filterable.vue")
:::

### 自定义筛选菜单
通过设置 type="expand" 和 `scoped slot` 可以开启展开行功能，`mtd-table-column` 的模板会被渲染成为展开行的内容，展开行可访问的属性与使用自定义列模板时的 `scoped slot` 相同。
:::include(src="./doc/custom-filter.vue")
:::

### 可伸缩列
设置 mtd-table-column resizable 属性为 true，0.3.9 版本前需要将 mtd-table bordered 属性设置为 true
:::include(src="./doc/resizable.vue")
:::

### 高亮当前行
:::include(src="./doc/current-row-key.vue")
:::

### 树形表格
必须配置 `row-key` 属性来保证树形结构的正常展开
:::include(src="./doc/tree.vue")
:::

### 异步加载树型表格
:::include(src="./doc/tree-load.vue")
:::

### 横向虚拟滚动
使用的时候一定要给 column 配置 width 和 key
:::include(src="./doc/horizontal-virtual-scroll.vue")
:::

### 竖向虚拟滚动
:::include(src="./doc/vertical-virtual-scrolling.vue")
:::


## API
<api-doc name="Table" :doc="require('./api.json')"></api-doc>
<api-doc name="TableColumn" :doc="require('../table-column/api.json')"></api-doc>
