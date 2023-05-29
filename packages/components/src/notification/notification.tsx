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
  vText,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import {
  NotificationType,
  NotificationData,
  NotificationPosition,
} from './types'
import mitt from '@utils/mitt'
import getElement from '@components/hooks/getElement'
import MtdIcon from '@components/icon'

const typeMap = {
  success: 'success-circle',
  info: 'info-circle',
  warning: 'warning-circle',
  error: 'error-circle',
}

export default defineComponent({
  name: 'MtdNotification',
  components: {
    MtdIcon,
  },
  inheritAttrs: true,
  props: {
    id: [String, Number],
    title: String,
    message: String,
    type: String as PropType<NotificationType>,
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
    position: {
      type: String as PropType<NotificationPosition>,
      default: 'top-right',
    },

    destroyed: {
      type: Function, // inject from util function
      required: true,
      default: () => { },
    },
    colorful: Boolean,
    displayTime: Boolean,
  },
  emits: [],
  setup(props, { attrs }) {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('notification'))
    const el = getElement()
    const state = reactive<NotificationData>({
      verticalOffset: attrs.verticalOffset as number || 0,
      visible: false,
      closed: false,
      timer: 0,
      zIndex: attrs.zIndex as number || 0,
      emitter: markRaw(mitt()),
      mountTime: '',
    })

    // @Computed
    const typeIcon = computed<string>(() => {
      return (
        props.icon ||
        (props.type && typeMap[props.type] || '')
      )
    })
    const computedClass = computed<Object>(() => {
      const posclass = props.position.indexOf('right') > -1 ? 'right' : 'left'
      const typeClass = props.type ? `${prefix.value}-${props.type}` : ''
      return [props.className, posclass, typeClass, attrs.class]
    })
    const verticalProperty = computed<string>(() => {
      return /^top-/.test(props.position) ? 'top' : 'bottom'
    })
    const positionStyle = computed<any>(() => {
      return {
        ...((attrs.style || {}) as Object),
        [verticalProperty.value]: `${state.verticalOffset}px`,
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
    watch(() => state.visible, (v) => {
      if (v) {
        startTimer()
      }
    })

    // @Created
    state.emitter.on('esc', handleEsc)

    // @Mounted
    onMounted(() => {
      state.visible = true
    })

    state.mountTime = new Date().toLocaleTimeString()

    // @Methods
    function destroyElement() {
      if (el.value) {
        el.value.removeEventListener('transitionend', destroyElement)
        el.value.parentNode?.removeChild(el.value);
        (props.destroyed as any)() // 🤡 function props 怎么处理
      }
    }

    function close() {
      state.closed = true
      typeof props.onClose === 'function' && props.onClose() // 🤡 isFunction 怎么说明onClose 已经存在
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
      typeIcon, computedClass, positionStyle,
      clearTimer, startTimer, close,
    }
  },
  render() {
    const {
      typeIcon, title, visible, message, showClose, mountTime, displayTime,
      prefix, computedClass, positionStyle, dangerouslyUseHTMLString, colorful,
    } = this

    return <Transition name={`${prefix}-fade`} enter-from-class={`${prefix}-fade` + '-enter'}>
      <div
        class={[
          prefix,
          computedClass,
          {
            [`${prefix}-colorful`]: colorful,
          },
        ]}
        v-show={visible}
        style={positionStyle}
        onMouseenter={this.clearTimer}
        onMouseleave={this.startTimer}
      >
        {typeIcon &&
          <mtd-icon class={`${prefix}-icon`} name={typeIcon} />
        }
        <div class={`${prefix}-group`}>
          <div class={`${prefix}-title`} {...vText(title)} />
          {displayTime &&
            <div class={`${prefix}-time`} {...vText(mountTime)} />
          }
          <div class={`${prefix}-content`} v-show={message}>
            {getSlotsInRender(this) || <span>
              {!dangerouslyUseHTMLString
                ? <div>{message}</div>
                : <div {...vHtml(message)} />}
            </span>}
          </div>
          {showClose && <mtd-icon
            class={`${prefix}-close`}
            name="close"
            onClick={this.close}
          />}
        </div>
      </div>
    </Transition >
  },
})
