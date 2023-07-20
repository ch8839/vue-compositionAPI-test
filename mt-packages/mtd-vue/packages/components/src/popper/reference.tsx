
import { defineComponent, onMounted, getSlotsInRender } from '@ss/mtd-adapter'
import vueInstance from '@components/hooks/instance'
import useProvide from './useProvide'

export default defineComponent({
  name: 'MtdPopperReference',
  inheritAttrs: false,
  props: {},
  setup() {
    const ins = vueInstance()

    const { injectPopper } = useProvide()
    const popper = injectPopper()
    onMounted(() => {
      popper && popper.registerReference(ins)
    })
  },
  render() {
    const children = getSlotsInRender(this) || []
    // todo: 对多 children 的情况给予提示 🤡变成warn提示
    return children[0]
  },
})
