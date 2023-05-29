# 上传 / Upload
通过选择和拖拽方式,将文件上传至服务端。

## 基础样式
通过 slot 你可以传入自定义的上传按钮类型和文字提示。可通过设置`before-remove`来阻止文件移除操作。
:::include(src="./doc/base.vue")
:::

## 类型与用法
### 类型
通过 slot 你可以传入自定义的上传按钮类型和文字提示。可通过设置`before-remove`来阻止文件移除操作。
:::include(src="./doc/type.vue")
:::

### 单一上传方式
历史上传的文件，会被最近一次上传的文件进行更替。
:::include(src="./doc/only-base.vue")
:::

### 用户头像上传
点击上传图像，图片回显，最近一次上传的图片将会替换历史图片。
:::include(src="./doc/only-img.vue")
:::

### 照片墙
使用 `list-type` 属性来设置文件列表的样式。
:::include(src="./doc/picture-list.vue")
:::

### 拖拽上传
把文件拖入指定区域，完成上传，同样支持点击上传。
:::include(src="./doc/drag.vue")
:::

### 手动上传
选择文件，通过手动触发上传按钮上传文件，适合批量上传文件。
:::include(src="./doc/hand.vue")
:::

### 文件展示
:::include(src="../file/doc/base.vue")
:::

## API
<api-doc name="Upload" :doc="require('./api.json')"></api-doc>
<api-doc name="File" :doc="require('../file/api.json')"></api-doc>
### File 字段说明
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|--- |--- |--- |--- |--- |
| url | 文件路径 | string | - | - |
| name | 文件名称 | string | - | - |
| size | 文件大小 | number | - | - |
| uid | 当前节点数据 | number | - | - |
| percentage | 文件上传进度 | number | - | - |
| status | 文件上传状态 | string | ready / uploading / success / fail |- |
| raw | 提供有关文件的信息，并允许web页面中的JavaScript访问其内容 | File | - | - |
| user | 用户 | string | - | - |
| time | 时间 | string | - | - |
| statusMsg | fail显示信息 | string | - | - |
