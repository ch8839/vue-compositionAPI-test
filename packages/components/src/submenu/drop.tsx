
import { useConfig } from '@components/config-provider'
import { Popper, Drop as PopperDrop } from '@components/popper'
import {
  defineComponent,
  computed,
  ref,
  watch,
  onMounted,
  getCurrentInstance,
  ComponentPublicInstance,
  getSlotsInRender,
  useResetAttrs,
} from '@ss/mtd-adapter'

export default defineComponent({
  name: 'DropdownMenu',
  components: {
    MtdPopper: Popper,
    MtdPopperDrop: PopperDrop,
  },
  inheritAttrs: false,
  props: {
    placement: String,
    level: Number,
    disabled: Boolean,
    visible: Boolean,
    popperClass: String,
  },
  emits: ['mouseenter', 'mouseleave'],
  setup(props, { emit, attrs }) {

    const config = useConfig()
    const prefixMTD = computed(() => config.getPrefix())

    const v = ref<Boolean>(false)
    const popper = ref<ComponentPublicInstance<any>>(null)
    const instance = getCurrentInstance()
    const dropClassName = computed(() => [
      [`${prefixMTD.value}-menu`],
      [`${prefixMTD.value}-menu-light`],
      [`${prefixMTD.value}-menu-vertical`],
      [`${prefixMTD.value}-submenu-dropdown`],
      props.popperClass,
    ])
    watch(
      () => props.visible,
      () => (v.value = !!props.visible),
    )

    onMounted(() => {
      instance && instance.parent && popper.value.registerReference(instance.parent.proxy)
      v.value = !!props.visible
    })

    const handleMouseenter = (e: Event) => emit('mouseenter', e)
    const handleMouseleave = (e: Event) => emit('mouseleave', e)

    const resetAttrs = useResetAttrs(attrs)

    return {
      popper,
      v,
      dropClassName,
      resetAttrs,
      handleMouseenter,
      handleMouseleave,
    }
  },
  render() {
    const {
      v,
      dropClassName,
      handleMouseenter,
      handleMouseleave,
      disabled, placement, level,
      resetAttrs,
    } = this
    return <mtd-popper
      ref={'popper'}
      popper-disabled={disabled}
      placement={placement}
      visible={v}
      show-arrow={level === 0}
      append-to-container={level === 0}
      {...resetAttrs}
    >
      <mtd-popper-drop
        tag={'ul'}
        use-show
        lazy={false}
        classProp={dropClassName}
        onMouseenter={handleMouseenter}
        onMouseleave={handleMouseleave}
      >
        {getSlotsInRender(this)}
      </mtd-popper-drop>
    </mtd-popper >
  },
})
