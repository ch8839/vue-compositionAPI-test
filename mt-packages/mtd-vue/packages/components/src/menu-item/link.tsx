
// tofix: https://tt.sankuai.com/ticket/detail?id=4026992
// https://tt.sankuai.com/ticket/detail?id=4020772
import { defineComponent } from "@ss/mtd-adapter"
export default defineComponent({
  name: "Link",
  inheritAttrs: true,
  render() {
    return <a>{this.$slots.default}</a>
  },
})
