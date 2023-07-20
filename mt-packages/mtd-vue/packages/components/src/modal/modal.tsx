import {
  defineComponent,
  PropType,
  computed,
  reactive,
  markRaw,
  watch,
  onMounted,
  onActivated,
  onDeactivated,
  onUnmounted,
  toRefs,
  ref,
  onBeforeUnmount, classNames, styles,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import { lock, unlock } from '@utils/lock-scroll'
import { PopupManage, getDefaultPopupContainer } from '@utils/popper'
import ModalInside from './inside'
import mitt from '@utils/mitt'
import { hasClass } from '@utils/dom'
import vueInstance from '@components/hooks/instance'
import { useAttrs } from '@components/hooks/pass-through'
import Teleport from '@components/teleport'
import { getPopupContainer } from './types'
import { isNumber } from '@utils/type'
import getElement from '@components/hooks/getElement'

export default defineComponent({
  name: 'MtdModal',
  components: {
    ModalInside,
    Teleport,
  },
  inheritAttrs: false,
  model: {
    prop: 'modelValue',
    event: 'update:modelValue',
  },
  props: {
    appendToContainer: {
      type: Boolean,
      default: true,
    },
    getPopupContainer: {
      type: Function as PropType<getPopupContainer>,
      default: getDefaultPopupContainer,
    },
    mask: {
      type: Boolean,
      default: true,
    },
    closable: {
      type: Boolean,
      default: true,
    },
    maskClosable: {
      type: Boolean,
      default: false,
    },
    fullscreen: Boolean,
    modelValue: Boolean,
    destroyOnClose: Boolean,
    lockScroll: {
      type: Boolean,
      default: true,
    },
    placement: {
      type: String,
      validator: (v: string) => {
        return ['top', 'center'].indexOf(v) > -1
      },
      default: 'center',
    },
    width: [String, Number],
    mountOnCreate: {
      type: Boolean,
      default: false,
    },
    drag: Boolean,
  },
  emits: ['close', 'closed', 'open', 'opened', 'input'], // 🦋 input % update:modelValue
  setup(props, { attrs, emit }) {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('modal'))
    const prefixMTD = computed(() => config.getPrefix())

    const ins = vueInstance()
    const el = getElement()
    const resetAttrs = useAttrs(attrs)
    const maskRef = ref<HTMLElement | null>(null)

    const state = reactive({
      modalVisible: !props.mountOnCreate ? props.modelValue : true,
      wrapVisible: props.modelValue,
      zIndex: '2000',
      emitter: markRaw(mitt()),
    })

    // @Created
    state.emitter.on('esc', handleEscClose)

    // @Mounted
    onMounted(() => { init() })
    onActivated(() => { init() })
    onDeactivated(() => { init() })
    onUnmounted(() => { init() })

    // @Computed
    const modalWidth = computed(() => {
      return props.width
        ? isNumber(props.width)
          ? `${props.width}px`
          : (props.width as string)
        : undefined
    })

    // @Watch
    watch(() => props.modelValue, (val) => {
      val ? openModal() : closeModal()
    })

    onBeforeUnmount(() => {
      destroy()
    })
    onDeactivated(() => {
      destroy()
    })

    // @Methods
    function init() {
      if (props.modelValue) {
        openModal()
      }
    }
    function destroy() {
      closeModal()
      el.value?.remove()
    }
    function openModal() {
      state.modalVisible = true
      state.wrapVisible = true
      state.zIndex = PopupManage.nextZIndex()
      PopupManage.open(ins)
      if (props.lockScroll) {
        lock(document.body)
      }
      emit('open')
    }
    function closeModal() {
      PopupManage.close(ins)
      if (props.lockScroll) {
        unlock(document.body)
      }
    }
    function close() {
      emit('close')
      emit('input', false)
      emit('update:modelValue', false)
    }
    function handleAfterLeave() {
      if (props.destroyOnClose) {
        state.modalVisible = false
      }
      state.wrapVisible = false
      emit('closed')
    }
    function handleAfterEnter() {
      emit('opened')
    }
    function handleMaskClick() {
      props.maskClosable && props.modelValue && close()
    }
    function handleClose() {
      props.modelValue && close()
    }
    function handleWrapClick(event: Event) { // 🤡
      if (hasClass(event.target as HTMLElement, `${prefixMTD.value}-modal-wrapper`)) {
        handleMaskClick()
      }
    }
    function handleEscClose() {
      props.modelValue && props.closable && close()
    }

    const computedCollection = {
      modalWidth,
    }
    const methodsCollection = {
      handleMaskClick,
      handleWrapClick,
      handleAfterEnter,
      handleAfterLeave,
      handleClose,
      destroy,
    }


    return {
      ...toRefs(state),
      ...computedCollection,
      ...methodsCollection,
      prefix, resetAttrs,
      maskRef, prefixMTD,
    }
  },
  render() {
    const {
      prefix, resetAttrs, modalVisible, zIndex,
      modelValue, mask, wrapVisible, placement, closable, fullscreen, modalWidth, drag,
    } = this

    return <div
      class={classNames(this)}
      style={styles(this)}
    >
      {/* 遮罩层 */}
      {mask &&
        <transition name="fade-in">
          <div
            v-show={modelValue}
            ref={'maskRef'}
            class={`${prefix}-mask`}
            style={{ 'z-index': zIndex }}
            onClick={this.handleMaskClick}
          />
        </transition>
      }

      <div
        class={{
          [`${prefix}-wrapper`]: true,
          [`${prefix}-${placement}`]: placement,
          [`${prefix}-drag`]: drag,
        }}

        v-show={wrapVisible}
        style={{ 'z-index': zIndex }}
        onClick={this.handleWrapClick}
      >
        <transition
          name="modal-fade"
          appear
          onAfterEnter={this.handleAfterEnter}
          onAfterLeave={this.handleAfterLeave}
        >
          {modalVisible &&
            <modal-inside
              {...resetAttrs}
              closable={closable}
              drag={drag && !mask}
              class={{
                [`${prefix}-fullscreen`]: fullscreen,
              }}
              style={{ width: modalWidth }}
              v-show={modelValue}
              visible={modelValue}
              onClose={this.handleClose}
            >

              {this.$slots.title &&
                <template slot="title">
                  {this.$slots.title}
                </template>
              }

              {this.$slots.default}

              {this.$slots.footer &&
                <template slot="footer">
                  {this.$slots.footer}
                </template>
              }
            </modal-inside>
          }
        </transition>
      </div >
    </div >
  },
})
