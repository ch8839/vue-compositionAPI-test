import {
  defineComponent,
  PropType,
  computed,
  toRefs,
  reactive,
  onMounted,
  nextTick,
  ref,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import MtdModal from '@components/modal'
import MtdButton from '@components/button'
import { isPromise } from '@utils/type'
import { useAttrs } from '@components/hooks/pass-through'
import { AnyTypeFun } from '@components/upload/types'
import vueInstance from '@components/hooks/instance'
import { CPI } from '@components/types/component'
import MtdIcon from '@components/icon'

const ICONS: { [key: string]: string | undefined } = {
  success: 'success-circle',
  info: 'info-circle',
  warning: 'warning-circle',
  error: 'error-circle',
}

export default defineComponent({
  name: 'MtdConfirm',
  components: {
    MtdModal,
    MtdButton,
    MtdIcon,
  },
  inheritAttrs: true,
  props: {
    type: String,
    className: String,
    title: String,
    width: [Number, String],
    message: String,
    okButtonProps: Object,
    okButtonText: {
      type: String,
      default: '确定',
    },
    cancelButtonProps: Object,
    cancelButtonText: {
      type: String,
      default: '取消',
    },
    showOkButton: {
      type: Boolean,
      default: true,
    },
    showCancelButton: Boolean,
    closable: {
      type: Boolean,
      default: true,
    },
    maskClosable: Boolean,
    onOk: {
      type: Function as PropType<AnyTypeFun>,
      required: true,
    },
    onCancel: {
      type: Function as PropType<AnyTypeFun>,
      required: true,
    },
    dangerouslyUseHTMLString: Boolean,
    getPopupContainer: Function as PropType<AnyTypeFun>,
    destroyed: {
      type: Function as PropType<AnyTypeFun>, // inject from util function
      required: true,
    },
  },
  setup(props) {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('confirm'))
    const ins = vueInstance()
    const okRef = ref<CPI | null>(null)
    const cancelRef = ref<CPI | null>(null)

    const state = reactive({
      modalVisible: true,
      placement: undefined,
      okButtonLoading: false,
      cancelButtonLoading: false,
    })

    const okProps = useAttrs({
      type: 'primary',
      ...props.okButtonProps,
    })
    const cancelProps = useAttrs(props.cancelButtonProps)
    const icon = computed(() => ICONS[props.type!])

    // @Methods
    function handleCancel() {
      callbackWrapper(
        props.onCancel,
        { action: 'cancel' },
        'cancelButtonLoading',
      )
    }
    function handleVisibleChange(v: boolean) {
      state.modalVisible = v // v-model
      if (!v) {
        // 参照 ant-design 的处理逻辑，目前点击蒙层、x、esc 触发的关闭不会被阻止
        props.onCancel && props.onCancel({ action: 'close' })
      }
      state.modalVisible = v
    }
    function handleOk() {
      callbackWrapper(props.onOk, { action: 'confirm' }, 'okButtonLoading')
    }
    function close() {
      state.modalVisible = false
    }
    function callbackWrapper(fn: Function, params: any, prop: string) {
      const result = fn && fn(params)
      if (isPromise(result)) {
        ins[prop] = true
        const reset = () => {
          ins[prop] = false
        };
        (result as Promise<any>).then(close, reset)
        return
      }
      close()
    }

    onMounted(() => {
      state.modalVisible = true
      nextTick(() => {
        if (okRef.value) {
          (okRef.value as any).focus()
        } else if (cancelRef.value) {
          (cancelRef.value as any).focus()
        }
      })
    })

    const computedCollection = {
      okProps, cancelProps, icon,
    }
    const methodsCollection = {
      handleVisibleChange, handleOk, handleCancel, close, callbackWrapper,
    }

    return {
      prefix, okRef, cancelRef,
      ...toRefs(state),
      ...computedCollection,
      ...methodsCollection,
    }
  },
  render() {
    const {
      prefix, maskClosable, placement, closable, className, type, width, destroyed, cancelProps,
      title, icon, dangerouslyUseHTMLString, message, cancelButtonText, okButtonText, okProps,
      showCancelButton, showOkButton, cancelButtonLoading, okButtonLoading,
    } = this

    return <mtd-modal
      modelValue={this.modalVisible}
      onInput={this.handleVisibleChange}
      mask-closable={maskClosable}
      placement={placement}
      closable={closable}
      class={{
        [`${prefix}-wrapper`]: true,
        [`${className}`]: className,
        [`${prefix}-wrapper-${type}`]: type,
      }}
      width={width}
      title={type ? undefined : title}
      onClosed={destroyed}
    >
      <div class={{
        [prefix]: true,
        [`${prefix}-typed`]: type,
      }}>
        {type &&
          <span class={[`${prefix}-icon`, `${prefix}-${type}`]}  >
            <mtd-icon name={icon} />
          </span>
        }
        <div class={`${prefix}-right`}>
          {(type && title) &&
            <div class={`${prefix}-title`}>
              {title}
            </div>
          }
          {this.$slots.default ||
            ((!dangerouslyUseHTMLString)
              ? <div class={`${prefix}-message`}> {message}</div>
              : <div domPropsInnerHTML={message} class={`${prefix}-message`} />
            )
          }
        </div>
      </div >
      <template slot="footer">
        <div class={`${prefix}-footer`}>
          {showCancelButton &&
            <mtd-button
              {...cancelProps}
              loading={cancelButtonLoading}
              onClick={this.handleCancel}
              ref="cancelRef"
            >
              {cancelButtonText}
            </mtd-button>
          }
          {showOkButton &&
            <mtd-button
              {...okProps}
              loading={okButtonLoading}
              onClick={this.handleOk}
              ref="okRef"
            >
              {okButtonText}
            </mtd-button>
          }
        </div >
      </template>
    </mtd-modal>
  },
})
