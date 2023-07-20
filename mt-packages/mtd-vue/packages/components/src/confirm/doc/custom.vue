<template>
  <div class="demo-btn-group">
    <mtd-button @click="openVNode">内容是 VNode</mtd-button>&nbsp;&nbsp;
    <mtd-button @click="openHTML">内容是 HTML</mtd-button>
  </div>
</template>

<script>
export default {
  methods: {
    openVNode () {
      const h = this.$createElement;
      this.$mtd.confirm({
        type: 'error',
        title: '消息',
        message: h('p', null, [
          h('span', null, '内容可以是 '),
          h('i', { style: 'color: teal' }, 'VNode'),
        ]),
        showCancelButton: true,
        okButtonText: '确定',
        cancelButtonText: '取消',
      }).catch(() => {});
    },
    openHTML () {
      this.$mtd.confirm({
        title: 'HTML 片段',
        message: '<strong>这是 <i>HTML</i> 片段</strong>',
        dangerouslyUseHTMLString: true,
      }).catch(() => {});
    },
  },
};
</script>
