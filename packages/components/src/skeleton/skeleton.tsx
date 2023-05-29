import {
  defineComponent,
  PropType,
  computed,
  hasProp,
  getSlotsInRender, vueInstance,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'


type SkeletonType = 'avatar' | 'paragraph' | 'picture'

export default defineComponent({
  name: 'MtdSkeleton',
  inheritAttrs: true,
  props: {
    type: {
      type: String as PropType<SkeletonType>,
      default: 'paragraph',
    },
    active: {
      type: Boolean,
      default: true,
    },
    loading: {
      type: Boolean,
      default: true,
    },
    lineNum: {
      type: Number,
      default: 3,
    },
    size: {
      type: Number,
      default: 16,
    },
  },
  emits: [],
  setup(props) {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('skeleton'))
    const ins = vueInstance()

    const m_size = computed(() => {
      return hasProp(ins, 'size')
        ? props.size
        : props.type === 'avatar' ? 36 : 16
    })

    function renderSkeleton() {
      const className = [
        `${prefix.value}-${props.type}`,
        `${prefix.value}-content`,
        props.active ? `${prefix.value}-active` : '',
      ]
      if (props.type === 'paragraph') {
        return new Array(props.lineNum).fill(0).map((item, index) => <div
          class={className}
          style={{
            marginTop: `${index === 0 ? m_size.value / 2 : 0}px`,
            marginBottom: `${m_size.value}px`,
            height: `${m_size.value}px`,
          }}
        />)
      } else {
        const style: any = {}
        if (props.type === 'avatar') {
          style.height = `${m_size.value}px`
          style.width = `${m_size.value}px`
        }
        return <div class={className} style={style} />
      }
    }
    return {
      prefix, renderSkeleton,
    }
  },
  render() {
    const {
      prefix, type, loading,
    } = this

    return <div class={prefix} style={type === 'paragraph' ? 'width: 100%' : ''}>
      {loading
        ? this.renderSkeleton()
        : getSlotsInRender(this)
      }
    </div>
  },
})

