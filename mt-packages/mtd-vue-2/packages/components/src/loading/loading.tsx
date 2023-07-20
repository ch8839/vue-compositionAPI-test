import {
  computed,
  defineComponent,
  PropType,
  ref,
  watch, classNames, styles, defineEmits,
  useResetAttrs,
  useListeners,
  getSlotsInRender,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import LineScale from './line-scale'
import MtdCircle from './circle'

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
  emits: [],
  setup(props, ctx) {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('loading'))

    const resetAttrs = useResetAttrs(ctx)
    const resetListeners = useListeners(ctx)

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
      prefix, isLoading, loadingComponent, resetAttrs, resetListeners,
    }
  },
  render() {
    const { prefix, type, size, message, isLoading: loading,
      resetAttrs, resetListeners, showMessage, messagePosition } = this
    const COMP = this.loadingComponent as any
    const mapping = SizeMapping[type] || SizeMapping.circle
    const sizeProp = mapping[size] || mapping.normal

    const renderMsg = getSlotsInRender(this, 'message') || message

    const indicatorRender = () => {
      return <div class={{
        [prefix]: true,
        [`${prefix}-flex`]: messagePosition === 'right',
        [`${prefix}-${size}`]: true,
      }} >
        {getSlotsInRender(this, 'indicator') ||
          <COMP
            {...resetAttrs}

            size={sizeProp.size}
            thickness={sizeProp.thickness}
          />}
        {showMessage && <div class={`${prefix}-message`}>{renderMsg}</div>}
      </div>
    }

    if (!getSlotsInRender(this)) {
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
        {getSlotsInRender(this)}
      </div>
    </div>
  },
})

