import {
  defineComponent,
  PropType,
  computed,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import { LineType } from './types'

export default defineComponent({
  name: 'Timeline',
  inheritAttrs: true,
  props: {
    type: {
      type: String as PropType<LineType>,
      validator(value) {
        return (
          ['master', 'normal', 'solid', 'hollow', 'disabled'].indexOf(value as any) > -1
        )
      },
      default: 'normal',
    },
    size: String,
    ghost: Boolean,
  },
  emits: [],
  setup() {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('timeline-item'))
    return {
      prefix,
    }
  },
  render() {
    const {
      prefix, type, size, ghost,
    } = this
    return <div class={`${prefix}-line`}>
      <span class={{
        [`${prefix}-dot`]: true,
        [`${prefix}-dot-${size}`]: size,
      }}>
        {this.$slots.dot || <span class={`${prefix}-dot-${type} ${prefix}-dot-content`} />}
      </span>
      <div class={{
        [`${prefix}-line-tail`]: true,
        [`${prefix}-line-tail-ghost`]: ghost,
      }} />
    </div>
  },
})

