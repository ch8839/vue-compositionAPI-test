import {
  defineComponent,
  PropType,
  ref,
  computed,
  reactive,
  markRaw,
  onBeforeUnmount,
  onDeactivated,
  onMounted,
  onActivated,
  watch,
  toRefs,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import { lock, unlock } from '@utils/lock-scroll'
import { PopupManage, getDefaultPopupContainer } from '@utils/popper'
import DrawerInside from './inside'
import mitt from '@utils/mitt'
import { DrawerPlacement } from './types'
import vueInstance from '@components/hooks/instance'
import { useAttrs, useClassStyle } from '@components/hooks/pass-through'
import Teleport from '@components/teleport'

const useRemove = () => {
  const removable = ref<null | HTMLElement>(null)

  const remove = () => {
    const { value } = removable
    if (!value) return
    const parentNode = value.parentNode
    parentNode && parentNode.removeChild(value)
  }

  return {
    removable,
    remove,
  }
}

type getPopupContainerType = () => any

export default defineComponent({
  name: 'MtdDrawer',
  components: {
    DrawerInside,
    Teleport,
  },
  inheritAttrs: false,
  model: {
    prop: 'visible',
    event: 'update:visible',
  },
  props: {
    placement: {
      type: String as PropType<DrawerPlacement>,
      default: 'right',
      validator: (p: string): boolean => {
        return ['left', 'right', 'top', 'bottom'].indexOf(p) > -1
      },
    },
    visible: {
      type: Boolean,
      default: false,
    },
    closable: {
      type: Boolean,
      default: true,
    },
    appendToContainer: {
      type: Boolean,
      default: true,
    },
    mask: {
      type: Boolean,
      default: true,
    },
    maskClosable: {
      type: Boolean,
      default: true,
    },
    lockScroll: {
      type: Boolean,
      default: true,
    },
    getPopupContainer: {
      type: Function as PropType<getPopupContainerType>,
      default: getDefaultPopupContainer,
    },
    destroyOnClose: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close', 'update:visible', 'open'],
  setup(props, { emit, attrs }) {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('drawer'))
    const ins = vueInstance()
    const classStyle = useClassStyle()

    const removableRef = ref<HTMLElement | null>(null)

    const state = reactive({
      drawVisible: props.visible,
      zIndex: '2000',
      emitter: markRaw(mitt()),
    })

    // @Created
    state.emitter.on('esc', handleEscClose)
    const { removable, remove } = useRemove()

    // @Computed
    const resetAttrs = useAttrs(attrs)

    // @Watch
    watch(() => props.visible, (val) => {
      val ? openDrawer() : closeDrawer()
    })

    // @Methods
    function handleClickClose() {
      emit('update:visible', false)
      emit('close')
    }

    function handleEscClose() {
      props.visible && props.closable && handleClickClose()
    }

    function openDrawer() {
      state.drawVisible = true
      state.zIndex = PopupManage.nextZIndex()
      PopupManage.open(ins)
      if (props.lockScroll) {
        lock(document.body)
      }
      emit('open')
    }

    function closeDrawer() {
      PopupManage.close(ins)
      if (props.lockScroll) {
        unlock(document.body)
      }
    }

    function init() {
      if (props.visible) {
        openDrawer()
      }
    }
    onMounted(init)
    onActivated(init)

    function destory() {
      closeDrawer()
      remove()
    }
    onDeactivated(destory)
    onBeforeUnmount(destory)

    function handleAfterLeave() {
      if (props.destroyOnClose) {
        state.drawVisible = false
      }
    }

    function handleMaskClick() {
      if (props.maskClosable) {
        handleClickClose()
      }
    }

    return {
      prefix,
      ...toRefs(state),
      removable,
      handleClickClose,
      handleAfterLeave,
      handleMaskClick,
      removableRef,
      resetAttrs,
      classStyle,
    }
  },
  render() {
    const {
      prefix, getPopupContainer, appendToContainer, resetAttrs, visible, mask,
      zIndex, placement, closable, drawVisible, classStyle,
    } = this

    return <teleport to={getPopupContainer()} disabled={!appendToContainer}>
      <div ref={'removableRef'} {...resetAttrs} {...classStyle}>
        {/* 遮罩层 */}
        <transition name="fade-in">
          <div
            v-show={visible}
            class={mask ? `${prefix}-mask` : `${prefix}-wrapper`}
            style={{ 'z-index': zIndex }}
            onClick={this.handleMaskClick}
          />
        </transition>
        <transition
          name={`fade-in-${placement}`}
          onAfterLeave={this.handleAfterLeave}
        >
          {drawVisible && <DrawerInside
            v-show={visible}
            {...resetAttrs}
            placement={placement}
            closable={closable}
            zIndex={zIndex}
            onClose={this.handleClickClose}
          >
            <template slot="title">
              {this.$slots.title}
            </template>
            <template slot="footer">
              {this.$slots.footer}
            </template>
            {this.$slots.default}
          </DrawerInside>}
        </transition >
      </div >
    </teleport >
  },
})
