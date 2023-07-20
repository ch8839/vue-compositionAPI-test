import { computed, defineComponent } from '@ss/mtd-adapter'
import { useConfig } from '@components/config-provider'



export default defineComponent({
  name: 'LineScaleLoading',
  inheritAttrs: true,
  setup() {
    const config = useConfig()
    const prefixMTD = computed(() => config.getPrefix())
    return {
      prefixMTD,
    }
  },
  render() {
    const { prefixMTD } = this
    return <div class={`${prefixMTD}-loading-line-scale`}>
      <div />
      <div />
      <div />
      <div />
    </div>
  },
})


