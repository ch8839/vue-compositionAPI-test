import {
  defineComponent,
  computed,
  ref,
  useResetAttrs,
  useListeners,
  vueInstance,
  getSlotsInRender,
  classNames, styles,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import { usePassword } from './usePassword'
import { isNumber } from '@utils/type'
import Icon from '@components/icon'
import { useFormItem } from '@components/form-item/useFormItem'
import props from "./props"

const StatusIconMap = {
  'error': 'error-circle',
  'success': 'success-circle',
  'warning': 'warning-circle',
}

export default defineComponent({
  name: 'MtdInput',
  components: {
    MtdIcon: Icon,
  },
  inheritAttrs: false,
  model: {
    prop: 'modelValue',
    event: 'update:modelValue',
  },
  props: props(),
  emits: [
    'input',
    'update:modelValue',
    'change',
    'clear',
    'click-prefix',
    'click-suffix',
    'focus',
    'blur',
    'keyup',
    'enter',
    'compositionupdate',
    'compositionstart',
    'compositionend',
  ],
  slots: [
    'prepend',
    'append',
    'prefix',
    'suffix',

    'input', // 非公开slot
  ],
  setup(props, { attrs, emit, slots }) {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('input'))
    const iconPrefix = config.getIconCls
    const ins = vueInstance()

    // use form-item
    const formItemHook = useFormItem(props, { attrs, emit, slots })

    // use focused
    const focused = ref(false)
    const handleFocus = (e: Event) => {
      focused.value = true
      emit('focus', e)
    }
    const handleBlur = (e: Event) => {
      focused.value = false
      formItemHook._handleBlur(e) // emit('blur', e)
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
    const inputRef = ref<HTMLInputElement | null>(null)
    const focus = () => {
      inputRef.value?.focus()
    }
    const blur = () => {
      inputRef.value?.blur()
    }
    const setNativeInput = () => {
      const { value: inputRefValue } = inputRef
      if (
        inputRefValue &&
        props.modelValue !== undefined &&
        inputRefValue.value !== props.modelValue
      ) {
        inputRefValue.value = String(props.modelValue)
      }
    }

    // use form
    const _loading = formItemHook.loading
    const _status = computed(() => {
      if (overstep.value) {
        return 'error'
      }
      return formItemHook.status.value
    })
    const _hasFeedback = formItemHook.hasFeedback

    // handle Input
    // use isComposing
    const isComposing = ref(false)
    const handleInput = (e: Event, options?: { change: boolean }) => {
      e.stopPropagation && e.stopPropagation()
      const { value } = e.target as HTMLInputElement
      if (value !== props.modelValue) {
        emit('input', value)
        emit('update:modelValue', value)
        if (isComposing.value) {
          setTimeout(setNativeInput, 0)
        }
      }
      if (!isComposing.value || (options && options.change)) {
        formItemHook._handleChange(value) // emit('change', value)
      }
    }

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

    // handle enter
    const handleKeyup = (e: KeyboardEvent) => {
      emit('keyup', e)

      if (e.key === 'Enter' && !isComposing.value) {
        emit('enter', e)
      }
    }

    // value
    const hasValue = computed(() => props.modelValue === 0 || !!props.modelValue)
    const len = computed(() => hasValue.value ? String(props.modelValue).length : 0)

    const _clearable = computed(() => {
      return props.clearable &&
        !props.disabled &&
        (props.clearableOnReadonly || !props.readonly)
    })

    const showClear = computed(() => {
      return _clearable.value && hasValue.value && (focused.value || hovering.value)
    })
    const _showCount = computed(() => !!props.maxLength && props.showCount)

    const hasSuffix = () => {
      return _loading.value
        || props.clearable
        || !!(props.suffixIcon || getSlotsInRender(ins, 'suffix'))
        || props.type === 'password'
        || _hasFeedback.value
    }
    const hasPrefix = () => !!(props.prefixIcon || getSlotsInRender(ins, 'prefix'))

    const [showPassword, handlePasswordIconClick] = usePassword()
    const _type = computed(() => {
      if (props.type === 'password' && showPassword.value) {
        return 'text'
      } else {
        return props.type
      }
    })

    const overstep = computed(() => {
      return isNumber(props.maxLength) && (len.value > props.maxLength)
    })

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
        focus()
      }
    }
    const stopClick = (event: Event) => {
      event.stopPropagation()
    }

    const resetAttrs = useResetAttrs(attrs)
    const resetListeners = useListeners({
      input: handleInput,
      focus: handleFocus,
      blur: handleBlur,
      keyup: handleKeyup,
      compositionstart: handleComposition,
      compositionupdate: handleComposition,
      compositionend: handleComposition,
    }, ['change'])
    // it will trigger change event twice if not remove

    return {
      resetAttrs,
      resetListeners,

      inputRef,
      prefix,
      iconPrefix,

      _type,
      showPassword,
      handlePasswordIconClick,

      focused,
      hovering,
      showClear,
      _showCount,

      hasSuffix,
      hasPrefix,
      handleClearClick,
      handlePrefixClick,
      handleSuffixClick,

      handleClick,
      stopClick,
      handleMouseenter,
      handleMouseleave,

      len,
      overstep,
      _loading, _status, _hasFeedback,
      isComposing,
      // public methods
      focus,
      blur,
    }
  },

  render() {
    const {
      prefix, iconPrefix,
    } = this

    const suffixIconRender = () => {
      const {
        _loading, showClear, type, showPassword,
        suffixIcon,
        handleClearClick, handleSuffixClick,
        handlePasswordIconClick,
      } = this
      if (_loading) {
        return <mtd-icon name='loading' />
      } else if (showClear) {
        return <mtd-icon class={`${prefix}-clear`} name='error-circle' onClick={handleClearClick}></mtd-icon>
      } else if (type === 'password') {
        const passwordIcon = showPassword ? "visibility-off-o" : "visibility-on-o"
        return <mtd-icon name={passwordIcon} style="cursor:pointer" onClick={handlePasswordIconClick} />
      } else {
        return getSlotsInRender(this, 'suffix') || <i class={iconPrefix(suffixIcon)} onClick={handleSuffixClick} />
      }
    }

    const {
      focused, hovering, resetAttrs, resetListeners,
      prefixIcon, hasPrefix, hasSuffix,
      disabled, readonly, noReadonlyClass,
      size, genre, _type,
      modelValue, _showCount, maxLength, len,
      _hasFeedback, _status,
      stopClick,
      handleClick, handlePrefixClick,
      handleMouseenter, handleMouseleave,
    } = this
    return <div
      class={classNames(this, {
        [`${prefix}-wrapper`]: true,
        [`${prefix}-focused`]: !disabled && !readonly && focused,
        [`${prefix}-hover`]: !disabled && hovering,
        [`${prefix}-group`]: getSlotsInRender(this, 'prepend') || getSlotsInRender(this, 'append'),
        [`${prefix}-disabled`]: disabled,
        [`${prefix}-readonly`]: !noReadonlyClass && readonly,
        [`${prefix}-${_status}`]: _status,
        [`${prefix}-${size}`]: !!size,
        [`${prefix}-${genre}`]: !!genre,
      })}
      style={styles(this)}
      onClick={handleClick}
      onMouseenter={handleMouseenter}
      onMouseleave={handleMouseleave}
    >
      {getSlotsInRender(this, 'prepend') &&
        <div onClick={stopClick}
          class={`${prefix}-group-prepend`}>
          {getSlotsInRender(this, 'prepend')}
        </div>
      }
      {hasPrefix() &&
        <span class={`${prefix}-prefix-inner`}>
          {getSlotsInRender(this, 'prefix') || <i class={iconPrefix(prefixIcon)} onClick={handlePrefixClick} />}
        </span>
      }
      {getSlotsInRender(this, 'input') ||
        <input
          ref={'input'}
          {...resetAttrs}
          {...resetListeners}
          type={_type}
          value={modelValue}
          readonly={readonly}
          disabled={disabled}
          class={prefix}
          onChange={(e: Event) => { e.stopPropagation() }}
        />
      }
      {(hasSuffix() || _showCount) &&
        <span class={`${prefix}-suffix-inner`}>
          {hasSuffix() && suffixIconRender()}
          {_showCount && <span class={`${prefix}-count`}>{`${len}/${maxLength}`}</span>}
          {_hasFeedback && _status && StatusIconMap[_status] &&
            <mtd-icon name={StatusIconMap[_status]} class="status-icon" />
          }
        </span>
      }
      {getSlotsInRender(this, 'append') &&
        <div onClick={stopClick}
          class={`${prefix}-group-append`}>
          {getSlotsInRender(this, 'append')}
        </div>
      }
    </div >
  },
})
