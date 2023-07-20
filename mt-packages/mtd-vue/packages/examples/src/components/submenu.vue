<template>
  <div class="submenu">
    <a href="https://mtdui.sankuai.com/mtd/vue/components/button" style="margin-right: 12px;">
      返回 旧版组件库
      <i class="mtdicon mtdicon-star" style="margin-left: 4px" />
    </a>
    <VersionSelector tag="Vue" />
    <StyleSelector @theme="handleTheme" />
  </div>
</template>
<script>
import StyleSelector from './style-select'
import VersionSelector from './version-select'

export default {
  components: {
    StyleSelector,
    VersionSelector,
  },
  provide() {
    return {
      router: this,
    }
  },
  data() {
    return {
      route: undefined,
      $router: undefined,
      theme: undefined,
    }
  },
  methods: {
    handleTheme(theme) {
      this.theme = theme
    },
  },
}
</script>
<style lang="scss">
.submenu {
  display: flex;
  align-items: center;
  > div {
    margin-left: 12px;
  }
}
</style>
