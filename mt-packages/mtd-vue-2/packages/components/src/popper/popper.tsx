import useProvide from './useProvide'
// import Popper from '@utils/popper'
import { usePopper, withEmits, withProps } from '@utils/popper'
import { ref, defineComponent, vueInstance, getSlotsInRender, classNames, styles, Fragment } from '@ss/mtd-adapter'
import { PopperInstance } from './types'

export default defineComponent({
  name: 'MtdPopper',
  inheritAttrs: false,
  props: {
    ...withProps,
    wrapperTag: {
      type: String,
      default: 'Fragment',
    },
  },
  emits: withEmits,
  setup(props, ctx) {
    const ins = vueInstance() as PopperInstance
    const referenceRef = ref<any>()
    const dropRef = ref<any>()

    const registerReference = (reference: any) => {
      // 需要给ins 注入新的属性
      ins.referenceRef = reference
    }
    const registerDrop = (drop: any) => {
      // 需要给ins 注入新的属性
      ins.dropRef = drop
    }

    const { providePopper } = useProvide()
    providePopper(ins)

    const usePopoverHook = usePopper(props, ctx, ins)

    return {
      referenceRef,
      dropRef,
      registerReference,
      registerDrop,
      ...usePopoverHook,
    }
  },

  render() {
    if (this.wrapperTag === 'Fragment') {
      return <Fragment>
        {getSlotsInRender(this)}
      </Fragment>
    } else {
      const Comp = (this.wrapperTag === 'Fragment' ? Fragment : this.wrapperTag) as any
      return <Comp
        class={classNames(this, 'popper-class')}
        style={styles(this)}
      >
        {getSlotsInRender(this)}
      </Comp>
    }

    /* const children = getSlotsInRender(this) || []
    // todo: 对多 children 的情况给予提示 🤡变成warn提示
    return children[0] */
  },
}) as any
