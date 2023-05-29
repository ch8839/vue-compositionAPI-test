import {
  computed,
  defineComponent,
  PropType,
  reactive,
  ref,
  toRefs,
  watch,
  useListeners,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import MtdTooltip from '@components/tooltip'
import { ITooltip } from '@components/tooltip/types'

export default defineComponent({
  name: 'MtdSliderRangeButton',
  components: {
    MtdTooltip,
  },
  inheritAttrs: true,
  props: {
    value: {
      type: Array as PropType<number[]>,
      default: () => [0, 10],
    },
    vertical: {
      type: Boolean,
      default: false,
    },
    formatTooltip: Function,
    getPercent: Function,
    bars: {
      type: Object,
      default: () => { },
    },
    thresholds: Boolean,
  },
  emits: ['dragging', 'change', 'input', 'drag-start', 'drag-end'],
  setup(props) {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('slider-button'))
    const prefixSlider = computed(() => config.getPrefixCls('slider'))

    const state = reactive({
      hover: false,
      tip: false,
      dragging: false,
      startValue: undefined as number | undefined,
      endValue: undefined as number | undefined,
    })

    const tooltipRef = ref<ITooltip | null>(null)

    const resetListeners = useListeners({
      ['update:visible']: handleTooltipChange,
    })

    //@Methods
    function handleTooltipChange(v: boolean) {
      state.tip = v
    }

    //@Watch
    watch(() => props.value, () => {
      tooltipRef.value?.updatePopper()
    })

    return {
      ...toRefs(state),
      prefix, resetListeners, prefixSlider,
      handleTooltipChange,
      tooltipRef,
    }
  },

  computed: {
    tooltipContent(): string {
      return this.formatTooltip
        ? this.formatTooltip(this.value)
        : this.value.join(' ~ ')
    },
    placement(): string {
      return this.vertical ? 'right' : 'top'
    },
    tooltipVisible(): boolean {
      return this.dragging ? true : this.tip
    },
    barStyle(): any {
      const style: any = this.vertical
        ? { height: this.bars.w, bottom: this.bars.x }
        : { width: this.bars.w, left: this.bars.x }

      if (this.thresholds) {
        style['background-color'] = 'transparent'
        style.zIndex = 1
      }

      return style
    },

  },

  methods: {
    onMouseDown(e: MouseEvent | TouchEvent) {
      e.preventDefault()
      this.$emit('drag-start', e)
      window.addEventListener('mousemove', this.onDragging)
      window.addEventListener('mouseup', this.onDragEnd)
    },
    onMouseOver(e: MouseEvent) {
      this.hover = true
      e.preventDefault()
    },
    onMouseLeave(e: MouseEvent) {
      this.hover = false
      e.preventDefault()
    },
    onDragging(e: MouseEvent) {
      if (!this.dragging) {
        this.startValue = this.value[0]
        this.endValue = this.value[1]
      }
      this.dragging = true
      this.$emit('dragging', e)
      this.$emit('input')
    },
    onDragEnd(e: MouseEvent) {
      this.dragging = false
      this.$emit('drag-end', e)
      if (this.startValue !== this.value[0] || this.endValue !== this.value[1]) {
        this.$emit('input')
        this.$emit('change')
      }
      window.removeEventListener('mousemove', this.onDragging)
      window.removeEventListener('mouseup', this.onDragEnd)
    },
    getInversePercent(percent: string) {
      return `${100 - parseInt(percent)}%`
    },
  },
  render() {
    const {
      tooltipContent, placement, tooltipVisible, vertical, value,
      prefix, resetListeners, dragging, hover, prefixSlider, barStyle,
    } = this

    return <mtd-tooltip
      content={tooltipContent}
      placement={placement}
      visible={tooltipVisible}
      ref="tooltipRef"
      size="small"
      {...resetListeners}
    >
      <div
        class={prefix + '-range'}
        onMousedown={this.onMouseDown}
        onMouseover={this.onMouseOver}
        onMouseleave={this.onMouseLeave}
        onTouchstart={this.onMouseDown}
        onClick={(e: Event) => e.stopPropagation()}
        style={vertical
          ? {
            bottom: this.getPercent?.(value[0]),
            top: this.getInversePercent(this.getPercent?.(value[1])),
          }
          : {
            marginLeft: this.getPercent?.(value[0]),
            marginRight: this.getInversePercent(this.getPercent?.(value[1])),
          }
        }
      >
        <div
          class={{
            [prefix]: true,
            [prefix + '-hover']: dragging || hover,
          }}

          style={vertical ? { bottom: this.getPercent?.(value[0]) } : { left: this.getPercent?.(value[0]) }}
        />
        <div
          class={`${prefixSlider}-bar`}
          style={barStyle}
        />
        <div
          class={{
            [prefix]: true,
            [prefix + '-hover']: dragging || hover,
          }}
          style={vertical ? { bottom: this.getPercent?.(value[1]) } : { left: this.getPercent?.(value[1]) }}
        />
      </div>
    </mtd-tooltip >
  },
})