import {
  defineComponent,
  provide,
  ref,
  vueInstance,
  getSlotsInRender,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'


export default defineComponent({
  name: 'MtdOptionGroup',
  inheritAttrs: true,
  props: {
    label: String,
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const config = useConfig()
    const prefix = config.getPrefixCls('option-group')
    const prefixSelectGroup = config.getPrefixCls('select-group')
    const ins = vueInstance()
    const visible = ref(true)
    provide('group', ins)

    return {
      prefix, visible, prefixSelectGroup,
    }
  },
  render() {
    const { prefixSelectGroup, visible, label } = this
    return <ul class={`${prefixSelectGroup}-wrap`} v-show={visible}>
      <li class={`${prefixSelectGroup}-title`}>{label}</li>
      <li>
        <ul class={prefixSelectGroup}>
          {getSlotsInRender(this)}
        </ul>
      </li>
      {getSlotsInRender(this, 'hr')}
    </ul>
  },
})