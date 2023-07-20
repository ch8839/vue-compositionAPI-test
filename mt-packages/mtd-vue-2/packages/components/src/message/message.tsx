import {
  defineComponent,
  PropType,
  computed,
  reactive,
  toRefs,
  markRaw,
  watch,
  onMounted,
  Transition,
  getSlotsInRender,
  vHtml,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import { MessageType } from './types'
import mitt from '@utils/mitt'
import getElement from '@components/hooks/getElement'
import { isFunction } from '@utils/type'
import MtdIcon from '@components/icon'

const typeMap = {
  success: 'success-circle',
  info: 'info-circle',
  warning: 'warning-circle',
  error: 'error-circle',
  loading: 'loading',
}

export default defineComponent({
  name: 'MtdMessage',
  components: {
    MtdIcon,
  },
  inheritAttrs: true,
  props: {
    id: [String, Number],
    message: String,
    type: String as PropType<MessageType>,
    className: String,
    icon: String,
    dangerouslyUseHTMLString: Boolean,
    duration: {
      type: Number,
      default: 3000,
    },
    showClose: {
      type: Boolean,
      default: true,
    },
    onClose: Function,
    offset: Number,
    colorful: Boolean,
    destroyed: {
      type: Function, // inject from util function
      required: true,
    },
  },
  emits: [],
  setup(props, { attrs }) {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('message'))
    const iconPrefix = config.getIconCls
    const el = getElement()
    const state = reactive({
      visible: false,
      closed: false,
      verticalProperty: 'top',
      timer: 0,
      zIndex: attrs.zIndex as number || 0,
      emitter: markRaw(mitt()),
      verticalOffset: attrs.verticalOffset as number || 0,
    })

    // @Computed
    const typeIcon = computed<string>(() => {
      return (
        props.icon ||
        (props.type && typeMap[props.type] ? iconPrefix(typeMap[props.type]) : '')
      )
    })
    const positionStyle = computed<any>(() => {
      return {
        ...((attrs.style || {}) as Object),
        [state.verticalProperty]: `${state.verticalOffset}px`,
        'z-index': state.zIndex,
      }
    })

    // @Watch
    watch(() => state.closed, (newVal) => {
      if (newVal) {
        state.visible = false
        el.value?.addEventListener('transitionend', destroyElement)
      }
    })

    // @Created
    state.emitter.on('esc', handleEsc)

    // @Mounted
    onMounted(() => {
      state.visible = true
      startTimer()
    })

    // @Methods
    function destroyElement() {
      if (el.value) {
        el.value.removeEventListener('transitionend', destroyElement)
        if (el.value.remove) {
          el.value.remove()
        } else if ((el.value as any).removeNode) {
          // to fix ie
          (el.value as any).removeNode()
        }
        (props.destroyed as any)()
      }
    }

    function close() {
      state.closed = true
      isFunction(props.onClose) && props.onClose()
    }

    function clearTimer() {
      clearTimeout(state.timer)
    }

    function startTimer() {
      if (props.duration > 0) {
        // 定时关闭通知
        state.timer = setTimeout(() => {
          if (!state.closed) {
            close()
          }
        }, props.duration)
      }
    }

    function handleEsc(e: KeyboardEvent) {
      e.stopPropagation()
      if (!state.closed) {
        close()
      }
    }

    return {
      prefix,
      ...toRefs(state),
      typeIcon, positionStyle,
      clearTimer, startTimer, close,
    }
  },
  render() {
    const {
      typeIcon, visible, message, showClose,
      prefix, positionStyle, dangerouslyUseHTMLString, colorful, type, className,
    } = this
    return <Transition name={`${prefix}-fade`} enter-from-class={`${prefix}-fade` + '-enter'}>
      <div
        class={[
          prefix, className,
          {
            [`${prefix}-${type}`]: type,
            [`${prefix}-closable`]: showClose,
            [`${prefix}-colorful`]: colorful,
          },
        ]}
        v-show={visible}
        style={positionStyle}
        onMouseenter={this.clearTimer}
        onMouseleave={this.startTimer}
      >
        <div class={`${prefix}-content-wrapper`}>
          {typeIcon &&
            <i class={[typeIcon, `${prefix}-icon`]} />
          }

          {getSlotsInRender(this) || <span>
            {!dangerouslyUseHTMLString
              ? <div class={`${prefix}-content`}>{message}</div>
              : <div class={`${prefix}-content`} {...vHtml(message)} />}
          </span>}
        </div>

        {showClose &&
          <mtd-icon
            class={`${prefix}-close`}
            name="close"
            onClick={this.close}
          />
        }
      </div>
    </Transition >
  },
})
