import {
  defineComponent,
  computed,
  reactive,
  toRefs,
  ref,
  PropType,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import { debounce } from '@utils/debounce'
import { warn } from '@utils/log'
import { on, off } from '@utils/dom'
import { isNumber } from '@utils/type'
import { onAMounted, onAUnmounted } from '@hooks/util'
import getElement from '@hooks/getElement'
// todo: 自定义 scrollelement 的情况怎么做。
function getScroll(target: HTMLElement | Window, top?: boolean) {
  const prop = top ? 'pageYOffset' : 'pageXOffset'
  const method = top ? 'scrollTop' : 'scrollLeft'

  let ret: number | undefined = (target as any)[prop]

  if (!isNumber(ret)) {
    ret = window.document.documentElement[method]
  }

  return ret
}

function getOffset(element: HTMLElement) {
  const rect = element.getBoundingClientRect()

  const scrollTop = getScroll(window, true)
  const scrollLeft = getScroll(window)

  const docEl = window.document.body
  const clientTop = docEl.clientTop || 0
  const clientLeft = docEl.clientLeft || 0
  // clientTop和clientLeft兼容性比较好，不需要修改
  return {
    top: rect.top + scrollTop - clientTop,
    left: rect.left + scrollLeft - clientLeft,
  }
}

export interface getTarget {
  (): HTMLElement
  (element?: HTMLElement): HTMLElement
}

function getDefaultTarget() {
  return window
}
export default defineComponent({
  name: 'MtdAffix',
  inheritAttrs: true,
  props: {
    offsetTop: {
      type: Number,
      default: 0,
    },
    offsetBottom: {
      type: Number,
    },
    debounce: {
      type: Number,
      default: 0,
    },
    getTarget: {
      type: Function as PropType<getTarget>,
      default: undefined,
    },
  },
  emits: ['change'],
  setup(props, { emit }) {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('affix'))

    const pointRef = ref<HTMLElement>()
    const state = reactive<{
      affix: boolean
      selfStyles?: any
      slot: boolean
      slotStyle?: any
      containerEl?: HTMLElement | Window
    }>({
      affix: false,
      selfStyles: {},
      slot: false,
      slotStyle: {},
      containerEl: undefined,
    })
    const offsetType = computed(() => props.offsetBottom! >= 0 ? 'bottom' : 'top')
    const el = getElement()
    const containerEl = ref<HTMLElement | Window>()

    // @Methods
    function handleScroll() {
      const affix = state.affix
      const scrollElement = containerEl.value
      const $el = el.value
      if (!scrollElement || !$el) {
        return
      }
      const scrollTop = getScroll(scrollElement, true)
      const containerHeight =
        scrollElement === window
          ? ((window as Window).innerHeight || document.body.clientHeight)
          : (scrollElement as HTMLElement).getBoundingClientRect().height

      // todo: 确认下非 window 的情况是否应该这么算
      const elOffset = getOffset($el)
      const elHeight = pointRef.value!.offsetHeight
      if (affix) {
        switch (offsetType.value) {
          case 'top':
            if ((elOffset.top - props.offsetTop) > scrollTop) {
              state.slot = false
              state.slotStyle = {}
              state.affix = false
              state.selfStyles = undefined
              emit('change', false)
            }
            break
          case 'bottom':
            if (
              elOffset.top + props.offsetBottom! + elHeight <
              scrollTop + containerHeight
            ) {
              state.affix = false
              state.selfStyles = undefined
              emit('change', false)
            }
            break
        }
      } else {
        switch (offsetType.value) {
          case 'top':
            if (elOffset.top - props.offsetTop < scrollTop) {
              state.affix = true
              const point = pointRef.value as HTMLElement
              state.slotStyle = {
                width: point.clientWidth + 'px',
                height: point.clientHeight + 'px',
              }
              state.slot = true
              state.selfStyles = {
                top: `${props.offsetTop}px`,
                left: `${elOffset.left}px`,
                width: `${el.value?.offsetWidth}px`,
              }
              emit('change', true)
            }
            break
          case 'bottom':
            if (
              elOffset.top + props.offsetBottom! + elHeight >
              scrollTop + containerHeight
            ) {
              state.affix = true
              state.selfStyles = {
                bottom: `${props.offsetBottom}px`,
                left: `${elOffset.left}px`,
                width: `${el.value?.offsetWidth}px`,
              }
              emit('change', true)
            }
            break
        }
      }
    }

    const debounceScroll = props.debounce ? debounce(props.debounce, handleScroll) : handleScroll
    onAMounted(() => {
      containerEl.value = (props.getTarget || getDefaultTarget)(el.value)
      if (containerEl.value) {
        on(containerEl.value, 'scroll', debounceScroll)
        on(containerEl.value, 'resize', debounceScroll)
        debounceScroll()
      } else {
        warn('Affix', 'getTarget prop must return an HTMLElement')
      }
    })
    onAUnmounted(() => {
      if (containerEl.value) {
        off(containerEl.value, 'scroll', debounceScroll)
        off(containerEl.value, 'resize', debounceScroll)
      }
    })
    return {
      ...toRefs(state),
      offsetType,
      handleScroll,
      debounceScroll,
      prefix, pointRef,
    }
  },
  render() {
    const {
      prefix, affix, selfStyles, slot, slotStyle,
    } = this
    return <div>
      <div ref='pointRef' class={{ [`${prefix}`]: affix }} style={selfStyles}>
        {this.$slots.default}
      </div>
      <div v-show={slot} style={slotStyle} />
    </div>
  },
})
