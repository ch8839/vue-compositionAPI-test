import {
  defineComponent,
  computed,
  ref,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import { Popper, Drop, Reference } from '@components/popper'
import { IPopper } from '@components/popper/types'
import { useAttrs, useListeners } from '@components/hooks/pass-through'
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

    const myAttrs = useAttrs(attrs)
    const myListeners = useListeners({
      'update:visible': (val: boolean) => {
        setVisible(val)
      },
    })

    return {
      prefix,
      updatePopper,
      myListeners,
      myAttrs,
      _visible: visible,
      setVisible,
      getPopper,
      popperRef,
    }
  },
  render() {
    const { prefix, myListeners, myAttrs, _visible } = this
    const { trigger, disabled, showArrow, placement,
      popperClass, size, openDelay, content, theme } = this.$props
    return <popper
      trigger={trigger}
      popperDisabled={disabled}
      visible={!disabled && _visible}
      showArrow={showArrow}
      placement={placement}
      openDelay={openDelay}
      {...myListeners}
      {...myAttrs}
      ref={'popperRef'}
    >
      <reference>{this.$slots.default}</reference>
      <drop
        classProp={[prefix, popperClass, { [`${prefix}-${size}`]: size, [`${prefix}-${theme}`]: theme }]}
      >
        {this.$slots.content || content}
      </drop>
    </popper>
  },
})
