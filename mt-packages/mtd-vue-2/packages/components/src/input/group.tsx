import {
  defineComponent,
  computed, classNames, styles, getSlotsInRender,
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
      {getSlotsInRender(this, 'prepend') && <div class={`${prefix}-prepend`} >
        {getSlotsInRender(this, 'prepend')}
      </div>}
      {getSlotsInRender(this)}
      {getSlotsInRender(this, 'append') && <div class={`${prefix}-append`}>
        {getSlotsInRender(this, 'append')}
      </div>}
    </span>
  },
})
