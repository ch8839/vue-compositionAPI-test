import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'
export default defineComponent({
  name: 'Link',
  inheritAttrs: false,
  props: {
    href: String,
    route: [Object, String],
    disabled: Boolean,
  },
  methods: {
    handleClick(event: MouseEvent) {
      if (this.disabled) {
        event.preventDefault()
        event.stopPropagation()
        return
      }
      this.$emit('click', event)
    },
  },
  render() {
    const { route, href } = this
    const isRoute = !href
    const Tag = isRoute ? RouterLink : 'a'
    /* const on = {
      click: this.handleClick,
    } */
    const attrs = {
      ...this.$attrs,
    }
    if (isRoute) {
      attrs.to = route
    } else {
      attrs.target = '_blank'
      attrs.href = href
    }
    if (isRoute && this.disabled) {
      /**
       * to disabled router link
       * see https://github.com/vuejs/vue-router/issues/916
       * */
      attrs.event = ''
      delete attrs.disabled
    }
    const children = this.$slots.default ? this.$slots.default() : undefined

    return <Tag {...attrs}>{children}</Tag>
  },
})
