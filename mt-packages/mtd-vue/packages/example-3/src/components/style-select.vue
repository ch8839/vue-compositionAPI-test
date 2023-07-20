<template>
  <mtd-select class="select" v-model="theme" style="width: 150px">
    <mtd-option
      v-for="item in themes"
      :key="item.value"
      :label="item.label"
      value-key="value"
      :value="item"
    />
  </mtd-select>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Cookies from 'js-cookie';
import { setStyle, ITheme } from '../utils';

const themes: ITheme[] = [
  { value: 'theme-chalk', label: 'MTDUI 1.0 主题' },
  { value: 'theme2', label: 'MTDUI 2.0 主题' },
];

export default defineComponent({
  name: 'StyleSelector',
  inheritAttrs: false,
  props: {},
  inject: {
    router: {
      from: 'router',
      default() {
        return {
          route: { query: {} },
          router: function () {},
        };
      },
    },
  },
  data() {
    window.MTD_THEME =
      this.router.route.query.theme || Cookies.get('MTD_THEME');
    return {
      themes,
      theme: themes.find((t) => t.value === window.MTD_THEME) || themes[1],
    };
  },
  watch: {
    theme: {
      immediate: true,
      handler(theme: ITheme) {
        const { value } = theme;
        // eslint-disable-next-line
        import(
          `!css-loader!postcss-loader!sass-loader!@components/${value}/index.scss`
        ).then((file) => {
          const style = file.default.toString(); // eslint-disable-line
          setStyle(style, theme);
        });
        this.$emit('set-theme', theme);
      },
    },
  },
});
</script>
