import {
  defineComponent,
  ref,
  computed,
  onMounted,
  onUpdated,
  onUnmounted,
  nextTick,
  getChildInsList,
  getChildVNodeList,
  applyProps,
  VNode,
} from '@ss/mtd-adapter'
import { addResizeListener, removeResizeListener } from '@utils/resize-event'
import useConfig from '@hooks/config'
import vueInstance from '@hooks/instance'
import getElement from '@components/hooks/getElement'
import { CPI } from '@components/types/component'

const ScaleValue = 0.8

export default defineComponent({
  name: 'MtdCarousel',
  props: {
    initialIndex: {
      type: Number,
      default: 0,
    },
    autoplay: {
      type: Boolean,
      default: true,
    },
    indicatorPosition: {
      type: String,
      default: 'inside',
    },
    indicatorType: {
      type: String,
      default: 'line',
    },
    speed: {
      type: Number,
      default: 600,
    },
    interval: {
      type: Number,
      default: 3000,
    },
    loop: {
      type: Boolean,
      default: true,
    },
    arrow: {
      type: String,
      default: 'always',
    },
    type: {
      type: String,
      default: 'normal',
    },
    height: {
      type: Number,
      default: 240,
    },
    showButton: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['change'],
  setup(props) {

    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('carousel'))
    const iconPrefix = config.getIconCls
    const ins = vueInstance()
    const el = getElement()

    const width = ref<number>(0)
    const activeIndex = ref<number>(props.initialIndex || 0)
    const isTransition = ref<boolean>(false)

    const carouselInstanceItems = ref<CPI[]>([])

    const wrapperRef = ref<HTMLElement | null>(null)
    const itemListRef = ref<HTMLElement | null>(null)


    // @Computed
    const isNormalType = computed(() => {
      return props.type === 'normal' || props.type === 'horizontal'
    })
    const len = computed(() => {
      return carouselInstanceItems.value.length
    })
    const activeDot = computed(() => {
      let activeDot
      if (activeIndex.value === len.value) {
        activeDot = 0
      } else if (activeIndex.value === -1) {
        activeDot = len.value - 1
      } else {
        activeDot = activeIndex.value
      }
      return activeDot
    })

    // @Created
    const isMouseover = ref<boolean>(false) // 控制autoplay和next函数
    const timer = ref<any>(null) // autoplay的时间锚

    onMounted(() => {
      const wrapper = wrapperRef.value
      // 获取容器宽度，容器为100%,拿到真实宽度后渲染children的宽度
      width.value = wrapper ? wrapper.offsetWidth : 0
      calcCarousel()
      // translated(activeIndex.value + 1)
      nextTick(() => {
        isTransition.value = true // tofix: https://tt.sankuai.com/ticket/detail?id=40600798
      })
      // 当页面宽度改变时，更新width属性
      addResizeListener(el.value, handleWindowResized)
    })

    onUpdated(() => {
      calcCarousel()
    })

    onUnmounted(() => {
      removeResizeListener(el.value, handleWindowResized)
    })

    // @Methods
    const handlePrevBtnClick = () => {
      isMouseover.value = false
      prev()
    }

    const handleNextBtnClick = () => {
      isMouseover.value = false
      next()
    }

    const handleDotClick = (index: number) => {
      isMouseover.value = false
      setActiveItem(index)
    }

    const handleWindowResized = () => {
      const wrapper = wrapperRef.value
      width.value = wrapper ? wrapper.offsetWidth : 0
      setActiveItem(activeIndex.value)
    }

    const handleMouseEnter = () => {
      if (!props.autoplay) {
        return
      }
      isMouseover.value = true
      autoplayHandler()
    }

    const handleMouseLeave = () => {
      if (!props.autoplay) {
        return
      }
      isMouseover.value = false
      autoplayHandler()
    }

    const setActiveItem = (index: number, type?: 'next' | 'prev') => {

      if (activeIndex.value === index) {
        return
      }
      if (isNormalType.value) {
        const prevDir = props.type === 'normal' ? 'left' : 'top'
        const nextDir = props.type === 'normal' ? 'right' : 'bottom'

        let curActiveItem_position = ''
        let nextActiveItem_position = ''

        if (type) {
          curActiveItem_position = type === 'next' ? prevDir : nextDir
          nextActiveItem_position = type === 'next' ? nextDir : prevDir
        } else {
          curActiveItem_position = activeIndex.value > index ? nextDir : prevDir
          nextActiveItem_position = activeIndex.value > index ? prevDir : nextDir
        }

        const curActiveItem = carouselInstanceItems.value[activeIndex.value] 
        const nextActiveItem = carouselInstanceItems.value[index] 

        curActiveItem.setAnimation(curActiveItem_position, 'out') // 往 哪个方向 出去
        nextActiveItem.setAnimation(nextActiveItem_position, 'enter') // 从哪个方向 进来
      }

      activeIndex.value = index
    }

    const autoplayHandler = () => {
      if (!isMouseover.value) {
        timer.value = setTimeout(() => {
          next()
          autoplayHandler()
        }, props.interval)
      } else {
        clearCarouselTimeout()
      }
    }

    const clearCarouselTimeout = () => {
      timer.value && clearTimeout(timer.value)
      timer.value = null
    }

    const next = () => {
      const nextIndex = (activeIndex.value + 1) % len.value
      setActiveItem(nextIndex, 'next')
    }

    const prev = () => {
      const prevIndex = activeIndex.value - 1 <= 0 ? len.value - 1 : (activeIndex.value - 1) % len.value
      setActiveItem(prevIndex, 'prev')
    }

    const calcCarousel = () => {
      const newCarouselInstanceItems = getCarouselItemInstanceList()
      if (
        carouselInstanceItems.value.length !== newCarouselInstanceItems.length
      ) {
        carouselInstanceItems.value = newCarouselInstanceItems
        const curActiveIndex = props.initialIndex || 0
        activeIndex.value = curActiveIndex
        setActiveItem(curActiveIndex)
        if (props.autoplay) {
          clearCarouselTimeout()
          autoplayHandler()
        }
      }
    }

    // 获取 item ins
    const getCarouselItemInstanceList = () => {
      return getChildInsList(ins, ['MtdCarouselItem'])
    }

    // 获取 item vnode
    const getCarouselItemVNodeList = () => {
      return getChildVNodeList(ins, ['MtdCarouselItem'])
    }

    function getCardType(index: number) {
      if (index === (activeIndex.value + 1) % len.value) {
        return 'next'
      } else if (index === ((activeIndex.value - 1) % len.value >= 0
        ? (activeIndex.value - 1) % len.value
        : len.value + (activeIndex.value - 1))) {
        return 'prev'
      }
    }

    return {
      width,
      len,
      activeIndex,
      isTransition,
      prefix,
      wrapperRef,
      itemListRef,
      activeDot,
      isNormalType,
      iconPrefix,
      getCarouselItemVNodeList,
      handleDotClick,
      handleMouseEnter,
      handleMouseLeave,
      handlePrevBtnClick,
      handleNextBtnClick,
      prev,
      next,
      setActiveItem,
      getCardType,
    }
  },
  render() {
    const {
      width,
      height,
      len,
      activeIndex,
      isTransition,
      prefix,
      speed,
      arrow,
      indicatorPosition,
      activeDot,
      indicatorType,
      type,
      showButton,
      getCarouselItemVNodeList,
      handleMouseEnter,
      handleMouseLeave,
      handlePrevBtnClick,
      handleNextBtnClick,
      handleDotClick,
    } = this
    const children = getCarouselItemVNodeList()
    const items = children.map((i: VNode, index: number) =>
      applyProps(i, {
        index,
        width: type === 'card' ? width * ScaleValue : width,
        activeIndex: activeIndex,
        mask: type === 'card',
        speed: speed,
        cardType: this.getCardType(index),
      }),
    )

    let liList: number[] = []
    const itemListStyle: any = {}

    if (items.length > 1) {
      liList = Array.from(new Array(len), (val, index) => index)

      itemListStyle.width = '100%'

      if (isTransition) {
        itemListStyle.transition = `transform ${speed / 1000}s ease-in-out`
      }
      // itemListStyle.overflow = `hidden`
      itemListStyle.position = 'relative'
      itemListStyle['transform-style'] = 'preserver-3d'
      itemListStyle.height = `${height}px`

    }

    return (
      <div
        class={[prefix, `${prefix}-${type}`]}
        ref={'wrapperRef'}
        onMouseenter={handleMouseEnter}
        onMouseleave={handleMouseLeave}
      >
        <div class={`${prefix}-itemList-outer`}>
          {
            <div
              class={`${prefix}-itemList`}
              style={{ ...itemListStyle, 'transform-style': 'preserve-3d' }}
              ref={'itemListRef'}
            >
              {width ? items : null}
            </div>
          }

          {/* 左右按钮 */}
          {
            (showButton && items.length > 1) &&
            <div
              class={[`${prefix}-btn`, `${prefix}-prev`, `${prefix}-${arrow}`]}
              onClick={handlePrevBtnClick}
            >
              <i class={this.iconPrefix('left-thick')} style={
                'transform: translateX(-1px)'
              } />
            </div>
          }
          {
            (showButton && items.length > 1) &&
            <div
              class={[`${prefix}-btn`, `${prefix}-next`, `${prefix}-${arrow}`]}
              onClick={handleNextBtnClick}
            >
              <i class={this.iconPrefix('right-thick')} style={
                'transform: translateX(1px)'
              } />
            </div>
          }
        </div>


        {/* 指示器 */}
        <ul class={{
          [`${prefix}-indicator`]: true,
          [`${prefix}-inside`]: indicatorPosition.indexOf('inside') >= 0,
          [`${prefix}-${indicatorPosition}`]: true,
        }}>
          {liList.map((item) => {
            return (
              <span
                class={[
                  `${prefix}-dot`,
                  {
                    [`${prefix}-active-dot`]: activeDot === item,
                    [`${prefix}-dot-${indicatorType}`]: true,
                  },
                ]}
                onClick={() => handleDotClick(item)}
              />
            )
          })}
        </ul>
      </div >
    )
  },
})
