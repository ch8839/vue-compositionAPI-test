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
    value: [String, Number],
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
  emits: ['input', 'change'],
  setup(props, ctx) {

    const { emit } = ctx

    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('textarea'))
    const formItemHook = useFormItem(props, ctx)

    const textareaCalcStyle = ref({})
    watch(() => props.value,
      () => {
        nextTick(resizeTextarea)
      })

    onMounted(() => {
      resizeTextarea()
    })

    const handleInput = (e: Event) => {
      const v = (e.target as HTMLTextAreaElement).value
      emit('input', v)
      formItemHook._handleChange(v)
    }

    const handleBlur = (e: Event) => {
      formItemHook._handleBlur(e)
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

    const hasValue = computed(() => props.value === 0 || !!props.value)
    const len = computed(() => hasValue.value ? String(props.value).length : 0)
    const _showCount = computed(() => !!props.maxLength && props.showCount)

    const overstep = computed(() => {
      return isNumber(props.maxLength) && (len.value > props.maxLength)
    })

    return {
      len,
      _showCount,
      overstep,

      prefix,
      textareaRef,
      textareaCalcStyle,
      handleInput,
      handleBlur,

      // public functions
      focus,
      blur,
    }
  },
  render() {
    const {
      len, maxLength, _showCount, overstep,
      prefix, disabled, readonly, invalid, value, textareaCalcStyle, handleInput,
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
        value={value}
        readonly={readonly}
        disabled={disabled}
        style={textareaCalcStyle}
        onInput={handleInput}
        onBlur={this.handleBlur}
      />
      {(_showCount) && <span class={`${prefix}-count`}>{`${len}/${maxLength}`}</span>}
    </div>
  },
})
