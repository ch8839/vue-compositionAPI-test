import { defineComponent, computed, PropType, getSlotsInRender } from '@ss/mtd-adapter'
import { TagSize, TagTheme, TagType } from './types'
import useConfig from '@hooks/config'
import MtdIcon from '@components/icon'

export default defineComponent({
  name: 'MtdTag',
  components: {
    MtdIcon,
  },
  inheritAttrs: true,
  props: {
    size: {
      type: String as PropType<TagSize>,
      default: 'normal',
    },
    theme: {
      type: String as PropType<TagTheme>,
      default: 'normal-color',
    },
    closeable: Boolean, // 兼容历史
    closable: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String as PropType<TagType>,
      default: 'fuzzy',
    },
    rounded: Boolean,
    prefixIcon: String,
  },
  emits: ['close', 'click'],
  setup(props, { attrs, emit, slots }) {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('tag'))
    const className = computed(() => {
      const pre = prefix.value
      return {
        [`${pre}-${props.theme}`]: props.theme,
        [`${pre}-${props.size}`]: props.size,
        [`${pre}-rounded`]: props.rounded,
        [`${pre}-${props.type}`]: props.type,
        [`${pre}-closable`]: props.closable,
        [`${pre}-prefix`]: hasPrefix.value,
        [`${pre}-disabled`]: props.disabled,
        [`${pre}-clickable`]: attrs.onClick, //!!me?.vnode?.props?.onClick //
      }
    })
    const canClosed = computed(() => props.closeable || props.closable)
    const hasPrefix = computed(() => !!(props.prefixIcon || slots.prefix))
    const handleClose = (e: Event) => {
      e.preventDefault()
      e.stopPropagation()
      if (props.disabled) {
        return false
      }
      emit('close', e)
    }
    const handleClick = (e: Event) => {
      e.preventDefault()
      if (props.disabled) {
        return false
      }
      emit('click', e)
    }
    return {
      className,
      prefix,
      canClosed,
      hasPrefix,
      handleClose,
      handleClick,
    }
  },
  render() {
    const {
      className,
      prefix,
      handleClick,
      handleClose,
      canClosed,
      hasPrefix,
    } = this
    const { prefixIcon } = this.$props
    return (
      <span class={[`${prefix}`, className]} onClick={handleClick}>
        <span class={`${prefix}-content`}>
          {hasPrefix && (
            <span class={`${prefix}-content-prefix`}>
              {getSlotsInRender(this, 'prefix') || <i class={prefixIcon} />}
            </span>
          )}
          {getSlotsInRender(this)}
        </span>
        {canClosed && (
          <div class={`${prefix}-close`} onClick={handleClose}>
            <mtd-icon name={'close'} class={`${prefix}-close-icon`} />
          </div>
        )}
      </span>
    )
  },
})
