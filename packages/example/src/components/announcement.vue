<template>
  <mtd-announcement
    v-if="hasRead"
    closable
    type="info"
    @close="handleClose"
    :style="{
      position: 'fixed',
      zIndex: 2000,
      width: '100%',
      minWidth: '1200px'
    }"
  >
    <div>
      &nbsp;&nbsp;&nbsp;🎉：我们已经发布 美团UI Vue3.x 组件库<a  href="https://mtdui.sankuai.com/mtd-vue3/components/button" target="_blank"> @ss/mtd-vue3 </a>，
      未来他将与 
      <a  href="https://mtdui.sankuai.com/mtd-vue2/components/button" target="_blank"> @ss/mtd-vue2 </a>
      基于同一套代码（兼容了Vue2和3）实现同步版本迭代维护，欢迎大家接入&nbsp;&nbsp;&nbsp;
      <mtd-button type="primary" ghost size="small" href="https://km.sankuai.com/collabpage/1353098739" target="_blank">
        更多详情 📚
      </mtd-button>
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