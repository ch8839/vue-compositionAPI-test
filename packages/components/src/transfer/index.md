# 穿梭框 / Transfer
## 基础样式
:::include(src="./doc/base.vue")
:::

## 类型与用法
### 带搜索框
:::include(src="./doc/filter.vue")
:::

### 自定义行内容
:::include(src="./doc/render.vue")
:::

### 带默认勾选值
如果需要默认勾选部分值，可以通过向组件传递sourceDefaultChecked或targetDefaultChecked来指定需要默认勾选的左/右侧的选项，
其中的为包含key的数组
:::include(src="./doc/default.vue")
:::

### panel底部插槽
:::include(src="./doc/footer.vue")
:::

### 自定义属性名
通过props参数传递自定义的属性名，props包含key, label, disabled三个参数。
:::include(src="./doc/props.vue")
:::

### 事件处理
当用户点击穿梭按钮时，会触发change事件，change事件的参数分别为：targetKeys, direction, movedKeys。
targetKeys是最终的结果值，为一个数组；direction是转移的方向，值为source或target; movedKeys为当前变化的值，为一个数组。
:::include(src="./doc/events.vue")
:::

### 带分页穿梭框
:::include(src="./doc/pagination.vue")
:::

### 表格穿梭框
使用 Table 组件作为自定义渲染列表
:::include(src="./doc/table.vue")
:::

### 树穿梭框
使用 Tree 组件作为自定义渲染列表
:::include(src="./doc/tree.vue")
:::

## API
<api-doc name="Transfer" :doc="require('./api.json')"></api-doc>

### Render Props
Transfer 支持接收 children 自定义渲染列表，并返回以下参数：

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|--- |--- |--- |--- |--- |
| filteredData | 过滤后的数据，transfer源数据 | array | - | - |
| direction | 渲染列表的方向	 | 'left'，'right' | - | - |
| selectedKeys | 选中的条目 | string[] | - | - |
| onItemSelect | 勾选条目/勾选一组条目 | (keys: string/string[], selected: boolean) | - | - |


