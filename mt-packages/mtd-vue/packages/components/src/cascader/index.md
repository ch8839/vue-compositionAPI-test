# 级联 / Cascader
将数据集合，进行分类展示和选择，建议最多展示4级菜单。

## 基本样式
:::include(src="./doc/base.vue")
:::

## 类型与用法
### 可选父节点或子节点
:::include(src="./doc/changeOnSelect.vue")
:::

### 交互方式
当层级、分类较多，选用“悬停展示下级菜单”，快速预览菜单内容。
:::include(src="./doc/expand.vue")
:::

### 状态
下拉面板可根据场景配置 disable 状态。
在数据源中配置 `disabled` 为 `true` 来禁用选项。可以通过 `props` 属性来指定(详见 API)
:::include(src="./doc/status.vue")
:::

### 信息回显
回显选中路径，可明确提示和告知用户选中信息的分类来源。
`formatter` 仅支持返回 `string`
:::include(src="./doc/formatter.vue")
:::

### 动态加载
由于计算属性在调用 $set 时并不会触发 watch，所以动态加载时并不支持 data 属性值为计算属性。
:::include(src="./doc/load.vue")
::: 

### 搜索
异步搜索通过直接修改数据源 `data` 属性来实现，搜索过程中将 `loading` 属性设置成 `true`，同时由于 `value` 的值不一定在数据源中，所以需要配合 `formatter` 属性来自定义输入框的展示值
:::include(src="./doc/search.vue")
:::

### 自定义节点内容
:::include(src="./doc/custom.vue")
::: 

### 多选
:::include(src="./doc/multiple.vue")
:::

### 附加信息
:::include(src="./doc/addendum.vue")
:::

## API
<api-doc name="Cascader" :doc="require('./api.json')"></api-doc>

### data 字段说明
字段名可由 Cascader.props 属性进行更改
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|--- |--- |--- |--- |--- |
| label | 标题 | string | - | - |
| value | 值 | any | - | - |
| children | 子节点 | data[] | - | - |
| isLeaf | 是否是叶子节点，配合 loadData 使用 | boolean | - | false |
| loading | 是否是加载中 | boolean | - | false |
| disabled | 是否禁用， 禁用后将无法展开 | boolean | - | false |

### node 字段说明
**只读**，由父级传递下来的节点状态信息，相关字段名不受 Tree.props 属性影响
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|--- |--- |--- |--- |--- |
| $parent | 父节点，如果是根节点则为空 | node | - | - |
| checked | 当前节点是否勾选 | boolean | - | - |
| children | 子节点数组，如果没有则为空 | node[] | - | - |
| data | 当前节点数据 | data | - | - |
| disabled | 节点是否禁用 | boolean | - | - |
| hasChildren | 是否有子节点 | boolean | - |- |
| hasChildrenChecked | 是否有子节点被选中 | boolean | - | - |
| indeterminate | 是否是半选状态 | boolean | - | - |
| isLeaf | 当前节点是否是叶子节点 | boolean | - | false |
| label | 标题 | string | - | - |
| level | 当前节点的层级，从 0 开始算 | number | - | 0 |
| loading | 是否是加载中的状态	| boolean | - | - |
| selected | 当前节点是否选中 | boolean | - | - |
| value | 当前节点的值 | boolean | - | - |

