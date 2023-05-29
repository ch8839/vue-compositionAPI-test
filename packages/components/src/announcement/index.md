<style lang='scss'>
.demo-announcement {
  .mtd-announcement:first-child {
    margin: 0;
  }
  .mtd-announcement + .mtd-announcement{
    margin-top: 20px;
  }
  .your-web {
    border: 1px solid #eaeaea;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
  }

  .your-web .mtd-announcement {
    border-radius: 0;
  }

  .your-content {
    height: 200px;
    background: #F7F8FC;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
  }

  .his-web {
    display: flex;
  }
  .his-sidebar {
    height: 200px;
    width: 200px;
    background: #F0F2FD;
  }
  .his-content {
    flex: 1;
    border-bottom-left-radius: 6px;
  }
}
</style>

# 公告 / Announcement
用于展示系统的重要信息，在页面顶部贯穿静态显示，不会自动消失，用户可点击自行关闭。

## 基本样式
:::include(src="./doc/base.vue")
:::

## 类型与用法
### 倾向
:::include(src="./doc/type.vue")
:::

### 消失方式

信息较重要，需要常显，没有关闭按钮。
:::include(src="./doc/no-close.vue")
:::

用户可选择手动关闭。
:::include(src="./doc/close.vue")
:::

### 内容展示

带辅助信息。
:::include(src="./doc/assist.vue")
:::

带按钮或链接。
:::include(src="./doc/button-or-link.vue")
:::

### 展示位置

全局公告展示在页面顶部。
:::include(src="./doc/global-top.vue")
:::

局部公告展示在相应的内容区域顶部。
:::include(src="./doc/local-top.vue")
:::

## API
<api-doc name="Announcement" :doc="require('./api.json')"></api-doc>
