import {
  computed,
  defineComponent,
  onMounted,
  PropType,
  ref,
  watch,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'

import {
  isKeyEsc,
  isKeyTab, isKey,
} from "@components/picker/util"
import MtdPicker from '@components/picker'
import MtdInput from '@components/input'
import { focus as domFocus } from '@utils/dom'
import MtdOption from '@components/option'
import { useAttrs, useListeners } from '@components/hooks/pass-through'
/* import NavigationMixin from '@components/select/navigation-mixin'
import { AutocompleteData, IOption } from 'types/autocomplete'
import { INavigationMixin, SelectProvider } from 'types/select' */

export default defineComponent({
  name: 'MtdAutocomplete',
  components: {
    MtdPicker,
    MtdInput,
    MtdOption,
  },
  inheritAttrs: true,
  model: {
    prop: 'modelValue',
    event: 'update:modelValue',
  },
  props: {
    modelValue: [String, Number],
    prefixIcon: String,
    suffixIcon: String,
    size: String,
    data: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    loading: Boolean,
    clearable: Boolean,
    disabled: Boolean,
    readonly: Boolean,
    loadingText: {
      type: String,
      default: () => {
        return '搜索中'
      },
    },
    popperClass: String,
    filterMethod: {
      type: [Function, Boolean],
      default: null,
    },
    appendToContainer: {
      type: Boolean,
      default: true,
    },
    getPopupContainer: Function,
    popperOptions: Object,
  },
  emits: ['search', 'blur', 'focus', 'input', 'change', 'select'],
  setup(props, { emit, attrs }) {
    const config = useConfig()

    const prefix = computed(() => config.getPrefixCls('autocomplete'))
    const myAttrs = useAttrs(attrs)

    const dataOptions = computed(() => {
      return props.data.map((val: string) => {
        return {
          value: val,
          label: val,
        }
      })
    })

    const dropdownVisible = ref(false)
    const minWidth = ref<string | number>(0)

    const renderedRef = ref<any | typeof MtdInput>(null)
    const pickerRef = ref<any | null>(null)

    watch(dropdownVisible, visible => {
      if (visible) {
        computedInputWidth()
      } else {
        // renderedRef.value && renderedRef.value.reset()
      }
    })
    onMounted(() => {
      renderedRef.value = pickerRef.value && pickerRef.value.$refs['renderedRef']
      computedInputWidth()
    })

    // const noop = () => {}
    const toggleDropdown = (v: any) => {
      if (v === undefined) {
        v = !dropdownVisible.value
      }
      if (dropdownVisible.value === v) {
        return
      }
      dropdownVisible.value = v
      emit("update:visible", v)
    }
    const openDropdown = () => { toggleDropdown(true) }
    const closeDropdown = () => { toggleDropdown(false) }

    //private
    const handleValueChange = (v: any) => {
      emit("update:modelValue", v)
      emit("input", v)
      emit("change", v)
      emit("select", v)
      if (dropdownVisible.value) {
        closeDropdown()
      }
    }
    const handleClear = () => {
      const value = ""
      emit("clear")
      emit("input", value)
      emit("update:modelValue", value)
      emit("change", value)
    }
    const handleFocus = (e: Event) => {
      if (!dropdownVisible.value) {
        emit("focus", e)
        openDropdown()
      }
    }
    const handleBlur = (e: Event) => {
      if (!dropdownVisible.value) {
        // renderedRef.value && renderedRef.value.reset()
        emit("blur", e)
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
    const handleInput = (v: string) => {
      emit('update:modelValue', v)
      emit("input", v)
      emit('change', v)
      emit('search', v)

      if (typeof props.filterMethod === 'function') {
        pickerRef.value.filter(v)
      }
    }
    const handleQuery = (v: string) => {
      emit('update:modelValue', v)
      emit("input", v)
      emit('change', v)
      emit('search', v)
    }
    const computedInputWidth = () => {
      if (renderedRef.value && !minWidth.value) {
        const w = renderedRef.value.$el.getBoundingClientRect().width //$el 💣直接取得风险
        if (w) {
          minWidth.value = `${w}px`
        }
      }
    }
    const handlePrefixClick = (e: Event) => {
      domFocus(renderedRef)
      emit('click-prefix', e)
    }
    const handleSuffixClick = (e: Event) => {
      domFocus(renderedRef)
      emit('click-suffix', e)
    }

    const myListeners = useListeners({
      ['update:modelValue']: handleInput,
      clear: handleClear,
      open: openDropdown,
      toggle: toggleDropdown,
      keydown: handleKeydown,
      focus: handleFocus,
      blur: handleBlur,
      'click-prefix': handlePrefixClick,
      'click-suffix': handleSuffixClick,
    }).value

    return {
      prefix, dropdownVisible, minWidth, pickerRef, renderedRef, dataOptions, myAttrs, myListeners,
      handleClickoutside,
      handleClear, handleValueChange, handlePrefixClick, handleSuffixClick, handleInput,
      handleQuery, openDropdown, toggleDropdown, handleKeydown, handleFocus, handleBlur,
    }
  },
  methods: {
    renderInput() {
      return <mtd-input
        {...{
          props: this.$props,
          ref: "renderedRef",
          scopedSlots: { ...this.$scopedSlots },
        }}
        {...this.myListeners}
        {...this.myAttrs}
      />
    },
  },
  render() {
    const {
      prefix, dataOptions, dropdownVisible, minWidth,
    } = this

    const props = {
      ...this.$attrs,
      ...this.$props,
      options: dataOptions,
      prefix: prefix,
      showFilterInput: false,
      visible: dropdownVisible && (!!this.$slots.default || dataOptions.length > 0),
      filterable: typeof this.$props.filterMethod === 'function',
      panelStyle: {
        minWidth: minWidth,
      },
    }

    return <mtd-picker {...{
      props: props,
      attrs: props,
      ref: "pickerRef",
      on: {
        clickoutside: this.handleClickoutside,
        ['update:modelValue']: this.handleValueChange,
      },
      scopedSlots: {
        ...this.$scopedSlots,
        rendered: this.renderInput,
      },
    }} >
      {this.$slots.default}
    </mtd-picker>
  },
})
