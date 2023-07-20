import { getListeners } from '@components/hooks/pass-through'
import {
  defineComponent,
  computed,
  watch,
  ref,
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
    const $listener = getListeners()

    return {
      tags,
      hasMore,
      count,
      $listener,
      handleClick,
      tooltipRef,
    }
  },
  render() {
    const { prefix, tags, count, hasMore, formatter, closable, $listener } = this
    const { default: children } = this.$slots
    return <mtd-tooltip placement="top" theme="light"
      ref="tooltipRef" trigger="hover"
    >
      <div slot="content" class={`${prefix}-tags-popper`}
        onClick={this.handleClick} onMousedown={this.handleClick}>
        {tags && tags.map((v: any, i: number) => {
          return <mtd-select-tag option={v} closable={closable}
            key={i} onClose={$listener.close}>
            {formatter ? formatter(v) : v.label}
          </mtd-select-tag>
        })}
        {tags && hasMore && <mtd-select-tag key="-1" closable={false} theme="">
          +{count - tags.length}
        </mtd-select-tag>}
      </div>
      {children}
    </mtd-tooltip>
  },
})
