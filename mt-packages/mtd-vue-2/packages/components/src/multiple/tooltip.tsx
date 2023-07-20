import {
  defineComponent,
  computed,
  watch,
  ref,
  getSlotsInRender,
  useListeners,
  vSlots,
} from '@ss/mtd-adapter'
import MtdSelectTag from './tag'
import MtdTooltip from '@components/tooltip'

export default defineComponent({
  name: 'MtdMultipleTooltip',
  components: {
    MtdSelectTag,
    MtdTooltip,
  },
  inheritAttrs: false,
  props: {
    prefix: String,
    value: Array,
    closable: [Boolean, Function],
    maxCount: Number,
    formatter: Function,
  },
  setup(props) {
    const tooltipRef = ref(null)
    const tags = computed(() => {
      return props.value
        && props.maxCount
        && props.value.length > props.maxCount ? props.value.slice(0, props.maxCount) : props.value
    })
    const hasMore = computed(() => {
      return tags.value !== props.value
    })
    const count = computed(() => {
      return props.value ? props.value.length : 0
    })
    watch(tags, () => {
      (tooltipRef.value as any).updatePopper()
    })

    const handleClick = (e: Event) => {
      e.stopPropagation()
    }
    const listeners = useListeners()

    return {
      tags,
      hasMore,
      count,
      listeners,
      handleClick,
      tooltipRef,
    }
  },
  render() {
    const { prefix, tags, count, hasMore, formatter, closable, listeners } = this

    const Tag = MtdSelectTag as any

    const slots = {
      content: () => <div
        onClick={this.handleClick}
        onMousedown={this.handleClick}
      >
        {tags && tags.map((v: any, i: number) => <Tag
          option={v}
          closable={closable}
          key={i}
          {...listeners}
        >
          {formatter ? formatter(v) : v.label}
        </Tag>,
        )}
        {tags && hasMore &&
          <Tag key="-1" closable={false} theme="">
            +{count - tags.length}
          </Tag>
        }
      </div>,
    }

    return <mtd-tooltip
      placement="top"
      theme="light"
      ref="tooltipRef"
      trigger="hover"
      popper-class={`${prefix}-tags-popper`}
      {...vSlots(slots)}
      v-slots={slots}
    >
      {getSlotsInRender(this)}
    </mtd-tooltip>
  },
})
