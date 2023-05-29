
// tofix: https://tt.sankuai.com/ticket/detail?id=4026992
// https://tt.sankuai.com/ticket/detail?id=4020772
import {
  defineComponent,
  getSlotsInRender,
  useResetAttrs,
} from '@ss/mtd-adapter'
export default defineComponent({
  name: 'Link',
  inheritAttrs: true,
  props: {
    router: Boolean,
  },
  setup(props, { attrs }) {
    const resetAttrs = useResetAttrs(attrs)
    return { resetAttrs }
  },
  render() {

    return this.router
      ? <router-link {...this.resetAttrs}>{getSlotsInRender(this)}</router-link>
      : <a {...this.resetAttrs}>{getSlotsInRender(this)}</a>
  },
})
