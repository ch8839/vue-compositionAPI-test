import {
  defineComponent,
  computed,
  ref, classNames, styles,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import { Popper, Drop, Reference } from '@components/popper'
import { IPopper } from '@components/popper/types'
import { useAttrs, useListeners } from '@components/hooks/pass-through'
import { usePopover } from './usePopover'

export default defineComponent({
  name: 'MtdPopover',
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
    title: String,
    content: String,
    size: {
      type: String,
      default: 'small',
    },
    showArrow: {
      type: Boolean,
      default: true,
    },
    trigger: {
      type: String,
      default: 'click',
    },
    placement: {
      type: String,
      default: 'bottom',
    },
    transition: String,
    popperClass: String,
    disabled: Boolean,
    defaultVisible: Boolean,
    visible: Boolean,
  },
  setup(props, ctx) {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('popover'))
    const popperRef = ref<IPopper | null>(null)

    const restAttrs = useAttrs(ctx.attrs)

    const usePopoverHook = usePopover(props, ctx)
    const { _visible, setVisible } = usePopoverHook

    const updatePopper = () => {
      const popper = popperRef.value as IPopper
      if (_visible && popper) {
        popper.updatePopper()
      }
    }
    const myListeners = useListeners({
      'update:visible': (val: boolean) => {
        setVisible(val)
      },
    })

    return {
      prefix,
      updatePopper,
      myListeners, restAttrs,
      popperRef,
      ...usePopoverHook,
    }
  },
  render() {
    const { prefix, myListeners, _visible, restAttrs } = this
    const { trigger, disabled, placement, showArrow,
      popperClass, size, transition, content, title } = this.$props
    return <popper
      trigger={trigger}
      popperDisabled={disabled}
      placement={placement}
      visible={!disabled && _visible}
      showArrow={showArrow}
      ref={'popperRef'}
      class={classNames(this)}
      style={styles(this)}
      {...myListeners}
      {...restAttrs}
    >
      <reference>{this.$slots.default}</reference>
      <drop
        classProp={[prefix, popperClass, { [`${prefix}-${size}`]: size }]}
        transition={transition}
      >
        {(this.$slots.title || title) && <div class={`${prefix}-title`} >
          {this.$slots.title || title}
        </div>}
        {this.$slots.content || content}
      </drop>
    </popper>
  },
})
