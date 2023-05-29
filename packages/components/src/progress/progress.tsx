import {
  computed,
  defineComponent,
  PropType,
  classNames, styles,
  useResetAttrs,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'

import MtdLine from './line'
import MtdCircle from './circle'
import MtdPie from './pie'

import MtdIcon from '@components/icon'

import { ProgressType, ProgressStatus } from './types'

export default defineComponent({
  name: 'MtdProgress',
  components: {
    MtdLine,
    MtdCircle,
    MtdPie,
    MtdIcon,
  },
  inheritAttrs: false,
  props: {
    type: {
      type: String as PropType<ProgressType>,
      default: 'line',
      validator: (val: string): boolean => ['line', 'circle', 'pie'].indexOf(val) > -1,
    },
    status: {
      type: String as PropType<ProgressStatus>,
    },
    percentage: {
      type: Number,
      default: 0,
      required: true,
      validator: (val: number) => val >= 0 && val <= 100,
    },
    showInfo: {
      type: Boolean,
      default: true,
    },
    strokeLinecap: {
      type: String,
      default: 'round',
    },
    strokeWidth: {
      type: Number,
      default: 6,
    },
    width: {
      type: Number,
      default: 80,
    },
  },
  emits:[],
  setup(props, { attrs }) {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('progress'))
    const tag = computed(() => {
      switch (props.type) {
        case 'circle':
          return MtdCircle
        case 'pie':
          return MtdPie
        default:
          return MtdLine
      }
    })
    const icon = computed(() => {
      if (props.type === 'line') {
        if (props.status === 'success') {
          return 'success-circle'
        } else if (props.status === 'error') {
          return 'error-circle'
        }
      } else if (props.type === 'circle') {
        if (props.status === 'success') {
          return 'check'
        } else if (props.status === 'error') {
          return 'close'
        }
      }
      return undefined
    })

    const fontSize = computed(() => {
      return props.type === 'line' ? (Math.min(props.strokeWidth * 2 + 2, 16)) + 'px' : '1em'
    })
    const LineIconFontSize = 20
    const iconFontSize = computed(() => {
      switch (props.type) {
        case 'line':
          return LineIconFontSize
        case 'circle':
          return props.width / 2
        default:
          return LineIconFontSize
      }
    })

    const resetAttrs = useResetAttrs(attrs)

    const m_showInfo = computed(() => props.showInfo && !icon.value)

    return {
      prefix,
      tag,
      icon,
      resetAttrs,
      fontSize,
      iconFontSize,
      m_showInfo,
    }
  },
  render() {
    const {
      prefix, status, type, tag, percentage, icon, resetAttrs, m_showInfo,
      strokeLinecap, strokeWidth, fontSize, iconFontSize, width,
    } = this
    const Component = tag as any
    return <div
      class={classNames(this, {
        [prefix]: true,
        [`${prefix}-${status}`]: status,
        [`${prefix}-${type}`]: type,
        [`${prefix}-hide-rate`]: !m_showInfo,
      })}
      style={styles(this)}
    >
      <Component
        {...resetAttrs}
        strokeLinecap={strokeLinecap}
        strokeWidth={strokeWidth}
        percentage={percentage}
        status={status}
        showInfo={m_showInfo}
        width={width}
      />
      <div class={`${prefix}-percentage`}>
        {m_showInfo
          ? <span class={`${prefix}-text`} style={`font-size: ${fontSize}`}>
            {type === 'line' ? `${percentage}%` : ''}
          </span>
          : <mtd-icon
            name={icon}
            class={`${prefix}-icon`}
            style={{
              ['font-size']: iconFontSize + 'px',
            }}
          />
        }
      </div>
    </div>
  },
})

