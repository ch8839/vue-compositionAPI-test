import {
  defineComponent,
  computed,
  markRaw,
  getSlotsInRender,
  vueInstance,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import mitt from '@utils/mitt'
import { provideCheckboxGroup } from './useCheckboxGroup'
import { useFormItem } from '@components/form-item/useFormItem'

export default defineComponent({
  name: 'MtdCheckboxGroup',
  inheritAttrs: true,
  model: {
    prop: 'modelValue',
    event: 'update:modelValue',
  },
  props: {
    modelValue: {
      type: Array,
      default: () => [],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    name: String,
    size: String,
    min: Number,
    max: Number,
  },
  emits: ['input', 'change', 'update:modelValue'],
  setup(props, ctx) {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('checkbox-group'))
    const ins = vueInstance()
    const emit = ctx.emit

    const emitter = markRaw(mitt())

    provideCheckboxGroup(ins)
    const formItemHook = useFormItem(props, ctx)

    const handleChange = (checked: boolean, value: any) => { // 🤡value可能不是数组
      const index = props.modelValue.indexOf(value)
      const nextValue = [...props.modelValue]
      if (checked) {
        nextValue.push(value)
      } else if (index !== -1) {
        nextValue.splice(index, 1)
      }
      const length = nextValue.length
      if (
        (checked && props.max && length > props.max) ||
        (!checked && props.min && length < props.min)
      ) {
        return
      }
      emit('input', nextValue)
      formItemHook.m_handleChange(nextValue)
      emit('update:modelValue', nextValue)
    }
    emitter.on('checkboxChange', handleChange)

    return {
      prefix,
      emitter,
      m_disabled: formItemHook.disabled,
    }
  },
  render() {
    const { prefix } = this
    return <div class={prefix}>{getSlotsInRender(this)}</div>
  },
})
