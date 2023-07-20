import {
  defineComponent,
  computed,
  PropType,
  ref,
  nextTick,
  watch,
  vueInstance,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import { useRadioProvider, RadioButtonType } from '@components/radio-group/useRadioGroup'
import { useFormItem } from '@components/form-item/useFormItem'
import getElement from '@components/hooks/getElement'

export default defineComponent({
  name: 'MtdRadioGroup',
  inheritAttrs: true,
  model: {
    prop: 'modelValue',
    event: 'update:modelValue',
  },
  props: {
    modelValue: [String, Number, Boolean, Function, Object, Array, Symbol],
    disabled: { type: Boolean, default: false },
    size: String,
    name: String,
    type: {
      type: String as PropType<RadioButtonType>,
      default: 'line',
    },
  },
  emits: ['input', 'change'],
  setup(props, ctx) {
    const ins = vueInstance()
    const { emit } = ctx
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('radio-group'))
    const buttonPrefix = computed(() => config.getPrefixCls('radio-button'))
    const el = getElement()

    // 滑块hook
    const sliderItemStyle = ref<any>({})
    const getSliderItemStyle = () => {
      const className = `${buttonPrefix.value}-checked`
      if (el.value) {
        const checkedDom = el.value?.querySelector('.' + className)

        const result = {
          height: checkedDom?.clientHeight + 'px',
          width: checkedDom?.clientWidth + 'px',
          left: (checkedDom as any).offsetLeft + 'px',
        }
        return result
      }
    }
    watch(() => props.modelValue, () => {
      if (props.type === 'slider') {
        nextTick(() => {
          sliderItemStyle.value = getSliderItemStyle()
        })
      }
    }, { immediate: true })
    watch(() => props.size, () => {
      if (props.type === 'slider') {
        setTimeout(() => {
          sliderItemStyle.value = getSliderItemStyle()
        }, 300)
      }
    })


    const emitter = useRadioProvider(ins)
    const formItemHook = useFormItem(props, ctx)

    const handleChange = (radioValue: any) => {
      if (props.modelValue !== radioValue) {
        emit('input', radioValue)
        emit('update:modelValue', radioValue)
        formItemHook._handleChange(radioValue)
      }
    }

    emitter.on('radioChange', handleChange)

    return {
      prefix, sliderItemStyle, emitter,
    }
  },
  render() {
    const { prefix, type, sliderItemStyle } = this
    return <div class={[prefix, `${prefix}-${type}`]} >
      {this.$slots.default}
      {type === 'slider' &&
        <div class={[`${prefix}-slider-item`]} style={sliderItemStyle} />
      }
    </div>
  },
})
