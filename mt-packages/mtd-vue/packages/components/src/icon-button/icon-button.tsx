import {
  defineComponent,
  computed,
  ref,
  onBeforeUnmount,
  getSlotsInRender,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'

import MtdIcon from '@components/icon'

export default defineComponent({
  name: 'MtdIconButton',
  components: {
    MtdIcon,
  },
  inheritAttrs: true,
  props: {
    icon: String,
    disabled: Boolean,
    htmlType: {
      type: String,
      default: 'button',
    },
    size: String,
    type: String,
  },
  emits: ['click'],
  setup(props, { emit }) {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('icon-btn'))

    let timeout = -1
    const clicked = ref(false)
    const handleClick = (e: Event) => {
      if (props.disabled) {
        return
      }
      clearTimeout(timeout)
      clicked.value = true
      timeout = setTimeout(() => {
        clicked.value = false
      }, 300)
      emit('click', e)
    }
    onBeforeUnmount(() => {
      clearTimeout(timeout)
    })
    return {
      prefix,
      handleClick,
      clicked,
    }
  },
  render() {
    const { prefix, clicked, type, size, disabled, htmlType, icon,
      handleClick } = this
    return <button
      class={[
        type ? `${prefix}-${type}` : '',
        size ? `${prefix}-${size}` : '',
        {
          [prefix]: true,
          [`${prefix}-disabled`]: disabled,
          [`${prefix}-clicked`]: clicked, // 使用 btn 的动画
        },
      ]}
      type={htmlType as any}
      disabled={disabled ? true : undefined}
      onClick={handleClick}
    >
      {getSlotsInRender(this) || <mtd-icon name={icon} />}
    </button >
  },
})
