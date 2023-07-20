import {
  computed,
  defineComponent,
  PropType,
  ref,
  watch, classNames, styles, defineEmits,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import LineScale from './line-scale'
import MtdCircle from './circle'
import { useAllAttrs } from '@components/hooks/pass-through'

//const SVG_URL = require('@components/assets/svg/loading-static.svg')

const SizeMapping = {
  'circle': {
    small: {
      size: 12,
      thickness: 1,
    },
    normal: {
      size: 18,
      thickness: 1,
    },
    large: {
      size: 24,
      thickness: 2,
    },
  },
  ['line-scale']: {
    small: {
      size: 12,
      thickness: 1,
    },
    normal: {
      size: 18,
      thickness: 1,
    },
    large: {
      size: 24,
      thickness: 2,
    },
  },
}

type Timer = number | undefined;
type loadingSize = 'small' | 'large' | 'normal';
type LoadingType = 'line-scale' | 'circle';
type MessagePosition = 'bottom' | 'right';

export default defineComponent({
  name: 'MtdLoading',
  components: {
    LineScale,
    MtdCircle,
  },
  inheritAttrs: false,
  props: {
    type: {
      type: String as PropType<LoadingType>,
      default: 'circle',
      validator: (v: string) => {
        return !v || ['line-scale', 'circle'].indexOf(v) > -1
      },
    },
    message: {
      type: String,
      default: '加载中...',
    },
    messagePosition: {
      type: String as PropType<MessagePosition>,
      default: 'bottom',
      validator: (v: string) => {
        return !v || ['bottom', 'right'].indexOf(v) > -1
      },
    },
    showMessage: {
      type: Boolean,
      default: true,
    },
    loading: {
      type: Boolean,
      default: true,
    },
    delay: {
      type: Number,
      default: 0,
    },
    size: {
      type: String as PropType<loadingSize>,
      default: 'normal',
      validator: (v: string) => {
        return !v || ['small', 'large', 'normal'].indexOf(v) > -1
      },
    },
    /*     style: Object as PropType<any>,
    class: [String, Array, Object], */
  },
  emits: defineEmits([]),
  setup(props, ctx) {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('loading'))

    const allAttrs = useAllAttrs(ctx)

    const loadingTimer = ref<Timer>()
    const isLoading = ref(false)

    // @Computed
    const loadingComponent = computed(() => props.type === 'line-scale' ? LineScale : MtdCircle)

    // @Watch
    watch(() => props.loading, (v: boolean) => {
      setLoading(v)
    }, { immediate: true })

    // @Methods
    function setLoading(v: boolean) {
      clearTimeout(loadingTimer.value)
      if (isLoading.value === v) {
        return
      }
      if (props.delay) {
        loadingTimer.value = setTimeout(() => {
          isLoading.value = props.loading
        }, props.delay)
      } else {
        isLoading.value = props.loading
      }
    }

    /* @BeforeMounted */
    clearTimeout(loadingTimer.value)

    return {
      prefix, isLoading, loadingComponent, allAttrs,
    }
  },
  render() {
    const { prefix, type, size, message, isLoading: loading,
      $slots, allAttrs, showMessage, messagePosition } = this
    const COMP = this.loadingComponent
    const mapping = SizeMapping[type] || SizeMapping.circle
    const sizeProp = mapping[size] || mapping.normal
    const compProps = {
      ...allAttrs,
      ...{ props: sizeProp },
    }

    // const circleSize = SizeMapping.circle[size].size
    /* this.isStatic
        ? <img src={SVG_URL} width={circleSize} height={circleSize} />
        :  */
    const renderMsg = $slots.message || message

    const indicatorRender = () => {
      return <div class={{
        [prefix]: true,
        [`${prefix}-flex`]: messagePosition === 'right',
        [`${prefix}-${size}`]: true,
      }} >
        {$slots.indicator || <COMP {...compProps} />}
        {showMessage && <div class={`${prefix}-message`}>{renderMsg}</div>}
      </div>
    }

    if (!$slots.default) {
      if (!loading) {
        return <div class={prefix} />
      }
      return indicatorRender()
    }

    return <div
      class={classNames(this, `${prefix}-nested`)}
      style={styles(this)}
    >
      {loading && indicatorRender()}
      <div
        key="container"
        class={`${prefix}-container ${loading ? `${prefix}-blur` : ''}`}
      >
        {$slots.default}
      </div>
    </div>
  },
})

