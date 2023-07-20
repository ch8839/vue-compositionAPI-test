<template>
  <div class="submenu">
    <div class="submenu-announcement">
      <a href="/mtd/vue-next/doc/alpha">关于 Alpha 版本的说明</a>
    </div>
    <VersionSelector tag="Vue 3.x" />
    <StyleSelector @set-theme="handleTheme" />
  </div>
</template>
<script lang="ts">
import { ITheme } from 'examples/utils';
import { defineComponent } from 'vue';
import StyleSelector from './style-select.vue';
import VersionSelector from './version-select.vue';

export default defineComponent({
  components: {
    StyleSelector,
    VersionSelector,
  },
  props: {
    route: Object,
    router: Object,
  },
  provide() {
    return {
      router: this,
    };
  },
  data() {
    return {
      theme: undefined,
    } as {
      theme?: ITheme;
    };
  },
  methods: {
    handleTheme(theme: ITheme) {
      this.theme = theme;
    },
  },
});
</script>
<style lang="scss">
.submenu {
  display: flex;
  align-items: center;
  > div {
    margin-left: 12px;
  }
}
.submenu-announcement{
  margin-right: 20px;
}
</style>
