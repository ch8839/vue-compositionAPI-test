import {
  defineComponent,
  computed,
  getSlotsInRender,
  useListeners,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import useDropdownProvide from '@components/dropdown/useProvide'

export default defineComponent({
  name: 'MtdDropdownMenuItem',
  inheritAttrs: true,
  props: {
    disabled: Boolean,
    selected: Boolean,
  },
  setup(props, { emit }) {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('dropdown-menu-item'))

    const { injectDropdown } = useDropdownProvide()
    const dropdown = injectDropdown()

    const handleClick = (e: Event) => {
      if (props.disabled) {
        return
      }
      emit('click', e)
      if (dropdown) {
        dropdown.emitter.emit('itemClick', e)
      }
    }

    const resetListeners = useListeners({
      click: handleClick,
    })

    return {
      prefix,
      resetListeners,
    }
  },
  render() {
    const { prefix, disabled, resetListeners, selected } = this
    return <li
      class={{
        [prefix]: true,
        [`${prefix}-disabled`]: disabled,
        [`${prefix}-selected`]: selected,
      }}
      {...resetListeners}
    >
      {getSlotsInRender(this)}
    </li>
  },
})
