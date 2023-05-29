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
import useControlled from '@hooks/controlled'
import useProvide from './useProvide'
import MtdVirtual from '@components/virtual'

//得接收class

export default defineComponent({
  name: 'MtdDropdown',
  components: {
    Popper,
    Drop,
    Reference,
    MtdVirtual,
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
    visible: Boolean,
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

    const [visible, setVisible] = useControlled<boolean>('visible', props, ctx)

    const resetAttrs = useResetAttrs(attrs, true)
    const resetListeners = useListeners({
      'update:visible': (val: boolean) => {
        setVisible(val, { emit: true })
      },
    })

    watch(() => visible, v => {
      if (v && props.shouldComputedWidth) {
        const el = getElementFromComponent(referenceRef.value)
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
        setVisible(false, { emit: true })
      }
    }

    const updatePopper = () => {
      if (visible.value && popperRef.value) {
        (popperRef.value as IPopper).updatePopper()
      }
    }

    onMounted(() => {
      emitter.on('itemClick', handleMenuItemClick)
    })

    return {
      prefix, width, resetAttrs, resetListeners, emitter, m_visible: visible,
      referenceRef, popperRef,
      updateVisible, handleMenuItemClick, updatePopper,
    }
  },
  render() {


    const { prefix, resetListeners, m_visible, resetAttrs, width } = this
    const { trigger, disabled, placement, showArrow, useShow, popperClass, lazy } = this.$props

    return <popper
      trigger={trigger}
      popperDisabled={disabled}
      placement={placement}
      visible={m_visible}
      showArrow={showArrow}
      ref={'popperRef'}
      {...resetAttrs}
      {...resetListeners}
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
            [`${prefix}-expended`]: m_visible,
          },
        ]}
        style={{ 'min-width': width }}
        useShow={useShow}
        lazy={lazy}
      >
        {getSlotsInRender(this, 'dropdown')}
      </drop>
    </popper>
  },
})
