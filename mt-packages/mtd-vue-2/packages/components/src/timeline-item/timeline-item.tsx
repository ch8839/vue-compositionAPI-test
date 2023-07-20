import {
  defineComponent,
  PropType,
  computed,
  getSlotsInRender,
  vSlots,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import TimelineItemLine from './line'
import { LineItemAlign } from './types'
import useProvide from '@components/timeline/useProvide'

export default defineComponent({
  name: 'MtdTimelineItem',
  components: {
    TimelineItemLine,
  },
  inheritAttrs: true,
  props: {
    type: String,
    align: {
      type: String as PropType<LineItemAlign>,
      validator(value) {
        return ['right', 'left', ''].indexOf(value as any) > -1
      },
      default: '',
    },
    title: String,
    showTitle: Boolean,
    mode: String,
    size: String,
    ghost: Boolean,
  },
  emits: [],
  setup() {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('timeline-item'))

    const { injectTimeline } = useProvide()
    const timeline = injectTimeline()

    const parDirec = computed(() => timeline.mode)

    return {
      prefix, parDirec,
    }
  },
  render() {
    const {
      prefix, align, title, showTitle, mode, type, size, ghost,
    } = this

    const timelineItemSlots = {
      dot: () => getSlotsInRender(this, 'dot'),
    }

    return <li
      class={{
        [prefix]: true,
        [`${prefix}-${align}`]: align,
      }}
    >
      {showTitle
        ? <div class={`${prefix}-title`} >
          {getSlotsInRender(this, 'title') || title}
        </div>
        : mode === 'alternate' && <div class={`${prefix}-holder`} />
      }

      {(mode !== 'alternate' && getSlotsInRender(this, 'reverse')) &&
        <div class={`${prefix}-content-wrapper-reverse`}>
          {getSlotsInRender(this, 'reverse')}
        </div>
      }

      <timeline-item-line
        type={type}
        size={size}
        ghost={ghost}
        {...vSlots(timelineItemSlots)}
        v-slots={timelineItemSlots}
      />

      <div class={`${prefix}-content-wrapper`}>
        {getSlotsInRender(this)}
      </div>

    </li >
  },
})

