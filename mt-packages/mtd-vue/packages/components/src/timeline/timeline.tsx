import {
  defineComponent,
  PropType,
  computed,
} from '@ss/mtd-adapter'
import { VNode } from 'vue'
import { TimeLineType } from './types'
import { applyProps } from '@utils/vnode'
import useConfig from '@hooks/config'
import useProvide from '@components/timeline/useProvide'

function getTimelineItemFromSlots(vnodes: VNode[]) {
  return (vnodes || []).filter((vnode) => {
    if (vnode.componentOptions) {
      return (vnode.componentOptions.Ctor as any).options.name === 'MtdTimelineItem'
    }
    return false
  })
}

export default defineComponent({
  name: 'MtdTimeline',
  inheritAttrs: true,
  props: {
    mode: {
      type: String as PropType<TimeLineType>,
      default: '',
    },
    showTitle: Boolean,
  },
  emits: [],
  setup(props) {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('timeline'))

    const { provideTimeline } = useProvide()
    provideTimeline({
      mode: props.mode,
    })

    return {
      prefix,
    }
  },
  render() {
    const { prefix, mode, showTitle } = this
    const defaultSlot = this.$slots.default
    const children = defaultSlot || []

    const items = getTimelineItemFromSlots(children).map((vnode, i) => {
      const align =
        mode === 'alternate' ? (i % 2 === 0 ? undefined : 'right') : mode
      return applyProps(vnode, { align, showTitle, mode })
    })

    return <ul class={`${prefix} ${mode ? `${prefix}-${mode}` : ''}`}>
      {items}
    </ul>
  },
})
