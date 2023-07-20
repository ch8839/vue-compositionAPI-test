import {
  defineComponent,
  computed,
  getSlotsInRender,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import { useListeners } from '@components/hooks/pass-through'
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

    const myListeners = useListeners({
      click: handleClick,
    })

    return {
      prefix,
      myListeners,
    }
  },
  render() {
    const { prefix, disabled, myListeners, selected } = this
    return <li
      class={{
        [prefix]: true,
        [`${prefix}-disabled`]: disabled,
        [`${prefix}-selected`]: selected,
      }}
      {...myListeners}
    >
      {getSlotsInRender(this)}
    </li>
  },
})
