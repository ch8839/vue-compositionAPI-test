import {
  defineComponent,
  computed,
  ref,
  classNames, styles,
  useAllAttrs, useResetAttrs,
  getSlotsInRender, vSlots,
  Fragment,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import MtdPopover from '@components/popover'
import MtdButton from '@components/button'
import { IPopper } from '@components/popper/types'
import { usePopconfirm } from './usePopconfirm'
import MtdIcon from '@components/icon'

export default defineComponent({
  name: 'MtdPopconfirm',
  components: {
    MtdPopover,
    MtdButton,
    MtdIcon,
  },
  inheritAttrs: false,
  model: {
    prop: 'visible',
    event: 'update:visible',
  },
  props: {
    title: String,
    message: String,
    icon: {
      type: String,
      default: 'warning-circle',
    },
    okButtonText: {
      type: String,
      default: '确定',
    },
    cancelButtonText: {
      type: String,
      default: '取消',
    },
    okButtonProps: Object,
    cancelButtonProps: Object,
    defaultVisible: {
      type: Boolean,
      default: false,
    },
    visible: Boolean,
  },
  emits: ['ok', 'cancel', 'update:visible'],
  setup(props, ctx) {
    const { emit } = ctx
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('popconfirm'))
    const prefixPopover = computed(() => config.getPrefixCls('popover'))
    const popoverRef = ref<IPopper | null>(null)
    const allAttrs = useAllAttrs(ctx as any)

    const popconfirmHook = usePopconfirm(props, ctx)

    const okProps = useResetAttrs({
      type: 'danger',
      size: 'small',
      ...props.okButtonProps,
    })
    const cancelProps = useResetAttrs({
      size: 'small',
      ...props.cancelButtonProps,
    })

    function ok() {
      emit('ok')
      popconfirmHook.handleInput(false)
    }
    function cancel() {
      emit('cancel')
      popconfirmHook.handleInput(false)
    }
    function handleVisibleChange(v: boolean) {
      popconfirmHook.handleInput(v)
    }
    function updatePopper() {
      popoverRef.value!.updatePopper()
    }

    const computedCollection = {
      okProps, cancelProps, prefixPopover,
    }
    const methodsCollection = {
      ok, cancel, handleVisibleChange, updatePopper,
    }

    return {
      prefix, allAttrs,
      ...computedCollection,
      ...methodsCollection,
      ...popconfirmHook,
    }
  },
  render() {
    const {
      prefix, prefixPopover, allAttrs, icon, title, message, cancelProps, cancelButtonText,
      okButtonText, okProps, m_visible,
    } = this

    const slots = {
      content: () => <Fragment>
        <div class={`${prefix}-inner`}>
          {icon &&
            <span class={`${prefix}-icon ${prefixPopover}-icon`}><MtdIcon name={icon} /></span>
          }
          <div class={`${prefix}-content`}>
            {(getSlotsInRender(this, 'title') || title) &&
              <div class={`${prefixPopover}-title`}>
                {getSlotsInRender(this, 'title') || title}
              </div>
            }
            {(getSlotsInRender(this, 'message') || message) &&
              <div class={`${prefix}-message`}>
                {getSlotsInRender(this, 'message') || message}
              </div>
            }
          </div>
        </div>
        <div class={`${prefix}-actions`}>
          <mtd-button {...cancelProps} onClick={this.cancel}>{
            cancelButtonText
          }</mtd-button>
          <mtd-button {...okProps} onClick={this.ok} >{okButtonText}</mtd-button>
        </div>
      </Fragment>,
    }

    return <mtd-popover
      {...allAttrs}
      popper-class={prefix}
      ref="popoverRef"
      visible={m_visible}
      on={{
        ['update:visible']: this.handleVisibleChange,
      }}
      class={classNames(this)}
      style={styles(this)}
      v-slots={slots}
      {...vSlots(slots)}
    >
      {getSlotsInRender(this)}
    </mtd-popover >
  },
})
