import {
  computed,
  defineComponent,
  PropType,
  reactive,
  ref,
  toRefs,
  watch, classNames, styles,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import { isKeyDown, isKeyUp } from '@components/picker/util'
import { InputStatus } from '@components/input/types'
import { useFormItem } from '@components/form-item/useFormItem'
import MtdIcon from '@components/icon'

function isEmptyNullUndefined(val: unknown) {
  return val === '' || val === undefined || val === null
}

function isNumber(val: unknown) {
  return isEmptyNullUndefined(val) ? true : !isNaN(parseFloat(val as string))
}

function getPrecision(val?: number | string) {
  if (!val || isEmptyNullUndefined(val)) {
    return 0
  }
  const valString = val.toString()
  const dotPosition = valString.indexOf('.')
  let precision = 0
  if (dotPosition !== -1) {
    precision = valString.length - dotPosition - 1
  }
  return precision
}

export default defineComponent({
  name: 'MtdInputNumber',
  components: {
    MtdIcon,
  },
  inheritAttrs: false,
  model: {
    prop: 'modelValue',
    event: 'update:modelValue',
  },
  props: {
    modelValue: {
      type: [String, Number],
    },
    placeholder: String,
    name: String,
    size: String,
    disabled: {
      type: Boolean,
      default: false,
    },
    max: {
      type: Number,
      default: Infinity,
    },
    min: {
      type: Number,
      default: -Infinity,
    },
    step: {
      type: Number,
      default: 1,
    },
    formatter: {
      type: Function,
      default: (num: any) => num,
    },
    parser: {
      type: Function,
      default: (num: any) => num,
    },
    controls: {
      type: Boolean,
      default: true,
    },
    precision: {
      type: Number,
      validator: (val: number) => {
        return val === undefined || (val >= 0 && val === parseInt(val.toString(), 10))
      },
    },
    controlsPosition: String,
    status: {
      type: String as PropType<InputStatus>,
    },
    allowEmpty: Boolean,
    illegalClear: Boolean,
  },
  emits: ['input', 'change', 'update:modelValue'],
  setup(props, ctx) {
    const { emit } = ctx
    const config = useConfig()
    const self = reactive({
      prefix: config.getPrefixCls('input-number'),
    })
    const currentValue = ref<number | string>('')
    const userInput = ref<number | string | null>(null)

    const formItemHook = useFormItem(props, ctx)

    const getValidValueByMinAndMax = (val: number | string) => {
      if (props.allowEmpty && val === '') {
        return ''
      }
      if (val < props.min) {
        val = props.illegalClear ? '' : props.min
      }
      if (val > props.max) {
        val = props.illegalClear ? '' : props.max
      }
      return val
    }

    watch(
      () => props.modelValue,
      (val) => {
        if (!isNumber(val)) {
          console.warn('MTD[InputNumber] value shoule be number')
          return
        }
        val = isEmptyNullUndefined(val)
          ? ''
          : getValidValueByMinAndMax(parseFloat(val as string))
        currentValue.value = val as string
        userInput.value = null
      },
      { immediate: true },
    )

    const numPrecision = computed(() => {
      const { modelValue, step, precision } = props
      const stepPrecision = getPrecision(step)
      if (precision !== undefined) {
        if (stepPrecision > precision) {
          console.warn(
            'precision should not be less than the decimal places of step',
          )
        }
        return precision
      } else {
        let inputValuePrecision = getPrecision(modelValue)
        if (
          modelValue !== undefined &&
          currentValue &&
          typeof currentValue === 'number'
        ) {
          inputValuePrecision = getPrecision(currentValue)
        }
        return Math.max(inputValuePrecision, stepPrecision)
      }
    })

    const commonCrease = (type: 'up' | 'down', val?: number | string) => {
      let newVal = val || 0
      if (!isNumber(newVal)) {
        return currentValue.value
      }
      if (
        isEmptyNullUndefined(val) &&
        ((props.min && props.min !== -Infinity) || props.min === 0)
      ) {
        return props.min
      }
      newVal = parseFloat(newVal as string)
      const precisionFactor = Math.pow(10, numPrecision.value)
      const precisionNewVal = precisionFactor * newVal
      const precisionStep = precisionFactor * props.step
      const result =
        (type === 'up'
          ? precisionNewVal + precisionStep
          : precisionNewVal - precisionStep) / precisionFactor
      return Number(result.toFixed(numPrecision.value))
    }

    const increase = (val: number | string) => commonCrease('up', val)
    const decrease = (val: number | string) => commonCrease('down', val)
    const upHandleDisabled = computed(
      () => increase(currentValue.value) > props.max,
    )
    const downHandleDisabled = computed(
      () => decrease(currentValue.value) < props.min,
    )

    const precisionWrapper = (num: string | number) => {
      const { value: numPrecisionValue } = numPrecision
      if (numPrecisionValue !== undefined) {
        const numStr = String(num)
        if (numStr.includes('e') && num > 1) {
          // 如果是科学计数法，则不做处理，且对于小于1的小数保持原来的处理（不会使用科学计数法）
          return num
        }
        // 超出精度的舍弃，toFixed会四舍五入
        const pointArr = numStr.split('.')
        if (pointArr && Number(pointArr[1]) > numPrecisionValue) {
          num = pointArr[0] + '.' + pointArr[1].substr(0, numPrecisionValue)
        }
        num = Number(num).toFixed(numPrecisionValue)
      }
      return num
    }
    const displayValue = computed(() => {
      if (userInput.value !== null) return (props.formatter as any)(userInput.value)
      let val = currentValue.value
      const parseFloatValue = parseFloat(val as string)
      if (!isNaN(parseFloatValue)) {
        val = precisionWrapper(parseFloatValue)
      }
      val = (props.formatter as any)(val)
      return val
    })

    const handleInput = ({ target }: { target: EventTarget | null }) => {
      let val = (target as HTMLInputElement).value.trim().replace(/。/g, '.')
      val = (props.parser as any)(val)
      userInput.value = val
    }

    const setCurrentValue = (val: string | number | null) => {
      if (props.precision !== undefined) {
        if (!(props.allowEmpty && val === '')) {
          val = precisionWrapper(val as string | number)
        }
      }
      val = getValidValueByMinAndMax(val as number)
      if (currentValue.value === val) {
        return
      }
      // toFixed返回的是字符串
      val = isEmptyNullUndefined(val) ? null : Number(val)
      emit('input', val)
      emit('update:modelValue', val)
      formItemHook.m_handleChange(val)
      userInput.value = null
      currentValue.value = val === null ? '' : val
    }

    const handleChange = () => {
      const val = userInput.value
      if (isNumber(val)) {
        // double parseFloag, -0 -> 0
        const newVal =
          val === '' ? '' : parseFloat(String(parseFloat(val as string)))
        setCurrentValue(newVal)
      }
      userInput.value = null
    }

    const handleKeydown = (e: KeyboardEvent) => {
      if (isKeyUp(e)) {
        e.preventDefault()
        handleUpStep(e)
      } else if (isKeyDown(e)) {
        e.preventDefault()
        handleDownStep(e)
      }
    }

    const m_disabled = formItemHook.disabled

    const handleUpStep = (e: KeyboardEvent | MouseEvent) => {
      e.preventDefault()
      if (m_disabled.value || upHandleDisabled.value) return
      const val = userInput.value || currentValue.value
      const newVal = increase(val)
      setCurrentValue(newVal)
    }

    const handleDownStep = (e: KeyboardEvent | MouseEvent) => {
      e.preventDefault()
      if (m_disabled.value || downHandleDisabled.value) return
      const val = userInput.value || currentValue.value
      const newVal = decrease(val)
      setCurrentValue(newVal)
    }

    const m_status = formItemHook.status

    return {
      ...toRefs(self), m_status,
      downHandleDisabled,
      upHandleDisabled,
      displayValue,
      m_disabled: m_disabled,
      handleKeydown,
      handleUpStep,
      handleDownStep,
      handleInput,
      handleChange,
    }
  },
  render() {
    const { m_disabled: disabled, controls, controlsPosition, size, downHandleDisabled, upHandleDisabled,
      placeholder, displayValue, prefix, m_status,
    } = this
    return <div
      class={classNames(this, {
        [`${prefix}-wrapper`]: true,
        [`${prefix}-disabled`]: disabled,
        [`${prefix}-${m_status}`]: m_status,
        [`${prefix}-without-controls`]: !controls,
        [`${prefix}-controls-right`]: controlsPosition === 'right',
        [`${prefix}-${size}`]: !!size,
      })}
      style={styles(this)}
    >
      {controls && <span
        class={[{ [`${prefix}-handle-disabled`]: downHandleDisabled },
        `${prefix}-handle`, `${prefix}-handle-down`,
        ]}
        onClick={this.handleDownStep}
      >
        <mtd-icon name={controlsPosition === 'right' ? 'down' : 'remove'} />
      </span>}
      {controls && <span
        class={[{ [`${prefix}-handle-disabled`]: upHandleDisabled },
        `${prefix}-handle`, `${prefix}-handle-up`,
        ]}
        onClick={this.handleUpStep}
      >
        <mtd-icon name={controlsPosition === 'right' ? 'up' : 'add'} />
      </span >}
      <input
        class={prefix}
        type="text"
        autocomplete="off"
        placeholder={placeholder}
        value={displayValue}
        disabled={disabled}
        ref="inputRef"
        onInput={this.handleInput}
        onChange={this.handleChange}
        onKeydown={this.handleKeydown}
      />
    </div >
  },
})
