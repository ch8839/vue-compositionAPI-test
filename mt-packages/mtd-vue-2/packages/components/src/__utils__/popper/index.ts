import PopperJS, { PopperOptions, Modifiers, Placement } from 'popper.js' //🤡api变更 1-> 2
import PopupManage from './popup-manage'
import {
  PropType, markRaw, reactive, watch, nextTick, onMounted, onBeforeUnmount, onActivated, onDeactivated,
  getListeners, getElementFromComponent,
} from '@ss/mtd-adapter'
import { isServer } from '@utils/env'
import { on, off } from '@utils/dom'
import { deepCopy, mergeDeep } from '@utils/util'
import mitt, { Emitter } from '@utils/mitt'
import { getPopupContainer, PopperTrigger } from '@components/popper/types'
import { PopperInstance } from '@components/popper/types'

export function getDefaultPopupContainer(): HTMLElement {
  return document.body
}

const defaultPopperOptions: Modifiers = {
  computeStyle: {
    gpuAcceleration: false,
  },
  preventOverflow: {
    // enabled: false,
    boundariesElement: 'viewport',
  },
  hide: {
    enabled: false,
  },
  // flip: { behavior: ['right', 'left', 'bottom', 'top'] },
}

export { PopupManage }

type PopperData = {
  emitter: Emitter;
  isDropMounted: boolean; // drop 节点是否挂载
  popperVisible?: boolean;
  options: PopperOptions;
  reference?: HTMLElement;
};

export const withProps = {
  visible: {
    type: Boolean,
  },
  appendToContainer: {
    type: Boolean,
    default: true,
  },
  getPopupContainer: {
    type: Function as PropType<getPopupContainer>,
    default: getDefaultPopupContainer,
  },
  placement: {
    type: String as PropType<Placement>,
    default: 'bottom-start',
    validator: (value: string): boolean => {
      return /^(top|bottom|left|right)(-start|-end)?$/g.test(value)
    },
  },
  popperOptions: {
    type: Object as PropType<Modifiers>,
  },
  trigger: {
    // 暂定，触发 update:visible 事件的方式
    type: String as PropType<PopperTrigger>,
    default: 'custom',
    validator: (v: string): boolean => {
      return ['click', 'hover', 'focus', 'custom'].includes(v)
    },
  },
  popperDisabled: {
    type: Boolean,
  },
  showArrow: {
    type: Boolean,
  },
  openDelay: {
    type: Number,
  },
  closeDelay: {
    type: Number,
    default: 200, // 防止由于快速关闭而导致不能移入到 drop 元素上
  },
  toggleOnReferenceClick: {
    type: Boolean,
    default: true,
  },
}

interface popperProps {
  visible?: boolean,
  appendToContainer: boolean,
  getPopupContainer: getPopupContainer,
  placement: Placement,
  popperOptions?: Modifiers,
  trigger: PopperTrigger,
  popperDisabled?: boolean,
  showArrow?: boolean,
  openDelay?: number,
  closeDelay: number,
  toggleOnReferenceClick: boolean,
}


export const withEmits = ['created', 'show', 'hide', 'update:visible', 'clickoutside']

export const usePopper = (props: popperProps, ctx: any, ins: PopperInstance) => {

  const state = reactive<PopperData>({
    emitter: markRaw(mitt()),
    popperVisible: props.visible,
    options: {}, // popper options
    isDropMounted: props.visible || false,
    reference: undefined,
  })

  function setReferenceEl(el?: HTMLElement) {
    state.reference = el
  }
  function getReference() {
    return state.reference || getElementFromComponent(ins.referenceRef)
  }
  function getDrop() {
    if (ins.dropRef.$refs.drop) {
      return ins.dropRef.$refs.drop
    }
  }
  function init() {
    // this.reference = this.getReference();
    if (props.visible) {
      // 会存在 activated 后立即执行 beforeDestroy 的情况。
      // 详见: https://tt.sankuai.com/ticket/detail?id=3892540
      updatePopper()
    }
    addPopperListener()
  }
  function destroy() {
    PopupManage.close(ins)
    if (ins.popperJS) {
      ins.popperJS.destroy()
      ins.popperJS = undefined
    }
    removePopperListener()
    state.reference = undefined
    state.isDropMounted = false
  }
  function createPopper() {
    const reference = getReference()
    const drop = getDrop()
    if (!state.isDropMounted) {
      // 首次加载的时候 drop 的元素是异步挂载的，所以是取不到的，需要等待下次在进行
      state.isDropMounted = true
      nextTick(createPopper)
      return
    }
    if (!reference || !drop) {
      return
    }
    if (ins.popperJS && Object.prototype.hasOwnProperty.call(ins.popperJS, 'destroy')) {
      ins.popperJS.destroy()
    }
    const { options } = state
    const modifiers = mergeDeep(deepCopy(defaultPopperOptions), {
      ...props.popperOptions,
    })
    modifiers.arrow = {
      ...modifiers.arrow,
      enabled: props.showArrow,
    }
    options.modifiers = modifiers

    options.placement = props.placement
    options.removeOnDestroy = false
    options.onCreate = () => {
      nextTick(updatePopper)
      ctx.emit('created', ins)
    }
    ins.popperJS = new PopperJS(reference, drop, options)
    state.reference = reference
    addDropListener()
  }

  function updatePopper() {
    if (isServer || !props.visible) {
      // 存在 nextTick 中调用 updatePopper 的情况，此时 visible 有出现 false 的可能
      return
    }
    const { popperJS } = ins
    if (popperJS) {
      popperJS.enableEventListeners()
      popperJS.scheduleUpdate()
      if (!state.popperVisible) {
        PopupManage.open(ins)
        if (popperJS.popper) {
          (popperJS.popper as HTMLElement).style.zIndex = PopupManage.nextZIndex()
        }
      }
      state.popperVisible = true
    } else {
      createPopper()
    }
    ctx.emit('show')
  }

  function destroyPopper() {
    clearTimeout(ins.m_timer)
    if (ins.popperJS) {
      ins.popperJS.disableEventListeners()
    }
    state.popperVisible = false
    state.reference = undefined
    PopupManage.close(ins)
    ctx.emit('hide')
  }

  function handleEscClose() {
    props.visible && hideDrop()
  }

  function handleReferenceClick() {
    if (props.toggleOnReferenceClick || !props.visible) {
      ctx.emit('update:visible', !props.visible)
    }
  }

  function handleDocumentClick(e: Event) {
    if (!props.visible) {
      return
    }
    const reference = state.reference || getReference()
    const drop = getDrop()

    const target = e.target as HTMLElement
    if (
      (reference && reference.contains(target)) ||
      (drop && drop.contains(target))
    ) {
      return
    }
    ctx.emit('clickoutside', e)
    ctx.emit('update:visible', false)
  }

  function handlerDropMouseEnter() {
    /**
     * tofix: https://tt.sankuai.com/ticket/detail?id=4057761
     * 关闭延迟为 0 时，不可移入
     * */
    if (props.closeDelay === 0) {
      return
    }
    showDrop()
  }

  function showDrop() {
    clearTimeout(ins.m_timer)
    if (props.visible) {
      return
    }
    if (props.openDelay) {
      ins.m_timer = setTimeout(() => {
        ctx.emit('update:visible', true)
      }, props.openDelay)
    } else {
      ctx.emit('update:visible', true)
    }
  }

  function hideDrop() {
    clearTimeout(ins.m_timer)
    if (!props.visible) {
      return
    }
    if (props.closeDelay) {
      ins.m_timer = setTimeout(() => {
        ctx.emit('update:visible', false)
      }, props.closeDelay)
    } else {
      ctx.emit('update:visible', false)
    }
  }

  function addPopperListener() {
    if (props.popperDisabled) {
      return
    }
    const reference = getReference()
    if (reference) {
      switch (props.trigger) {
        case 'click':
          addClickListener(reference)
          break
        case 'hover':
          addHoverListener(reference)
          break
        case 'focus':
          // 暂时不管能否 focus
          addFocusListener(reference)
          break
      }
    }
  }
  function addClickListener(reference: HTMLElement) {
    on(reference, 'click', handleReferenceClick)
    /* 这个地方必须用 mousedown 事件替换 click 事件，
      详见: https://tt.sankuai.com/ticket/detail?id=3846583
    */
    on(document, 'mousedown', handleDocumentClick)
  }
  function addHoverListener(reference: HTMLElement) {
    on(reference, 'mouseenter', showDrop)
    on(reference, 'mouseleave', hideDrop)
  }
  function addFocusListener(reference: HTMLElement) {
    on(reference, 'focus', showDrop)
    on(reference, 'blur', hideDrop)
  }
  function addDropListener() {
    const { isDropMounted } = state
    const { popperDisabled } = props
    if (!isDropMounted || popperDisabled) {
      return
    }
    const drop = getDrop()
    if (drop) {
      switch (props.trigger) {
        case 'hover':
          addDropHoverListener(drop)
          break
      }
    }
  }
  function addDropHoverListener(drop: HTMLElement) {
    on(drop, 'mouseleave', hideDrop)
    on(drop, 'mouseenter', handlerDropMouseEnter)
  }
  function removeDropListener() {
    const drop = getDrop()
    if (drop) {
      off(drop, 'mouseleave', hideDrop)
      off(drop, 'mouseenter', showDrop)
    }
  }
  function removePopperListener() {
    const reference = getReference()

    if (reference) {
      off(reference, 'click', handleReferenceClick)
      off(reference, 'mouseleave', hideDrop)
      off(reference, 'mouseenter', showDrop)
    }
    off(document, 'mousedown', handleDocumentClick)
    removeDropListener()
  }


  watch(() => props.visible, (val) => {
    val ? updatePopper() : destroyPopper()
  })
  watch(() => props.popperDisabled, (val) => {
    val ? removePopperListener() : addPopperListener()
  })
  watch(() => props.placement, () => {
    if (ins.popperJS) {
      ins.popperJS.options.placement = props.placement
      updatePopper()
    }
  })

  /* Created */
  state.emitter.on('esc', handleEscClose)

  onMounted(() => {
    init()
  })
  onBeforeUnmount(() => {
    destroy()
  })
  onActivated(() => {
    init()
  })
  onDeactivated(() => {
    destroy()
  })

  return {
    ...state,
    updatePopper,
    destroy,
    init,
    setReferenceEl,
  }
}
