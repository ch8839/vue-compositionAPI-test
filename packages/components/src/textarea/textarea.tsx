import {
  defineComponent,
  PropType,
  computed,
  ref,
  watch,
  nextTick,
  onMounted,
  classNames,
  styles,
  useResetAttrs,
  useListeners,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import { isServer } from '@utils/env'
import { isNumber, isObject } from '@utils/type'
import calcNodeHeight from './calcNodeHeight'
import { useFormItem } from '@components/form-item/useFormItem'

export interface AutoSize {
  maxRows?: number;
  minRows?: number;
}

export default defineComponent({
  name: 'MtdTextarea',
  inheritAttrs: true,
  model: {
    prop: 'modelValue',
    event: 'update:modelValue',
  },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    invalid: {
      type: Boolean,
      default: false,
    },
    modelValue: [String, Number],
    autosize: {
      type: [Boolean, Object] as PropType<boolean | AutoSize>,
      default: false,
    },
    maxLength: Number,
    showCount: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['input', 'change', 'update:modelValue','focus','keyup','enter'],
  setup(props, ctx) {

    const { emit } = ctx

    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('textarea'))
    const formItemHook = useFormItem(props, ctx)

    const resetAttrs = useResetAttrs(ctx.attrs)

    const textareaCalcStyle = ref({})
    watch(() => props.modelValue,
      () => {
        nextTick(resizeTextarea)
      })

    onMounted(() => {
      resizeTextarea()
    })

    const setNativeInput = () => {
      const { value: textareaRefValue } = textareaRef
      if (
        textareaRefValue &&
        props.modelValue !== undefined &&
        textareaRefValue.value !== props.modelValue
      ) {
        textareaRefValue.value = String(props.modelValue)
      }
    }

    // handle Input
    // use isComposing
    const isComposing = ref(false)
    const handleInput = (e: Event,options?: { change: boolean }) => {
      e.stopPropagation && e.stopPropagation()
      const value = (e.target as HTMLTextAreaElement).value
      if (value !== props.modelValue) {
        emit('input', value)
        emit('update:modelValue', value)
        if (isComposing.value) {
          setTimeout(setNativeInput, 0)
        }
      }
      if (!isComposing.value || (options && options.change)) {
        formItemHook.m_handleChange(value) 
      }
    }

    const handleBlur = (e: Event) => {
      formItemHook.m_handleBlur(e)
    }

    // use focused
    const focused = ref(false)
    const handleFocus = (e: Event) => {
      focused.value = true
      emit('focus', e)
    }

    // handle enter
    const handleKeyup = (e: KeyboardEvent) => {
      emit('keyup', e)
    
      if (e.key === 'Enter' && !isComposing.value) {
        emit('enter', e)
      }
    }

    const focus = () => {
      textareaRef.value?.focus()
    }
    const blur = () => {
      textareaRef.value?.blur()
    }

    const textareaRef = ref<HTMLTextAreaElement | null>(null)

    const resizeTextarea = () => {
      if (isServer || !textareaRef.value) return
      if (!props.autosize) {
        return
      }

      const { minRows, maxRows }: AutoSize = isObject(props.autosize)
        ? (props.autosize as AutoSize)
        : {}

      textareaCalcStyle.value = calcNodeHeight(
        textareaRef.value,
        minRows,
        maxRows,
      )
    }

    const hasValue = computed(() => props.modelValue === 0 || !!props.modelValue)
    const len = computed(() => hasValue.value ? String(props.modelValue).length : 0)
    const m_showCount = computed(() => !!props.maxLength && props.showCount)

    const overstep = computed(() => {
      return isNumber(props.maxLength) && (len.value > props.maxLength)
    })

    const handleComposition = (e: InputEvent) => {
      const { type } = e
      emit(type as any, e)
      if (type === 'compositionend') {
        isComposing.value = false
        handleInput(e, { change: true })
      } else {
        isComposing.value = true
      }
    }

    const resetListeners = useListeners({
      input: handleInput,
      blur: handleBlur,
      focus: handleFocus,
      keyup: handleKeyup,
      compositionstart: handleComposition,
      compositionupdate: handleComposition,
      compositionend: handleComposition,
    }, ['change'])

    return {
      len,
      m_showCount,
      m_disabled: formItemHook.disabled,
      overstep,

      prefix,
      textareaRef,
      textareaCalcStyle,
      resetAttrs,
      resetListeners,
      isComposing,
      focused,

      // public functions
      focus,
      blur,
    }
  },
  render() {
    const {
      len, maxLength, m_showCount, overstep, resetAttrs,resetListeners,
      prefix, m_disabled: disabled, readonly, invalid, modelValue, textareaCalcStyle,
    } = this
    return <div
      class={classNames(this, `${prefix}-wrapper`)}
      style={styles(this)}
    >
      <textarea
        ref={'textareaRef'}
        class={{
          [prefix]: true,
          [`${prefix}-disabled`]: disabled,
          [`${prefix}-readonly`]: readonly,
          [`${prefix}-invalid`]: overstep || invalid,
        }}
        value={modelValue}
        maxlength={maxLength}
        readonly={readonly}
        disabled={disabled}
        style={textareaCalcStyle}
        {...resetAttrs}
        {...resetListeners}
      />
      {(m_showCount) && <span class={`${prefix}-count`}>{`${len}/${maxLength}`}</span>}
    </div>
  },
})
