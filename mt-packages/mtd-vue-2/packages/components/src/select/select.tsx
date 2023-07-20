import {
  defineComponent,
  PropType,
  computed,
  ref,
  watch,
  onMounted,
  nextTick,
  hasProp,
  vueInstance,
  getSlotsInRender,
  toProps,
  getAllScopedSlots,
  vSlots,
  useResetAttrs,
  getScopedSlotsInRender,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import {
  isKeyEsc,
  isKeyTab, isKey,
} from '@components/picker/util'

import MtdSelectInput from '@components/select-input'
import MtdPicker from '@components/picker'
import { useFormItem } from '@components/form-item/useFormItem'
import { InputStatus } from '@components/input/types'
import { VirtualOption } from '@components/virtual/types'

export default defineComponent({
  name: 'MtdSelect',
  components: {
    MtdSelectInput,
    MtdPicker,
  },
  model: {
    prop: 'modelValue',
    event: 'update:modelValue',
  },
  props: {
    visible: Boolean,
    multiple: Boolean,
    icon: String,
    filterable: Boolean,
    formatter: Function,
    autoClearQuery: Boolean,
    loading: Boolean,
    maxCount: {
      type: [Number, String],
      /* validator(v) {
        return isNumber(v) || v === "responsive"
      }, */
    },
    collapseTags: Boolean,
    tipMaxCount: {
      type: Number,
      default: 100,
    },
    closable: {
      type: [Boolean, Function],
      default: true,
    },
    clearable: Boolean,
    reserveKeyword: Boolean,
    placeholder: {
      type: String,
      default: '请选择',
    },
    size: String,
    genre: String,
    disabled: Boolean,
    status: {
      type: String as PropType<InputStatus>,
    },
    modelValue: [String, Number, Object, Array],
    options: Array,
    virtual: {
      type: Boolean,
      default: false,
    },
    virtualOption: {
      type: Object as PropType<VirtualOption>,
    },
    allowCreate: Boolean,
  },
  emits: [
    'update:visible',
    'update:modelValue',
    'clear',
    'input',
    'focus',
    'blur',
    'change',
  ],
  setup(props, ctx) {
    const { emit } = ctx
    const ins = vueInstance()
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('select'))
    const prefixPicker = computed(() => config.getPrefixCls('picker'))
    const formItemHook = useFormItem(props, ctx)

    // use form
    const m_status = formItemHook.status
    const m_loading = formItemHook.loading
    const m_hasFeedback = formItemHook.hasFeedback

    const innerVisible = ref(false)
    const minWidth = ref<string | number>(0)

    const pickerRef = ref<any | null>(null)
    const renderedRef = ref<any | null>(null)

    const m_icon = computed(() => {
      return hasProp(ins, 'icon') ? props.icon : 'down-thick'
    })
    const isVirtual = computed(() => {
      return Boolean(props.virtual && props.options)
    })
    const dropdownVisible = computed<boolean>(() => {
      return hasProp(ins, 'visible') ? props.visible : innerVisible.value
    })

    watch(dropdownVisible, visible => {
      if (visible) {
        computedInputWidth()
      } else {
        renderedRef.value && renderedRef.value.reset()
      }
    })
    onMounted(() => {
      renderedRef.value = pickerRef.value && pickerRef.value.$refs['renderedRef']
      nextTick(() => {
        computedInputWidth()
      })
    })

    // const noop = () => {}
    const focused = ref(false)
    const toggleDropdown = (v: any) => {
      if (v === undefined) {
        v = !dropdownVisible.value
      }
      if (dropdownVisible.value === v) {
        return
      }
      innerVisible.value = !!v
      focused.value = !!v
      emit('update:visible', v)
    }
    const openDropdown = () => { toggleDropdown(true) }
    const closeDropdown = () => { toggleDropdown(false) }

    //private
    const handleValueChange = (v: any) => {
      emit('input', v)
      emit('update:modelValue', v)
      formItemHook.m_handleChange(v)
      /* if (props.filterable) {
        renderedRef.value && renderedRef.value.focus()
      } */
      if (props.multiple && !props.reserveKeyword) {
        renderedRef.value && renderedRef.value.reset()
      }
      if (!props.multiple && dropdownVisible.value) {
        closeDropdown()
      }
    }
    const handleClear = () => {
      const value = props.multiple ? [] : ''
      emit('clear')
      emit('input', value)
      emit('update:modelValue', value)
      formItemHook.m_handleChange(value)
    }
    const handleFocus = (e: Event) => {
      if (!dropdownVisible.value) {
        emit('focus', e)
      }
    }
    const handleBlur = (e: Event) => {
      if (!dropdownVisible.value) {
        renderedRef.value && renderedRef.value.reset()
        formItemHook.m_handleBlur(e)
      }
    }
    const handleClickoutside = () => {
      closeDropdown()
    }
    const handleKeydown = (e: KeyboardEvent) => {
      if (!dropdownVisible.value) {
        if (!isKey('space', e) && !isKey('tab', e)
          && !isKey('esc', e)) {
          openDropdown()
        }
      } else if (isKeyEsc(e) || isKeyTab(e)) {
        closeDropdown()
        return
      }
      pickerRef.value && pickerRef.value.handleKeydown(e)
    }
    const handleQuery = (v: string) => {
      if (pickerRef.value) {
        pickerRef.value.filter(v)
        if (props.multiple) {
          pickerRef.value.updatePopper()
        }
      }
    }
    const computedInputWidth = () => {
      if (renderedRef.value && !minWidth.value) {
        const w = renderedRef.value.$el.getBoundingClientRect().width //$el 💣直接取得风险
        if (w) {
          minWidth.value = `${w}px`
        }
      }
    }
    const removeOption = (option: any) => {
      pickerRef.value && pickerRef.value.setOption(option, false)
    }
    const methodsCollection = {
      handleClickoutside, handleClear, handleValueChange,
      handleQuery, openDropdown, toggleDropdown, removeOption, handleKeydown, handleFocus, handleBlur,
    }

    const resetAttrs = useResetAttrs(ctx.attrs, true)

    return {
      prefix, m_icon, dropdownVisible, minWidth, pickerRef, renderedRef, isVirtual, prefixPicker,
      m_status, m_loading, m_hasFeedback, focused,
      m_disabled: formItemHook.disabled,
      ...methodsCollection, resetAttrs,
    }
  },

  render() {
    const { m_disabled, prefix, dropdownVisible, isVirtual, size, focused, resetAttrs } = this
    
    const renderInput = (scope: any) => {
      const props = toProps({
        ...scope,
        ...this.$props,
        value: scope.value,
        icon: this.m_icon,
        maxCount: this.maxCount,
        closable: this.closable,
        tipMaxCount: this.tipMaxCount,
        collapseTags: this.collapseTags,
        focused: focused,
        status: this.m_status,
        loading: this.m_loading,
        hasFeedback: this.m_hasFeedback,
        virtual: isVirtual,
        disabled: m_disabled,
      })
      const resetListeners = {
        query: this.handleQuery,
        clear: this.handleClear,
        open: this.openDropdown,
        toggle: this.toggleDropdown,
        remove: this.removeOption,
        keydown: this.handleKeydown,
        focus: this.handleFocus,
        blur: this.handleBlur,
      }
      const slots = getAllScopedSlots(this)
      return <mtd-select-input
        ref="renderedRef"
        {...props}
        {...vSlots(slots)}
        v-slots={slots}
        on={resetListeners}
      />
    }

    const pickerProps = toProps({
      ...this.$props,
      disabled: m_disabled,
      prefix: prefix,
      showFilterInput: false,
      visible: dropdownVisible,
      panelStyle: {
        minWidth: '180px',
      },
    })
    const pickerOn = {
      clickoutside: this.handleClickoutside,
      input: this.handleValueChange,
    }


    const pickerSlots = {
      rendered: renderInput,
      footer: getSlotsInRender(this, 'footer') ? () => getSlotsInRender(this, 'footer') : undefined,
      default: getSlotsInRender(this) ? () => getSlotsInRender(this) : undefined,
      option: getScopedSlotsInRender(this, 'option'),
      loading: getSlotsInRender(this, 'loading') ? () => getSlotsInRender(this, 'loading') : undefined,
      empty: getSlotsInRender(this, 'empty') ? () => getSlotsInRender(this, 'empty') : undefined,
      noMatched: getSlotsInRender(this, 'noMatched') ? () => getSlotsInRender(this, 'noMatched') : undefined,
    }
    return <mtd-picker
      class={{
        [`${prefix}-${size}`]: size,
      }}
      {...pickerProps}
      {...resetAttrs}
      on={pickerOn}
      {...vSlots(pickerSlots)}
      v-slots={pickerSlots}
      ref={'pickerRef'}
    />
  },
})
