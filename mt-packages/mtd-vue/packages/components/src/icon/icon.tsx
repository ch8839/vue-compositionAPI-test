import {
  defineComponent,
  computed,
  useListeners,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'

export default defineComponent({
  name: 'MtdIcon',
  inheritAttrs: true,
  props: {
    name: {
      type: String,
    },
  },
  setup(props) {
    const config = useConfig()
    const iconClass = computed(() => config.getIconCls(props.name))

    const listeners = useListeners()

    return {
      iconClass,
      listeners,
    }
  },
  render() {
    const { iconClass, listeners } = this
    return <i class={iconClass} {...listeners}></i>
  },
})
