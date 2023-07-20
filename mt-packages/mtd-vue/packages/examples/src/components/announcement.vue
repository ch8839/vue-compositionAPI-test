<template>
  <mtd-announcement
    v-if="hasRead"
    type="warning"
    closable
    @close="handleClose"
    :style="{
      position: 'fixed',
      zIndex: 100,
      width: '100%',
    }"
  >
    <div>
      📢：我们已经发布 美团UI 3.0 美团黄主题（theme-yellow），
      详情内容 可以点右上角主题选择切换查看</a> 
    </div>
  </mtd-announcement>
  </div>
</template>
<script>
export default {
  data () {
    return {
      hasRead: true,
    }
  },
  created () {
  },
  methods: {
    handleClose () {
      this.$emit('close')
    },
  },
}
</script>
<style lang="scss">
.doc-announcement{
  position: fixed;
  z-index: 100;
  width: 100%;
}
</style>