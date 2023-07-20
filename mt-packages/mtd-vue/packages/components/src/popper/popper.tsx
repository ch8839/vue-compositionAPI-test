import useProvide from './useProvide'
// import Popper from '@utils/popper'
import { usePopper, withEmits, withProps } from '@utils/popper'
import { ref, defineComponent, vueInstance, Fragment, classNames, styles } from '@ss/mtd-adapter'
import { PopperInstance } from './types'

export default defineComponent({
  name: 'MtdPopper',
  components: {
    Fragment,
  },
  inheritAttrs: false,
  props: {
    ...withProps,
    wrapperTag: {
      type: String,
      default: 'fragment',
    },
  },
  emits: withEmits,
  setup(props, ctx) {
    const ins = vueInstance()
    const referenceRef = ref<any>()
    const dropRef = ref<any>()

    const registerReference = (reference: any) => {
      ins.referenceRef = reference
    }
    const registerDrop = (drop: any) => {
      ins.dropRef = drop
    }

    const { providePopper } = useProvide()
    providePopper(ins as PopperInstance)

    const usePopoverHook = usePopper(props, ctx, ins as PopperInstance)

    return {
      referenceRef,
      dropRef,
      registerReference,
      registerDrop,
      ...usePopoverHook,
    }
  },

  render() {
    const Comp = this.wrapperTag
    return <Comp
      class={classNames(this, "popper-class-point")}
      style={styles(this)}
    >
      {this.$slots.default}

    </Comp>
    /* const children = this.$slots.default || []
    // todo: 对多 children 的情况给予提示 🤡变成warn提示
    return children[0] */
  },
}) as any
