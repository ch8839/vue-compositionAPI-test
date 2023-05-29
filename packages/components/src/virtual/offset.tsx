import { useConfig } from '@components/config-provider'
import {
  computed,
  defineComponent,
  getSlotsInRender,
  onMounted,
  onUpdated,
  onUnmounted,
} from '@ss/mtd-adapter'
import getElement from '@components/hooks/getElement'

export default defineComponent({
  name: 'MtdVirtualOffset',
  emits: ['updateOffset'],
  setup(props, { emit }) {
    const config = useConfig()
    const prefixMTD = computed(() => config.getPrefix())
    const el = getElement()

    function getOffsetHeight() {
      return el.value ? el.value.offsetHeight : 0
    }

    function setVisibility(v: string) {
      if (el.value) {
        el.value.style.visibility = v
      }
    }

    onMounted(() => { emit('updateOffset', getOffsetHeight()) })
    onUpdated(() => { emit('updateOffset', getOffsetHeight()) })
    onUnmounted(() => { emit('updateOffset', getOffsetHeight()) })

    return {
      prefixMTD, getOffsetHeight, setVisibility,
    }
  },
  render() {
    const { prefixMTD } = this
    return <div class={`${prefixMTD}-virtual-offset`}>
      {getSlotsInRender(this)}
    </div>
  },
})
