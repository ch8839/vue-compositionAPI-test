import {
  defineComponent,
  computed, classNames, styles,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'

export default defineComponent({
  name: 'MtdInputGroup',
  inheritAttrs: false,
  props: {
    // compact: { // 废弃
    //   type: Boolean,
    //   default: false,
    // },
  },
  setup() {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('input-group'))
    return {
      prefix,
    }
  },
  render() {
    const { prefix } = this
    return <span
      class={classNames(this, {
        [prefix]: true,
        [`${prefix}-compact`]: true,
      })}
      style={styles(this)}
    >
      {this.$slots.prepend && <div class={`${prefix}-prepend`} >
        {this.$slots.prepend}
      </div>}
      {this.$slots.default}
      {this.$slots.append && <div class={`${prefix}-append`}>
        {this.$slots.append}
      </div>}
    </span>
  },
})
