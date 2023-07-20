import {
  defineComponent,
  PropType,
  computed,
  reactive,
  toRefs,
  watch,
  getSlotsInRender,
  getScopedSlotsInRender,
  vSlots,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import { isString } from '@utils/type'
import { RateTextPosition } from './types'
import MtdTooltip from '@components/tooltip'
import { useFormItem } from '@components/form-item/useFormItem'

function parseToKV(v: string | Record<string, any>, count?: number) {
  let map: any = v
  if (isString(v)) {
    map = {
      [count!]: v,
    }
  }
  const keys = Object.keys(map)
  return keys
    .sort((a: any, b: any) => a - b)
    .reduce((s, k) => {
      s[k] = map[k]
      return s
    }, {} as Record<string, any>)
}

function getValueFromMap(v: number, map: Record<string, any>) {
  const keys = Object.keys(map)
  const current = keys.find((key: any, index) => {
    const next: any = keys[index + 1]
    return (index === 0 && v < key) || (v >= key && (v < next || !next))
  })
  return map[current!]
}

export default defineComponent({
  name: 'MtdRate',
  components: {
    MtdTooltip,
  },
  inheritAttrs: true,
  model: {
    prop: 'modelValue',
    event: 'update:modelValue',
  },
  props: {
    modelValue: {
      type: Number,
      default: 0,
    },
    count: {
      type: Number,
      default: 5,
    },
    classes: Object,
    icon: {
      type: [String, Object] as PropType<string | Record<string, any>>,
      default: 'star-rate',
    },
    color: [String, Object] as PropType<string | Record<string, any>>,
    disabled: Boolean,
    voidColor: String,
    disabledVoidColor: String,
    voidIcon: String,
    disabledVoidIcon: String,
    allowHalf: {
      type: Boolean,
      default: false,
    },
    allowClear: {
      type: Boolean,
      default: false,
    },
    texts: {
      type: Array as PropType<string[]>,
    },
    textPosition: {
      type: String as PropType<RateTextPosition>,
      default: 'right',
    },
    tooltipProps: {
      type: Object,
      default: () => { },
    },
  },
  emits: ['change', 'input', 'update:modelValue'],
  setup(props, ctx) {
    const { emit } = ctx
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('rate'))
    const iconPrefix = config.getIconCls

    const state = reactive<{
      currentValue: number,
      hoverIndex: number,
      pointerAtLeftHalf: boolean,
      isHover: boolean,
    }>({
      currentValue: props.modelValue,
      hoverIndex: -1,
      pointerAtLeftHalf: false,
      isHover: false,
    })

    // use form-item
    const formItemHook = useFormItem(props, ctx)
    const m_disabled = formItemHook.disabled

    // @Computed
    const rateClass = computed(() => {
      if (props.classes) {
        return getValueFromMap(props.modelValue, props.classes)
      }
      return undefined
    })
    const text = computed(() => {
      if (props.texts) {
        // todo: 需要和设计确认是否是向上取整
        return props.texts[Math.ceil(props.modelValue) - 1]
      }
      return ''
    })
    const valueInteger = computed(() => parseInt(props.modelValue as any))
    const valueDecimal = computed(() => props.modelValue * 100 - valueInteger.value * 100)
    const icons = computed<Record<string, any>>(() => parseToKV(props.icon))
    const activeIconClass = computed<string>(() => getValueFromMap(props.modelValue, icons.value))
    const voidIconClass = computed(() => {
      const icon = m_disabled.value ? props.disabledVoidIcon : props.voidIcon
      return icon || activeIconClass.value
    })
    const iconClasses = computed(() => {
      const result: string[] = []
      let i = 0
      let threshold = state.currentValue
      if (
        props.allowHalf &&
        state.currentValue !== Math.floor(state.currentValue)
      ) {
        threshold--
      }
      for (; i < threshold; i++) {
        result.push(activeIconClass.value)
      }
      for (; i < props.count; i++) {
        result.push(voidIconClass.value)
      }
      return result.map(iconName => iconPrefix(iconName))
    })
    const colors = computed(() => props.color ? parseToKV(props.color) : {})
    const activeColor = computed(() => getValueFromMap(state.currentValue, colors.value))
    const decimalStyle = computed(() => {
      let width = ''
      if (m_disabled.value) {
        width = `${valueDecimal.value}%`
      } else if (props.allowHalf) {
        width = '50%'
      }
      return {
        color: activeColor.value,
        width,
      }
    })

    // @Watch
    watch(() => props.modelValue, (val) => {
      state.currentValue = val
      state.pointerAtLeftHalf = (val !== Math.floor(val))
    }, { immediate: true })

    // @Methods
    function getIconStyle(item: number) {
      const voidColor = m_disabled.value ? props.disabledVoidColor : props.voidColor
      const color = item <= state.currentValue ? activeColor.value : voidColor
      return {
        color,
      }
    }

    function getItemClass(itemValue: number) {
      if (state.currentValue !== parseInt(state.currentValue as any)) {
        // 包含小数
        if (state.currentValue > itemValue) {
          return `${prefix.value}-item-full`
        } else if (state.currentValue + 1 > itemValue) {
          return `${prefix.value}-item-half`
        }
      } else if (state.currentValue >= itemValue) {
        return `${prefix.value}-item-full`
      }
      return ''
    }

    function showDecimalIcon(item: number) {
      const showWhenDisabled =
        m_disabled.value &&
        valueDecimal.value > 0 &&
        item - 1 < props.modelValue &&
        item > props.modelValue

      const showWhenAllowHalf =
        props.allowHalf &&
        state.pointerAtLeftHalf &&
        item - 0.5 <= state.currentValue &&
        item > state.currentValue
      return showWhenDisabled || showWhenAllowHalf
    }

    function setCurrentValue(value: number, event: MouseEvent) {
      state.isHover = true
      if (m_disabled.value) {
        return
      }
      if (props.allowHalf) {
        const target = event.currentTarget as HTMLElement
        state.pointerAtLeftHalf = event.offsetX * 2 <= target.clientWidth
        state.currentValue = state.pointerAtLeftHalf ? value - 0.5 : value
      } else {
        state.currentValue = value
      }
      state.hoverIndex = value
    }

    function resetCurrentValue() {
      if (m_disabled.value) {
        return
      }
      if (props.allowHalf) {
        state.pointerAtLeftHalf =
          props.modelValue !== Math.floor(props.modelValue)
      }
      state.currentValue = props.modelValue
      state.hoverIndex = -1
    }

    function selectValue(value: number) {
      if (m_disabled.value) {
        return
      }
      let nextValue = value
      if (props.allowHalf && state.pointerAtLeftHalf) {
        nextValue = state.currentValue
      }
      if (props.allowClear && nextValue === props.modelValue) {
        nextValue = 0
      }
      resetCurrentValue()
      emit('input', nextValue)
      emit('update:modelValue', nextValue)
      formItemHook.m_handleChange(nextValue)
    }

    function handleMouseleave() {
      state.isHover = false
      resetCurrentValue()
    }


    const computedCollection = {
      rateClass, text, iconClasses, activeIconClass, decimalStyle, m_disabled,
    }
    const methodsCollection = {
      resetCurrentValue, getItemClass, setCurrentValue, selectValue, getIconStyle, showDecimalIcon, handleMouseleave,
    }

    return {
      prefix, iconPrefix,
      ...toRefs(state),
      ...computedCollection,
      ...methodsCollection,
    }
  },
  render() {
    const {
      prefix, rateClass, m_disabled: disabled, currentValue, text, count, tooltipProps, texts,
      iconClasses, hoverIndex, activeIconClass, decimalStyle, textPosition,
    } = this

    const $render = getScopedSlotsInRender(this, 'default')?.({ value: currentValue })

    return <div
      class={[{
        [`${prefix}-disabled`]: disabled,
        [`${prefix}-text-${textPosition}`]: true,
      }, rateClass, prefix]}
      aria-valuenow={currentValue}
      aria-valuetext={text}
      aria-valuemin={0}
      aria-valuemax={count}
      tabindex={0}
      onMouseleave={this.handleMouseleave}
    >

      <div class={`${prefix}-items-wrapper`}>
        {new Array(count).fill(0).map((num, index) => {

          const tooltipSlots = {
            content: () => getSlotsInRender(this, 'content') || (texts ? texts[item - 1] : ''),
          }
          const item = index + 1
          return <mtd-tooltip
            {...tooltipProps}
            placement="top"
            class={`${prefix}-item-wrapper`}
            disabled={disabled || (!this.$slots.tooltip && !texts)}
            close-delay={0}
            open-delay={0}
            key={item}
            {...vSlots(tooltipSlots)}
            v-slots={tooltipSlots}
          >
            <span class={`${prefix}-item-wrapper`} >
              <span
                class={[this.getItemClass(item), `${prefix}-item`]}
                onMousemove={(e: MouseEvent) => this.setCurrentValue(item, e)}
                onClick={this.selectValue.bind(this, item)}
              >
                <i
                  class={[iconClasses[item - 1], `${prefix}-icon`, { hover: hoverIndex === item }]}
                  style={this.getIconStyle(item)}
                />

                <i
                  style={{
                    ...decimalStyle,
                    opacity: this.showDecimalIcon(item) ? 1 : 0,
                  }}
                  class={[`${prefix}-decimal`, this.iconPrefix(activeIconClass)]}
                />

              </span>
            </span>
          </mtd-tooltip>
        })}
      </div>

      {($render || text) &&
        <span class={`${prefix}-text`}>
          {$render || text}
        </span>
      }

    </div >
  },
})

