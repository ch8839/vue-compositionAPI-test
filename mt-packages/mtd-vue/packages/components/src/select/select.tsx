import {
  defineComponent,
  PropType,
  computed,
  ref,
  watch,
  onMounted,
  nextTick,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import {
  hasProps, isKeyEsc,
  isKeyTab, isKey,
} from "@components/picker/util"
import vueInstance from '@components/hooks/instance'
import MtdSelectInput from '@components/select-input'
import MtdPicker from '@components/picker'
import MtdPickerVirtual from '@components/picker-virtual'
import { useClassStyle, useListeners } from '@hooks/pass-through'
import { useFormItem } from '@components/form-item/useFormItem'
import { InputStatus } from '@components/input/types'
/* import { isExist } from '@utils/type' */


export default defineComponent({
  name: 'MtdSelect',
  components: {
    MtdSelectInput,
    MtdPicker,
    MtdPickerVirtual,
  },
  inheritAttrs: false,
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
      default: "请选择",
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
    allowCreate: Boolean,
  },
  emits: [],
  setup(props, ctx) {
    const { emit } = ctx
    const ins = vueInstance()
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('select'))
    const prefixPicker = computed(() => config.getPrefixCls('picker'))
    const classStyle = useClassStyle()
    const formItemHook = useFormItem(props, ctx)

    // use form
    const _status = formItemHook.status
    const _loading = formItemHook.loading
    const _hasFeedback = formItemHook.hasFeedback

    const innerVisible = ref(false)
    const minWidth = ref<string | number>(0)

    const pickerRef = ref<any | null>(null)
    const renderedRef = ref<any | null>(null)

    const _icon = computed(() => {
      return hasProps(ins, "icon") ? props.icon : "down-thick"
    })
    const isVirtual = computed(() => {
      return Boolean(props.virtual && props.options)
    })
    const dropdownVisible = computed<boolean>(() => {
      return hasProps(ins, "visible") ? props.visible : innerVisible.value
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
      emit("update:visible", v)
    }
    const openDropdown = () => { toggleDropdown(true) }
    const closeDropdown = () => { toggleDropdown(false) }

    //private
    const handleValueChange = (v: any) => {
      emit("input", v)
      emit('update:modelValue', v)
      formItemHook._handleChange(v)
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
      const value = props.multiple ? [] : ""
      emit("clear")
      emit("input", value)
      emit('update:modelValue', value)
      formItemHook._handleChange(value)
    }
    const handleFocus = (e: Event) => {
      if (!dropdownVisible.value) {
        emit("focus", e)
      }
    }
    const handleBlur = (e: Event) => {
      if (!dropdownVisible.value) {
        renderedRef.value && renderedRef.value.reset()
        formItemHook._handleBlur(e)
      }
    }
    const handleClickoutside = () => {
      closeDropdown()
    }
    const handleKeydown = (e: KeyboardEvent) => {

      if (!dropdownVisible.value) {
        if (!isKey("space", e) && !isKey("tab", e)
          && !isKey("esc", e)) {
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

    return {
      prefix, _icon, dropdownVisible, minWidth, pickerRef, renderedRef, isVirtual, prefixPicker, classStyle,
      _status, _loading, _hasFeedback, focused,
      ...methodsCollection,
    }
  },

  render() {
    const { prefix, dropdownVisible, isVirtual, size, classStyle, focused } = this
    const props = {
      ...this.$attrs,
      ...this.$props,
      prefix: prefix,
      showFilterInput: false,
      visible: dropdownVisible,
      panelStyle: {
        minWidth: '180px',
      },
    }

    const renderInput = (scope: any) => {
      const myProps = {
        ...scope,
        ...this.$props,
        value: scope.value,
        icon: this._icon,
        maxCount: this.maxCount,
        closable: this.closable,
        tipMaxCount: this.tipMaxCount,
        collapseTags: this.collapseTags,
        focused: focused,
        status: this._status,
        loading: this._loading,
        hasFeedback: this._hasFeedback,
      }
      const myListeners = useListeners({
        query: this.handleQuery,
        clear: this.handleClear,
        open: this.openDropdown,
        toggle: this.toggleDropdown,
        remove: this.removeOption,
        keydown: this.handleKeydown,
        focus: this.handleFocus,
        blur: this.handleBlur,
      }).value
      return <mtd-select-input
        {...{
          props: myProps,
          attrs: myProps,
          ref: 'renderedRef',
          scopedSlots: { ...this.$scopedSlots },
        }}
        {...myListeners}
      />
    }

    const Component = isVirtual ? 'mtd-picker-virtual' : 'mtd-picker'

    return <Component {...{
      props: props,
      attrs: props,
      ref: "pickerRef",
      class: [{
        [`${prefix}-${size}`]: size,
      }, classStyle.class],
      style: classStyle.style,
      on: {
        clickoutside: this.handleClickoutside,
        input: this.handleValueChange,
      },
      scopedSlots: {
        ...this.$scopedSlots,
        rendered: renderInput,
      },
    }}>
      {this.$slots.default}
      {this.$slots.footer &&
        <template slot="footer">
          {this.$slots.footer}
        </template>
      }
    </Component >
  },
})
