<script>
export default {
  name: 'Link',
  inheritAttrs: false,
  props: {
    href: String,
    route: [Object, String],
    disabled: Boolean,
  },
  methods: {
    handleClick (event) {
      if (this.disabled) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      this.$emit('click', event);
    },
    routeToItem (item, onError) {
      const route = item.route;
      try {
        this.$router.push(route, () => {}, onError);
      } catch (e) {
        console.error(e);
      }
    },
  },
  render (h) {
    const { route, href } = this;
    const isRoute = !href;
    const Tag = isRoute ? 'router-link' : 'a';
    const on = {
      click: this.handleClick,
    };
    const attrs = {
      ...this.$attrs,
    };
    if (isRoute) {
      attrs.to = route;
    } else {
      attrs.target = '_blank';
      attrs.href = href;
    }
    if (isRoute && this.disabled) {
      /**
       * to disabled router link
       * see https://github.com/vuejs/vue-router/issues/916
       * */
      attrs.event = '';
      delete attrs.disabled;
    }
    return h(Tag, {
      attrs: attrs,
      /**
       * a 标签不支持 nativeOn， router-link 则不会发 click 事件必须使用 nativeOn
       */
      [isRoute ? 'nativeOn' : 'on']: on,
    }, this.$slots.default);
  },
};
</script>
