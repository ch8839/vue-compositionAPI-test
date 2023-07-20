<template>
  <div class="center-h">
    <mtd-button @click="openSuccMsg" type="success" ghost>成功</mtd-button>
    <mtd-button @click="openWarnMsg" type="warning" ghost>警告</mtd-button>
    <mtd-button @click="openInfoMsg" ghost>消息</mtd-button>
    <mtd-button @click="openErrMsg" type="danger" ghost>错误</mtd-button>

    <br><br>

    <mtd-button @click="openSuccColorfulMsg" type="success">成功</mtd-button>
    <mtd-button @click="openWarnColorfulMsg" type="warning">警告</mtd-button>
    <mtd-button @click="openInfoColorfulMsg" type="panel">消息</mtd-button>
    <mtd-button @click="openErrColorfulMsg" type="danger">错误</mtd-button>

    <br><br>

    <mtd-button @click="openLoading">加载</mtd-button>
    <mtd-button @click="openLink">链接</mtd-button>
    <mtd-button @click="openButton">按钮</mtd-button>
    <!-- <mtd-button @click="openProgress" >进度</mtd-button> -->
  </div>
</template>
<script>
export default {
  methods: {
    openSuccMsg () {
      this.$mtd.message({
        message: '这是一条成功消息',
        type: 'success',
      })
    },

    openWarnMsg () {
      this.$mtd.message({
        message: '这是一条警告消息',
        type: 'warning',
      })
    },

    openInfoMsg () {
      this.$mtd.message({
        message: '这是一条常规消息',
        type: 'info',
      })
    },

    openErrMsg () {
      this.$mtd.message.error('这是一条错误消息')
    },

    openSuccColorfulMsg () {
      this.$mtd.message({
        message: '这是一条成功消息',
        type: 'success',
        colorful: true,
      })
    },

    openWarnColorfulMsg () {
      this.$mtd.message({
        message: '这是一条警告消息',
        type: 'warning',
        colorful: true,
      })
    },

    openInfoColorfulMsg () {
      this.$mtd.message({
        message: '这是一条常规消息',
        type: 'info',
        colorful: true,
      })
    },

    openErrColorfulMsg () {
      this.$mtd.message({
        message: '这是一条错误消息',
        type: 'error',
        colorful: true,
      })
    },

    openLoading () {
      this.$mtd.message({
        message: '这是一条正在加载的消息',
        type: 'loading',
        duration: 0,
      })
    },

    openLink () {
      const h = this.$createElement
      this.$mtd.message({
        message: h('span', null, [
          h('span', null, '无权限，点击'),
          h('a', {class: 'underline'}, '申请权限'),
        ]),
        type: 'info',
        duration: 0,
      })
    },

    openButton () {
      const h = this.$createElement
      this.$mtd.message({
        message: h('div', { class:'my-center' }, [
          h('span', null, '内容已更新'),
          h('mtd-button', {
            style: 'float: right',
            props: {
              type: 'text-primary',
            },
          }, '详情'),
        ]),
        type: 'info',
        duration: 0,
      })
    },

    handleProgress () {
      this.value = 0
      const f1 = () => {
        setTimeout(() => {
          if (this.value < 100) {
            this.value = this.value + 1
            f1()
          }
        }, 100)
      }
      f1()
    },

    /* openProgress () {
      const h = this.$createElement;
      this.$mtd.message({
        message: h('mtd-progress', { props: {

        } }),
        type: 'loading',
        duration: 0,
      });
    }, */
  },
}
</script>

<style>

.my-center{
  display: flex;
  align-items: center;
  justify-content: space-between;
}

</style>
