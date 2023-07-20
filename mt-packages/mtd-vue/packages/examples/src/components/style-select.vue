<template>
  <mtd-select class="select" v-model="theme" style="width: 150px">
    <mtd-option
      v-for="item in themes"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    >
      <mtd-badge dot class="my-badge" :status="item.value === 'theme-yellow' ? 'warning' : 'process'" />&nbsp;&nbsp;
      {{item.label}}
    </mtd-option>
  </mtd-select>
</template>

<script>
import { setStyle } from "../utils/style"

const themes = [
  { value: "theme-chalk", label: "美团UI 3.0 主题" },
  { value: "theme-yellow", label: "美团UI 黄 主题" },
]
export default {
  name: "StyleSelector",
  inject: {
    router: {
      from: "router",
      default() {
        return {
          route: { query: {} },
          $router: function () {},
        }
      },
    },
  },
  inheritAttrs: false,
  props: {},
  data() {

    return {
      themes,
      theme: 'theme-chalk',
    }
  },
  watch: {
    theme: {
      immediate: true,
      handler(theme) {
        // eslint-disable-next-line
        import(
          `!css-loader!postcss-loader!sass-loader!@components/${theme}/index.scss`
        ).then((file) => {
          const style = file.default.toString(); // eslint-disable-line
          setStyle(style, theme)
        })
        this.$emit("theme", theme)
      },
    },
  },
}
</script>
