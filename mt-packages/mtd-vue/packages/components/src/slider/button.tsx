import {
  computed,
  defineComponent,
  reactive,
  ref,
  toRefs,
  watch,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import MtdTooltip from '@components/tooltip'
import { ITooltip } from '@components/tooltip/types'
import { useListeners } from '@components/hooks/pass-through'

export default defineComponent({
  name: 'MtdSlider',
  components: {
    MtdTooltip,
  },
  inheritAttrs: true,
  props: {
    value: {
      type: Number,
      default: 0,
    },
    vertical: {
      type: Boolean,
      default: false,
    },
    type: {
      type: [String, Number],
    },
    formatTooltip: Function,
    getPercent: Function,
  },
  emits: ['dragging', 'change', 'drag-end'],
  setup(props) {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('slider-button'))

    const state = reactive({
      tip: false,
      dragging: false,
      hover: false,
      startValue: undefined as number | undefined,
    })

    const tooltipRef = ref<ITooltip | null>(null)

    const myListeners = useListeners({
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
      prefix, myListeners,
      handleTooltipChange,
      tooltipRef,
    }
  },

  computed: {
    tooltipContent(): string {
      return this.formatTooltip
        ? this.formatTooltip(this.value)
        : this.value.toString()
    },
    placement(): string {
      return this.vertical ? 'right' : 'top'
    },
    tooltipVisible(): boolean {
      return this.dragging ? true : this.tip
    },
  },

  methods: {
    onMouseDown(e: MouseEvent) {
      e.preventDefault()
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
        this.startValue = this.value
      }
      this.dragging = true
      this.$emit('dragging', e, this.type)
    },
    onDragEnd(e: MouseEvent) {
      this.dragging = false
      this.$emit('drag-end', e, this.type)
      if (this.startValue !== this.value) {
        this.$emit('change')
      }
      window.removeEventListener('mousemove', this.onDragging)
      window.removeEventListener('mouseup', this.onDragEnd)
    },
  },
  render() {
    const {
      tooltipContent, placement, tooltipVisible, vertical, value,
      prefix, myListeners, dragging, hover,
    } = this

    return <mtd-tooltip
      content={tooltipContent}
      placement={placement}
      visible={tooltipVisible}
      ref="tooltipRef"
      size="small"
      {...myListeners}
    >
      <div
        class={{
          [prefix]: true,
          [prefix + '-hover']: dragging || hover,
        }}
        onMousedown={this.onMouseDown}
        onMouseover={this.onMouseOver}
        onMouseleave={this.onMouseLeave}
        onTouchstart={this.onMouseDown}
        onClick={(e: Event) => e.stopPropagation()}
        style={vertical ? { bottom: this.getPercent?.(value) } : { left: this.getPercent?.(value) }}
      />
    </mtd-tooltip >
  },
})
