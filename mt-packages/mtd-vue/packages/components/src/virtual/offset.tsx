import { useConfig } from '@components/config-provider'
import {
  computed,
  defineComponent,
} from '@ss/mtd-adapter'

export default defineComponent({
  name: 'MtdVirtualOffset',
  setup() {
    const config = useConfig()
    const prefixMTD = computed(() => config.getPrefix())
    return {
      prefixMTD,
    }
  },
  mounted() {
    this.$emit('updateOffset', this.getOffsetHeight())
  },
  updated() {
    this.$emit('updateOffset', this.getOffsetHeight())
  },
  destoryed() {
    this.$emit('updateOffset', this.getOffsetHeight())
  },
  methods: {
    getOffsetHeight() {
      return this.$el ? (this.$el as any).offsetHeight : 0
    },
    setVisibility(v: any) {
      (this.$el as any).style.visibility = v
    },
  },
  render() {
    const { prefixMTD } = this
    return <div class={`${prefixMTD}-virtual-offset`}>
      {this.$slots.default}
    </div>
  },
})
