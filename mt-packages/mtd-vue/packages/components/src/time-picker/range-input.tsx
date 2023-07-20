import {
  defineComponent,
  PropType,
  computed,
  ref,
  watch,
  classNames, styles,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import { MTDUIComponentSize } from 'src/types'
import { useAttrs, useListeners } from '@components/hooks/pass-through'

import Icon from '@components/icon'
import { Dayjs } from 'dayjs'
import { TimePickerType } from './types'
import { DatePickerType } from '@components/date-picker/types'
import { isArray } from '@components/__utils__/type'

export default defineComponent({
  name: 'MtdRangeInput',
  components: {
    MtdIcon: Icon,
  },
  inheritAttrs: false,
  props: {
    size: {
      type: String as PropType<MTDUIComponentSize>,
      default: '',
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    invalid: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
    },
    prefixIcon: String,
    suffixIcon: String,
    readonly: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: [String, Array],
    },
    noReadonlyClass: {
      type: Boolean,
      default: false,
    },
    clearableOnReadonly: { // 当 readonly 时是否可以清空，仅作用于内部模拟 input
      type: Boolean,
      default: false,
    },

    // 用于时间选择器
    internalValue: {
      type: Array as PropType<Dayjs[]>,
      default: () => [],
    },
    type: {
      type: String as PropType<TimePickerType | DatePickerType>,
      default: 'time',
    },
    valueFormat: String,
    format: String,
  },
  emits: ['focus', 'input', 'change', 'blur', 'focusLeft', 'focusRight'],
  setup(props, { attrs, emit, slots }) {
    const RANGE_SEPARATOR = ' - '

    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('range-picker'))
    const prefixInput = computed(() => config.getPrefixCls('input'))

    const inputValueLeft = ref('')
    const inputValueRight = ref('')
    const inputValue = ref('')


    watch(() => props.value, () => {
      if (props.value) {
        [inputValueLeft.value, inputValueRight.value] = props.value.split(RANGE_SEPARATOR)
      } else {
        [inputValueLeft.value, inputValueRight.value] = ['', '']
      }
    }, { immediate: true })

    // use focused
    const focused = ref(false)
    const handleFocus = (focusSide: String) => {
      return (e?: Event) => {
        focused.value = true
        emit('focus', e)
        if (focusSide === 'left') {
          emit('focusLeft', e)
        } else {
          emit('focusRight', e)
        }
      }
    }
    const handleBlur = (e: Event) => {
      submit()
      focused.value = false
      emit('blur', e)
    }

    // use hover
    const hovering = ref(false)
    const handleMouseenter = () => {
      if (!props.disabled) {
        hovering.value = true
      }
    }
    const handleMouseleave = () => {
      if (!props.disabled) {
        hovering.value = false
      }
    }

    // use input
    const inputLeft = ref<HTMLInputElement | null>(null)
    const inputRight = ref<HTMLInputElement | null>(null)
    const focus = (focusSide = 'left') => {
      if (focusSide === 'left') {
        inputLeft.value?.focus()
      } else {
        inputRight.value?.focus()
      }
      handleFocus(focusSide)()
    }
    const blur = () => {
      inputLeft.value?.blur()
      inputRight.value?.blur()
    }

    // use from
    const _invalid = computed(() => props.invalid)

    // value
    const hasValue = computed(() => !!props.value)

    const _clearable = computed(() => {
      return props.clearable &&
        !props.disabled &&
        (props.clearableOnReadonly || !props.readonly)
    })

    const showClear = computed(() => {
      return _clearable.value && hasValue.value && (focused.value || hovering.value)
    })

    const hasSuffix = computed(() => {
      return props.clearable || !!(props.suffixIcon || slots.suffix)
    })
    const hasPrefix = computed(() => !!(props.prefixIcon || slots.prefix))


    const handlePrefixClick = (e: Event) => {
      focus()
      emit('click-prefix', e)
    }
    const handleSuffixClick = (e: Event) => {
      focus()
      emit('click-suffix', e)
    }
    const handleClearClick = (e: Event) => {
      e.stopPropagation()
      emit('clear')
      handleInput({ target: { value: '' } } as any)
    }

    const handleClick = () => {
      if (!props.disabled) {
        !hasValue.value && focus()
      }
    }
    const stopClick = (event: Event) => {
      event.stopPropagation()
    }

    function handleInput(side: string) {
      return (e: InputEvent) => {
        e.stopPropagation && e.stopPropagation()
        const { value } = e.target as HTMLInputElement
        if (side === 'left') {
          inputValueLeft.value = value
        } else {
          inputValueRight.value = value
        }
      }
    }
    // handle enter
    const handleKeyup = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        emit('enter', e)
        submit()
      }
    }

    const myAttrs = useAttrs(attrs)
    const myListenersLeft = useListeners({
      input: handleInput('left'),
      keyup: handleKeyup,
      blur: handleBlur,
      focus: handleFocus('left'),
    }, ['focus', 'input', 'change', 'blur'])
    const myListenersRight = useListeners({
      input: handleInput('right'),
      keyup: handleKeyup,
      blur: handleBlur,
      focus: handleFocus('right'),
    }, ['focus', 'input', 'change', 'blur'])
    // it will trigger change event twice if not remove

    function submit() {
      const inputValue = inputValueLeft.value + RANGE_SEPARATOR + inputValueRight.value
      if (inputValue !== props.value) {
        emit('input', inputValue)
        emit('change', inputValue)
      }
    }


    return {
      myAttrs,
      myListenersLeft,
      myListenersRight,

      inputLeft,
      inputRight,
      inputValueLeft,
      inputValueRight,
      inputValue,
      prefix,
      prefixInput,

      focused,
      hovering,
      showClear,

      hasSuffix,
      hasPrefix,
      handleClearClick,
      handlePrefixClick,
      handleSuffixClick,
      handleFocus,

      handleClick,
      stopClick,
      handleMouseenter,
      handleMouseleave,

      _invalid,
      // public methods
      focus,
      blur,
    }
  },
  render() {
    const {
      prefix,
      prefixInput,
    } = this

    const suffixIconRender = () => {
      const {
        showClear,
        suffixIcon,
        handleClearClick,
        handleSuffixClick,
      } = this
      if (showClear) {
        return <mtd-icon class={`${prefix}-clear`} name='error-circle' onClick={handleClearClick}></mtd-icon>
      } else {
        return this.$slots.suffix || <mtd-icon name={suffixIcon} onClick={handleSuffixClick} />
      }
    }

    // use in datetime range

    const {
      focused, hovering,
      prefixIcon, hasPrefix, hasSuffix,
      disabled, readonly, noReadonlyClass, _invalid, overstep,
      size, genre, placeholder,
      inputValueLeft, inputValueRight,
      stopClick,
      handleClick, handlePrefixClick,
      handleMouseenter, handleMouseleave,
    } = this

    return <div
      class={classNames(this, {
        [`${prefixInput}-wrapper`]: true,
        [`${prefixInput}-focused`]: !disabled && focused,
        [`${prefixInput}-hover`]: !disabled && hovering,
        [`${prefixInput}-group`]: this.$slots.prepend || this.$slots.append,
        [`${prefixInput}-disabled`]: disabled,
        [`${prefixInput}-readonly`]: !noReadonlyClass && readonly,
        [`${prefixInput}-invalid`]: _invalid || overstep,
        [`${prefixInput}-${size}`]: !!size,
        [`${prefixInput}-${genre}`]: !!genre,
        [prefix]: true,
      })}
      style={styles(this)}
      onClick={handleClick}
      onMouseenter={handleMouseenter}
      onMouseleave={handleMouseleave}
    >
      {this.$slots.prepend && <div onClick={stopClick}
        class={`${prefixInput}-group-prepend`}>
        {this.$slots.prepend}
      </div>}
      {hasPrefix && <span class={`${prefixInput}-prefix-inner`}>
        {this.$slots.prefix || <i class={prefixIcon} onClick={handlePrefixClick} />}
      </span>}

      <input
        ref={'inputLeft'}
        {...this.myAttrs}
        {...this.myListenersLeft}
        placeholder={isArray(placeholder) ? placeholder[0] : placeholder}
        type={'text'}
        value={inputValueLeft}
        readonly={readonly}
        disabled={disabled}
        class={prefixInput}
        onChange={(e: Event) => { e.stopPropagation() }}
      />
      <span class="range-separator"> ~ </span>
      <input
        ref={'inputRight'}
        {...this.myAttrs}
        {...this.myListenersRight}
        placeholder={isArray(placeholder) ? placeholder[1] : placeholder}
        type={'text'}
        value={inputValueRight}
        readonly={readonly}
        disabled={disabled}
        class={prefixInput}
        onChange={(e: Event) => { e.stopPropagation() }}
      />

      {hasSuffix && <span class={`${prefixInput}-suffix-inner`}>
        {hasSuffix && suffixIconRender()}
      </span>}
      {this.$slots.append && <div onClick={stopClick}
        class={`${prefixInput}-group-append`}>
        {this.$slots.append}
      </div>}
    </div >
  },
})
