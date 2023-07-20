import { computed, defineComponent, markRaw } from '@ss/mtd-adapter'
import { useConfig } from '@components/config-provider'
export default defineComponent({
  setup() {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('autocomplete-option-wrap'))
    const children = markRaw([]) as any[] | undefined
    return {
      prefix, children,
    }
  },
  updated() {
    this.$emit('updated', this.children)
  },
  unmounted() {
    this.$emit('updated', [])
  },
  render() {
    const children = this.$slots.default ? this.$slots.default : undefined
    this.children = children
    return <div class={this.prefix}>{children}</div>
  },
})
