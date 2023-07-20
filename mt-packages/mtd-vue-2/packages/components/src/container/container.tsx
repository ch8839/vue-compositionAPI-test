import {
  defineComponent,
  computed,
  getSlotsInRender,
  getComponentName,
} from '@ss/mtd-adapter'

import { VNode } from 'vue'

import useConfig from '@hooks/config'
export default defineComponent({
  name: 'MtdContainer',
  inheritAttrs: true,
  props: {
    direction: String,
  },
  emits: [],
  setup(props) {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('container'))

    function getIsVertical(children: VNode[]) {
      if (props.direction === 'vertical') {
        return true
      } else if (props.direction === 'horizontal') {
        return false
      }
      return children.some((vnode) => {
        const tag = getComponentName(vnode as any)
        return tag === 'MtdHeader' || tag === 'MtdFooter'
      })
    }
    return {
      prefix, getIsVertical,
    }
  },
  render() {
    const { prefix } = this
    const children = getSlotsInRender(this) || []
    const isVertical = this.getIsVertical(children as any[])
    return <section class={[prefix, { [`${prefix}-vertical`]: isVertical }]}>
      {children}
    </section>
  },
})
