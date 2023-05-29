import {
  defineComponent,
  computed,
  ref, getSlotsInRender,
  useResetAttrs,
  useListeners,
  vHtml,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import { Popper, Drop, Reference } from '@components/popper'
import { IPopper } from '@components/popper/types'
import useControlled from '@hooks/controlled'

export default defineComponent({
  name: 'MtdTooltip',
  components: {
    Popper,
    Drop,
    Reference,
  },
  inheritAttrs: false,
  model: {
    prop: 'visible',
    event: 'update:visible',
  },
  props: {
    content: [String, Number],
    visible: Boolean,
    size: String,
    showArrow: {
      type: Boolean,
      default: true,
    },
    trigger: {
      type: String,
      default: 'hover',
    },
    popperClass: String,
    disabled: Boolean,
    theme: {
      type: String,
    },
    openDelay: {
      type: Number,
      default: 300,
    },
    placement: {
      type: String,
      default: 'bottom',
    },
    defaultVisible: Boolean,
    dangerouslyUseHTMLString: Boolean,
  },
  emits: ['update:visible'],
  setup(props, ctx) {
    const { attrs } = ctx
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('tooltip'))

    const popperRef = ref<IPopper | null>(null)

    const [visible, setVisible] = useControlled<boolean>('visible', props, ctx)

    /* Created */
    setVisible(props.defaultVisible)

    const updatePopper = () => {
      const popper = popperRef.value as IPopper
      if (visible.value && popper) {
        popper.updatePopper()
      }
    }

    // use in table
    function getPopper(): IPopper | null {
      return popperRef.value
    }

    const resetAttrs = useResetAttrs(attrs)
    const resetListeners = useListeners({
      'update:visible': (val: boolean) => {
        setVisible(val, { emit: true })
      },
    })

    return {
      prefix,
      updatePopper,
      resetListeners,
      resetAttrs,
      m_visible: visible,
      setVisible,
      getPopper,
      popperRef,
    }
  },
  render() {
    const { prefix, resetListeners, resetAttrs, m_visible,dangerouslyUseHTMLString } = this
    const { trigger, disabled, showArrow, placement,
      popperClass, size, openDelay, content, theme } = this.$props

    return <popper
      trigger={trigger}
      popperDisabled={disabled}
      visible={!disabled && m_visible}
      showArrow={showArrow}
      placement={placement}
      openDelay={openDelay}
      {...resetListeners}
      {...resetAttrs}
      ref={'popperRef'}
    >
      <reference>{getSlotsInRender(this)}</reference>
      <drop classProp={[
        prefix,
        popperClass,
        {
          [`${prefix}-${size}`]: size,
          [`${prefix}-${theme}`]: theme,
        }]}
      >

        {getSlotsInRender(this, 'content') || 
          (!dangerouslyUseHTMLString
            ? <div>{content}</div>
            : <div {...vHtml(String(content))} />)
        }
        
      </drop>
    </popper>
  },
})
