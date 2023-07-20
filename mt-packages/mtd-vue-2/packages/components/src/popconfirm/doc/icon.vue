<template>
  <div>
    <mtd-popconfirm
      placement="top"
      message="您确定要删除现有文档内容吗？"
      @ok="confirm"
      icon="error-circle"
    >
      <mtd-button style="margin-right: 40px;">
        删除
      </mtd-button>
    </mtd-popconfirm>
  </div>
</template>
<script>
export default {
  methods: {
    confirm() {
      this.$mtd.message({
        type: 'success',
        message: '删除成功',
      });
    },
  },
};
</script>
