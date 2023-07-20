import {
  computed,
  defineComponent,
  inject,
  PropType,
  provide,
  Ref,
  getSlotsInRender,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import { MTDUIComponentSize } from '@components/types'

interface BreadcrumbContext {
  separator: Ref<string | undefined>;
  separatorClass: Ref<string>;
  size?: Ref<MTDUIComponentSize>;
  breadcrumbPrefix: string;
}

export function useBreadcrumbProvider(context: BreadcrumbContext) {
  provide<BreadcrumbContext>('breadcrumb', context)
}

export function useBreadcrumb(): BreadcrumbContext | undefined {
  return inject<BreadcrumbContext>('breadcrumb')
}

export default defineComponent({
  name: 'MtdBreadcrumb',
  inheritAttrs: true,
  props: {
    separator: {
      type: String,
    },
    separatorClass: {
      type: String,
    },
    size: {
      type: String as PropType<MTDUIComponentSize>,
      default: '',
    },
    currentStyle: {
      type: String,
      default: 'normal',
    },
  },
  setup(props) {
    const config = useConfig()
    const prefix = config.getPrefixCls('breadcrumb')

    useBreadcrumbProvider({
      separator: computed(() => props.separator),
      separatorClass: computed(() => props.separatorClass || ''),
      size: computed(() => props.size),
      breadcrumbPrefix: prefix,
    })
    return { prefix }
  },
  render() {
    const { prefix, currentStyle } = this
    const { size } = this.$props
    return (
      <div class={[prefix, `${prefix}-cur-${currentStyle}`, size ? `${prefix}-${size}` : '']}>
        {getSlotsInRender(this)}
      </div>
    )
  },
})
