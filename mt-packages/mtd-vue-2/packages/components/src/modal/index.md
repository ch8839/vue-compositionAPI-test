<style lang='scss'>
  .demo-modal-btn-groups{
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
</style>
# 对话框 / Modal
对话框（Modal）是覆盖在主窗口上的临时窗口，启动系统与用户之间的对话。用于提供有关当前任务流程的关键信息、需要用户做出决策的信息及要求用户录入信息

## 基础样式
:::include(src="./doc/base.vue")
:::
<!-- > 轻量化的确认形式可采用弹出框，请参考 [弹出框/Popover <i class="mtdicon mtdicon-link-o"></i>](/components/popover) -->

## 类型与用法
### 展现位置
根据应用场景的需要，提供 3 种弹出框的展现方式。
:::include(src="./doc/placement.vue")
:::

### 异步关闭
当按钮触发的操作需要和后端进行校验时会出现 loading 状态。
:::include(src="./doc/async-close.vue")
:::

### 内容展示
用对话框承载详情信息或相关功能操作，这里列举一些常见情况。
:::include(src="./doc/custom.vue")
:::

### 非模态对话框
:::include(src="./doc/modeless.vue")
:::

### 可拖拽的 非模态对话框
:::include(src="./doc/modeless-drag.vue")
:::

## API
<api-doc name="Modal" :doc="require('./api.json')"></api-doc>
