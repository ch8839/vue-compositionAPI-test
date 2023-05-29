import {
  defineComponent,
  PropType,
  computed,
  getChildVNodeList,
  applyProps,
  vueInstance,
} from '@ss/mtd-adapter'
import { TimeLineType } from './types'
import useConfig from '@hooks/config'
import useProvide from '@components/timeline/useProvide'
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
    const ins = vueInstance()

    const { provideTimeline } = useProvide()
    provideTimeline({
      mode: props.mode,
    })

    const getCarouselItemVNodeList = () => {
      return getChildVNodeList(ins, ['MtdTimelineItem'])
    }

    return {
      prefix, getCarouselItemVNodeList,
    }
  },
  render() {
    const { prefix, mode, showTitle } = this
    const children = this.getCarouselItemVNodeList()

    const items = children.map((vnode, i) => {
      const align =
        mode === 'alternate' ? (i % 2 === 0 ? undefined : 'right') : mode
      return applyProps(vnode, { align, showTitle, mode })
    })

    return <ul class={`${prefix} ${mode ? `${prefix}-${mode}` : ''}`}>
      {items}
    </ul>
  },
})
