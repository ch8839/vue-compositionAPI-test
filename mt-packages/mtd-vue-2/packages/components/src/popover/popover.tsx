import {
  defineComponent,
  computed,
  ref, classNames, styles,
  getSlotsInRender, useResetAttrs, useListeners,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import { Popper, Drop, Reference } from '@components/popper'
import { IPopper } from '@components/popper/types'
import useControlled from '@hooks/controlled'

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
    openDelay: {
      type: Number,
      default: 300,
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

    const restAttrs = useResetAttrs(ctx.attrs)

    const [visible, setVisible] = useControlled<boolean>('visible', props, ctx)

    /* Created */
    setVisible(props.defaultVisible)

    const updatePopper = () => {
      const popper = popperRef.value as IPopper
      if (visible.value && popper) {
        popper.updatePopper()
      }
    }
    const restListeners = useListeners({
      'update:visible': (val: boolean) => {
        setVisible(val, { emit: true })
      },
    })

    return {
      prefix,
      updatePopper,
      restListeners, restAttrs,
      popperRef,
      m_visible: visible,
    }
  },
  render() {
    const { prefix, restListeners, m_visible, restAttrs } = this
    const { trigger, disabled, placement, showArrow, title,
      popperClass, size, transition, content } = this.$props

    return <popper
      trigger={trigger}
      popperDisabled={disabled}
      placement={placement}
      visible={!disabled && m_visible}
      showArrow={showArrow}
      ref={'popperRef'}
      class={classNames(this)}
      style={styles(this)}
      {...restListeners}
      {...restAttrs}
    >
      <reference>
        {getSlotsInRender(this)}
      </reference>
      <drop
        classProp={[prefix, popperClass, { [`${prefix}-${size}`]: size }]}
        transition={transition}
      >
        {(getSlotsInRender(this, 'title') || title) && <div class={`${prefix}-title`} >
          {getSlotsInRender(this, 'title') || title}
        </div>}
        {getSlotsInRender(this, 'content') || content}
      </drop>
    </popper>
  },
})
