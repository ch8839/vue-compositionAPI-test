import {
  defineComponent,
  computed,
  ref,
  markRaw,
  watch,
  onMounted,
  getSlotsInRender,
  useResetAttrs,
  useListeners,
  getElementFromComponent,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import { Popper, Drop, Reference } from '@components/popper'
import { IPopper } from '@components/popper/types'
import mitt from '@utils/mitt'
import { useDropdown } from './useDropdown'
import useProvide from './useProvide'

//得接收class

export default defineComponent({
  name: 'MtdDropdown',
  components: {
    Popper,
    Drop,
    Reference,
  },
  inheritAttrs: false,
  props: {
    trigger: {
      type: String,
      default: 'click',
    },
    placement: String,
    popperClass: [String, Array, Object],
    showArrow: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    visibleOnMenuItemClick: {
      type: Boolean,
      default: false,
    },

    shouldComputedWidth: {
      type: Boolean,
      default: true,
    },
    useShow: {
      type: Boolean,
      default: false,
    }, // 暂时不确定属性名，谨慎使用
    defaultVisible: {
      type: Boolean,
      default: false,
    },
    dropdownClass: [Array, String, Object],
    lazy: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['update:visible'],
  setup(props, ctx) {
    const { emit, attrs } = ctx
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('dropdown'))

    const { provideDropdown } = useProvide()

    const width = ref<number | string>('auto')
    const emitter = markRaw(mitt())
    provideDropdown({
      emitter: emitter,
    })

    const referenceRef = ref<any | null>(null)
    const popperRef = ref<any | null>(null)

    const useDropdownHook = useDropdown(props, ctx)
    const { _visible, setVisible } = useDropdownHook

    const myAttrs = useResetAttrs(attrs)
    const myListeners = useListeners({
      'update:visible': (val: boolean) => {
        setVisible(val)
      },
    })

    watch(() => _visible, v => {
      if (v && props.shouldComputedWidth) {
        const el = getElementFromComponent(referenceRef.value as any)
        if (el) {
          const { width: elWidth } = el.getBoundingClientRect()
          width.value = elWidth + 'px'
        }
      }
    })

    const updateVisible = (v: boolean) => {
      emit('update:visible', v)
    }

    const handleMenuItemClick = () => {
      if (!props.visibleOnMenuItemClick) {
        setVisible(false)
      }
    }

    const updatePopper = () => {
      if (_visible && popperRef.value) {
        (popperRef.value as IPopper).updatePopper()
      }
    }

    onMounted(() => {
      emitter.on('itemClick', handleMenuItemClick)
    })

    return {
      prefix, width, myAttrs, myListeners, emitter,
      ...useDropdownHook,
      referenceRef, popperRef,
      updateVisible, handleMenuItemClick, updatePopper,
    }
  },
  render() {
    const { prefix, myListeners, _visible, myAttrs, width } = this
    const { trigger, disabled, placement, showArrow, useShow, popperClass, lazy } = this.$props
    return <popper
      trigger={trigger}
      popperDisabled={disabled}
      placement={placement}
      visible={_visible}
      showArrow={showArrow}
      ref={'popperRef'}
      {...myAttrs}
      {...myListeners}
    >
      <reference ref={'referenceRef'}>
        {getSlotsInRender(this)}
      </reference>
      <drop
        classProp={[
          popperClass,
          `${prefix}-popper`,
          {
            [prefix]: true,
            [`${prefix}-expended`]: _visible,
          },
        ]}
        style={{ 'min-width': width }}
        useShow={useShow}
        lazy={lazy}
      >
        {this.$slots.dropdown}
      </drop>
    </popper>
  },
})
