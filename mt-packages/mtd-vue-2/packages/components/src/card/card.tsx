import {
  defineComponent,
  computed,
  getSlotsInRender,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'

export default defineComponent({
  name: 'MtdCard',
  inheritAttrs: true,
  props: {
    title: {
      type: String,
    },
    shadow: {
      type: String,
      default: 'always',
    },
    bodyClass: String,
    titleClass: String,
  },
  emits: [],
  setup() {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('card'))
    return {
      prefix,
    }
  },
  render() {
    const {
      prefix, shadow, titleClass, bodyClass, title,
    } = this
    return <div class={[prefix, shadow ? `${prefix}-` + shadow + '-shadow' : `${prefix}-always-shadow`]}>
      {(getSlotsInRender(this, 'title') || title) && <div class={[`${prefix}-title`, titleClass]}>
        {getSlotsInRender(this, 'title') || title}
      </div>}
      {getSlotsInRender(this, 'extra') && <div class={`${prefix}-extra`}>
        {getSlotsInRender(this, 'extra')}
      </div>}
      <div class={[`${prefix}-body`, bodyClass]}>
        {getSlotsInRender(this)}
      </div>
    </div >
  },
})
