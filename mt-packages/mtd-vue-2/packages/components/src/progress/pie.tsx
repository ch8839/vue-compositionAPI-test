import {
  computed,
  defineComponent,
  PropType,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import { ProgressStatus } from './types'
import MtdIcon from '@components/icon'
import MtdTooltip from '@components/tooltip'

const colorMap = {
  default: {
    bgc: '#CBE1FE',
    color: '#166FF7',
  },
  success: {
    bgc: '#00ba73',
    color: '#edfaf4',
  },
  error: {
    bgc: '#FFD4CC',
    color: '#F4483B',
  },
}


export default defineComponent({
  name: 'MtdPieProgress',
  components: {
    MtdIcon,
    MtdTooltip,
  },
  props: {
    color: {
      type: String,
    },
    status: {
      type: String as PropType<ProgressStatus>,
    },
    width: {
      type: Number,
      default: 26,
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

    const pieStyle = computed(() => {
      const colorObj = props.status ? colorMap[props.status] : colorMap['default']
      const colorDeg = Math.floor(props.percentage * 360 / 100)
      return {
        ['background-image']: `conic-gradient(
          ${colorObj.color} ${colorDeg}deg, 
          ${colorObj.bgc} ${colorDeg}deg
        )`,
        width: props.width + 'px',
        height: props.width + 'px',
      }
    })
    return {
      prefix,
      pieStyle,
    }
  },
  render() {
    const {
      prefix, status, percentage, pieStyle, width,
    } = this
    return <mtd-tooltip content={percentage + '%'} placement="top">
      {status === 'success'
        ? <mtd-icon
          name={'check'}
          class={`${prefix}-icon`}
          style={{
            ['font-size']: width + 'px',
            ['font-weight']: 1000,
          }}
        />
        : <div
          class={{
            [prefix + '-pie']: true,
            [prefix + '-' + status]: status,
          }}
          style={pieStyle}
        />
      }
    </mtd-tooltip>
  },
})

