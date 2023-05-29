import {
  defineComponent,
  computed,
  ref,
  getSlotsInRender,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'

export default defineComponent({
  name: 'MtdCarouselItem',
  inheritAttrs: true,
  props: {
    index: Number,
    activeIndex: Number,
    width: Number,
    speed: Number,
    mask: Boolean,
    cardType: String,
  },
  emits: [],
  setup(props) {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('carousel-item'))
    const position = ref<string | undefined>()
    const status = ref<'enter' | 'out' | undefined>()
    // const cardType = ref<'next' | 'prev' | undefined>()
    const itemRef = ref<HTMLElement | null>(null)
    const itemStyle = computed(() => {
      return {
        width: props.width + 'px',
        ['animation-duration']: `${props.speed}ms`,
        ['transition-duration']: `${props.speed}ms`,
        ['animation-direction']: `${status.value === 'out' ? 'reverse' : 'normal'}`,
        ['animation-timing-function']: `${status.value === 'out'
          ? 'cubic-bezier(.75, 0, .75, 1)'
          : 'cubic-bezier(.25, 0, .25, 1)'}`,
      }
    })

    function handleAnimationend() {
      position.value = undefined
      status.value = undefined
    }

    function setAnimation(tempPosition: string, tempStatus: string) {
      status.value = tempStatus as any
      position.value = tempPosition as any
    }

    return {
      prefix, itemStyle, position, itemRef, handleAnimationend, setAnimation,
    }
  },
  render() {
    const {
      prefix, itemStyle, cardType,
      index, activeIndex, position, mask,
    } = this

    return <div
      class={[
        prefix,
        `${prefix}-${index}`,
        {
          [`${prefix}-active`]: activeIndex === index,
          [`${prefix}-${cardType}-active`]: cardType,
          [`${prefix}-active-turnover-${position}`]: position,
        },
      ]}
      style={itemStyle}
      ref="itemRef"
      onAnimationend={this.handleAnimationend}
    >
      <div class={`${prefix}-mask`} v-show={activeIndex !== index && mask} />
      {getSlotsInRender(this)}
    </div>
  },
})
