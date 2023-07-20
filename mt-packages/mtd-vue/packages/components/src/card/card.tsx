import {
  defineComponent,
  computed,
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
      {(this.$slots.title || title) && <div class={[`${prefix}-title`, titleClass]}>
        {this.$slots.title || title}
      </div>}
      {(this.$slots.extra) && <div class={`${prefix}-extra`}>
        {this.$slots.extra}
      </div>}
      <div class={[`${prefix}-body`, bodyClass]}>
        {this.$slots.default}
      </div>
    </div >
  },
})
