<template>
  <div class="center-h">
    <mtd-button @click="openVNodeNotify">带操作按钮</mtd-button>
    <mtd-button @click="openHTMLNotify">带链接和副标题</mtd-button>
  </div>
</template>
<script>
export default {
  methods: {
    openVNodeNotify () {
      const h = this.$createElement;
      const vnode = h('div', {}, [
          h('div', '主要信息展示说明。'),
          h('mtd-button', {
            domProps: {
              innerHTML: '提交按钮',
            },
            style: {
              marginTop: '8px',
              float: 'right',
            },
            props: {
              type: 'primary',
              size: 'small',
            },
            on: {
              click () {
                n.close();
              },
            },
          }),
        ]);

      const n = this.$mtd.notify({
        title: '消息确认',
        type: 'info',
        duration: 0,
        showClose: false,
        message: vnode,
      });
    },

    openHTMLNotify () {
      const h = this.$createElement;
      const vnode = h('div', {}, [
          h('div',{style:'color: rgba(0,0,0,0.5);margin-bottom: 12px;font-size:12px'}, '2018.06.12 12:00:23'),
          h('span',{}, '信息查询失败，立即跳转查看'),
          h('a',{ style: 'cursor:pointer' }, '失败原因')
        ]);
      this.$mtd.notify({
        title: '失败信息',
        type: 'error',
        dangerouslyUseHTMLString: true,
        message: vnode,
      });
    },
  },
};
</script>
