import {
  computed,
  defineComponent,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'

export default defineComponent({
  name: 'MtdCircleProgress',
  props: {
    color: {
      type: String,
      default: 'currentColor',
    },
    strokeWidth: {
      type: Number,
      default: 6,
    },
    strokeLinecap: {
      type: String,
    },
    showInfo: {
      type: Boolean,
    },
    width: {
      type: Number,
      default: 80,
    },
    percentage: {
      type: Number,
      default: 0,
      required: true,
      validator: (val: number): boolean => val >= 0 && val <= 100,
    },
  },
  setup(props) {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('progress'))
    const cx = computed(() => props.width / 2)
    const cr = computed(() => cx.value - props.strokeWidth / 2)
    const strokeDasharray = computed(() => {
      const percent = props.percentage / 100
      const perimeter = Math.PI * 2 * cr.value
      return `${perimeter * percent} ${perimeter * (1 - percent)}`
    })
    const viewbox = computed(() => `0 0 ${props.width} ${props.width}`)
    const transform = computed(() => `matrix(0,-1,1,0,0,${props.width})`)
    return {
      prefix,
      cx,
      cr,
      strokeDasharray,
      viewbox,
      transform,
    }
  },
  render() {
    const {
      width, cx, cr, strokeDasharray, viewbox, transform, strokeWidth,
      prefix, color, strokeLinecap, percentage, showInfo,
    } = this
    return <div
      class={`${prefix}-circle-wrapper`}
      style={{
        height: `${width}px`,
        fontSize: `${width / 5}px`,
      }}
    >
      <svg width={width} height={width} viewBox={viewbox}>
        <circle
          cx={cx}
          cy={cx}
          r={cr}
          stroke-width={strokeWidth}
          stroke={color}
          class={prefix + '-circle-outer'}
          fill={'none'}
          stroke-linecap={strokeLinecap as any}
        />
        <circle
          cx={cx}
          cy={cx}
          r={cr}
          stroke-width={strokeWidth}
          stroke={color}
          fill={'none'}
          transform={transform}
          stroke-dasharray={strokeDasharray}
          stroke-linecap={strokeLinecap as any}
        />
      </svg>
      {showInfo && <span class={`${prefix}-circle-text`}>
        {percentage}%
      </span>}
    </div>
  },
})
