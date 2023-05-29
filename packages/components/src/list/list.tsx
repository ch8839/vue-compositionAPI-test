import {
  computed,
  defineComponent,
  getSlotsInRender,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import MtdIconButton from '@components/icon-button'
export default defineComponent({
  name: 'MtdList',
  components: {
    MtdIconButton,
  },
  inheritAttrs: true,
  props: {
    size: {
      type: String,
      default: 'normal',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    split: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('list'))
    return {
      prefix,
    }
  },
  render() {
    const {
      prefix, size, loading, split,
    } = this
    return <div
      class={{
        [prefix]: true,
        [`${prefix}-${size}`]: size,
        [`${prefix}-split`]: split,
      }}
    >
      {getSlotsInRender(this)}

      {!loading
        ? getSlotsInRender(this, 'loadMore')
        : <div class={`${prefix}-loading`}>
          <mtd-icon-button icon="loading" />
        </div>
      }
    </div >
  },
})
