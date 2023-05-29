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
  getSlotsInRender,
  useResetAttrs,
  Transition,
  vSlots,
  classNames,
  styles,
  vueInstance,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import { lock, unlock } from '@utils/lock-scroll'
import { PopupManage, getDefaultPopupContainer } from '@utils/popper'
import DrawerInside from './inside'
import mitt from '@utils/mitt'
import { DrawerPlacement } from './types'
import teleportHook from '@components/hooks/teleport'

type getPopupContainerType = () => any

export default defineComponent({
  name: 'MtdDrawer',
  components: {
    DrawerInside,
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

    const removableRef = ref<HTMLElement | null>(null)

    const state = reactive({
      drawVisible: props.visible,
      zIndex: '2000',
      emitter: markRaw(mitt()),
    })

    const { createTele, destroyTele } = teleportHook(props)

    // @Created
    state.emitter.on('esc', handleEscClose)

    // @Computed
    const resetAttrs = useResetAttrs(attrs)

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
      createTele()
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
      destroyTele()
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
      handleClickClose,
      handleAfterLeave,
      handleMaskClick,
      removableRef,
      resetAttrs,
    }
  },
  render() {
    const {
      prefix, resetAttrs, visible, mask,
      zIndex, placement, closable, drawVisible,
    } = this

    const slots = {
      title: getSlotsInRender(this, 'title') ? () => getSlotsInRender(this, 'title') : undefined,
      footer: getSlotsInRender(this, 'footer') ? () => getSlotsInRender(this, 'footer') : undefined,
    }

    return <div
      class={classNames(this, [prefix + '-container'])}
      style={styles(this)}
    >
      {/* 遮罩层 */}
      <Transition name="fade-in" enter-from-class={'fade-in' + '-enter'}>
        <div
          v-show={visible}
          class={mask ? `${prefix}-mask` : `${prefix}-wrapper`}
          style={{ 'z-index': zIndex } as any}
          onClick={this.handleMaskClick}
        />
      </Transition>
      <Transition
        name={`fade-in-${placement}`}
        enter-from-class={'fade-in' + '-enter'}
        onAfterLeave={this.handleAfterLeave}
      >
        {drawVisible &&
          <DrawerInside
            v-show={visible}
            {...resetAttrs}
            placement={placement}
            closable={closable}
            zIndex={zIndex}
            onClose={this.handleClickClose}
            {...vSlots(slots)}
            v-slots={slots}
          >
            {getSlotsInRender(this)}
          </DrawerInside>}
      </Transition >
    </div >
  },
})
