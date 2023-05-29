<style lang='scss'>
  .demo-tree{
    .mtd-tree{
      background: #FFFFFF;
      box-shadow: 0 4px 12px 0 rgba(0,0,0,0.10);
      border-radius: 6px;
      padding: 4px;
    }
  }
</style>
# 树 / Tree
<high-performance-tag></high-performance-tag><br><br>
单列内，多层级的数据可视化展示，结构包括根节点、节点、叶子等层级。<br><br>
该组件为高性能组件，支持虚拟滚动


## 基础样式
:::include(src="./doc/base.vue")
:::

## 类型与用法
### 交互方式
如项目中包含点击、编辑、删除等操作时，需点击节点三角展开子项。如无任何操作可点击整行展开子项。
:::include(src="./doc/click-node.vue")
:::
> 在展示多层级结构的同时，允许对特定项目进行点击，触发导航到相应项目详细信息页面。更多导航请参考 导航/Nagination

### 带操作型
:::include(src="./doc/custom.vue")
:::

### 异步加载
:::include(src="./doc/lazy.vue")
:::

### 树节点的选择
设置 `checked-strategy` 属性来获取选中时的数据
:::include(src="./doc/checked-strategy.vue")
:::

### 可拖拽
设置 draggable 属性来获取选中时的数据
:::include(src="./doc/draggable.vue")
:::

### 可搜索
通过更改数据源实现节点过滤
:::include(src="./doc/search.vue")
:::

### 节点过滤
通过 `filter-node-method` 实现节点过滤
:::include(src="./doc/filter-method.vue")
:::

### 虚拟滚动
:::include(src="./doc/virtual.vue")
:::

## API
<api-doc name="Tree" :doc="require('./api.json')"></api-doc>

### data 字段说明
字段名可由 Tree.props 属性进行更改
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|--- |--- |--- |--- |--- |
| title | 标题 | string | - | - |
| children | 子节点 | data[] | - | - |
| icon | 设置额外的 icon 内容 | - | 默认继承 Tree.icon |
| isLeaf | 是否是叶子节点，配合 loadData 使用，默认是 false | boolean | - | false |
| id | 默认使用 id 作为节点的 key，可以使用 Tree.nodeKey 属性修改 | string | - | - |
| disabled | 节点是否禁用，此时仍可以展开节点 | boolean | - | - |
| disableCheckbox | 节点是否禁止选中 | boolean | - | - |
| checkable | 是否向当前节点前添加 Checkbox 复选框 | boolean | - | - |

### node 字段说明
**只读**，由父级传递下来的节点状态信息，相关字段名不受 Tree.props 属性影响
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|--- |--- |--- |--- |--- |
| $parent | 父节点，如果是根节点则为空 | node | - | - |
| children | 子节点数组，如果没有则为空 | node[] | - | - |
| disabled | 节点是否禁用 | boolean | - | - |
| disableCheckbox | 节点是否禁止选中 | boolean | - | - |
| checked | 当前节点是否勾选 | boolean | - | - |
| expanded | 当前节点是否展开 | boolean | - | - |
| selected | 当前节点是否选中 | boolean | - | - |
| checkable | 是否向当前节点前添加 Checkbox 复选框 | boolean | - | 默认继承 Tree.checkable |
| selectable | 设置节点是否可被选中	| boolean | - | - |
| indeterminate | 当前节点是否半选 | boolean | - | - |
| level | 当前节点的层级，从 0 开始算 | number | - | 0 |
| isLeaf | 当前节点是否是叶子节点 | boolean | - | false |
| data | 当前节点数据 | data | - | - |
