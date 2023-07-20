import {
  computed,
  defineComponent,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'

export default defineComponent({
  name: 'MtdLineProgress',
  inheritAttrs: true,
  props: {
    color: {
      type: String,
    },
    strokeWidth: {
      type: Number,
      default: 6,
    },
    percentage: {
      type: Number,
      default: 0,
      required: true,
      validator: (val: number): boolean => val >= 0 && val <= 100,
    },
    strokeLinecap: {
      type: String,
    },
  },
  setup() {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('progress'))
    return {
      prefix,
    }
  },
  render() {
    const {
      prefix, strokeWidth, percentage, color, strokeLinecap,
    } = this
    return <div
      class={[`${prefix}-bar`, `${prefix}-stroke-linecap-${strokeLinecap}`]}
      style={{ height: `${strokeWidth}px` }}
    >
      <div class={`${prefix}-bar-outer`}>
        <div
          class={`${prefix}-bar-inner`}
          style={{
            width: `${percentage}%`,
            background: color,
          }}
        />
      </div>
    </div >
  },
})
