import {
  defineComponent,
  PropType,
  computed,
  ref,
  watch, classNames, styles,
  toProps,
  useListeners,
} from '@ss/mtd-adapter'
import MtdInput from '@components/input'
import { InputStatus } from '@components/input/types'

export default defineComponent({
  name: 'MtdSingleRendered',
  components: {
    MtdInput,
  },
  inheritAttrs: false,
  props: {
    icon: String,
    placeholder: String,
    clearable: Boolean,
    value: Object, // type: Option
    readonly: Boolean,
    autoClearQuery: Boolean, // 兼容 mtd-vue
    size: String,
    genre: String,
    disabled: Boolean,
    formatter: Function,
    status: {
      type: String as PropType<InputStatus>,
    },
    hasFeedback: Boolean,
    focused: Boolean,
    filterable: Boolean,
    loading: Boolean,
  },
  emits: ['clear', 'query', 'change', 'blur', 'focus'],
  setup(props, { emit }) {
    const inputValue = ref('')
    const currentPlaceholder = ref(props.placeholder)
    const inputRef = ref<typeof MtdInput | null>(null)

    const valueStr = computed(() => {
      return props.value ? (props.formatter ? props.formatter(props.value) : props.value.label) : ''
    })

    watch(() => props.value, () => {
      reset()
    })

    //created
    inputValue.value = valueStr.value || ''

    function reset() {
      inputValue.value = valueStr.value || ''
      currentPlaceholder.value = valueStr.value || props.placeholder
    }

    function focus() {
      inputRef.value && inputRef.value.focus()
    }
    function blur() {
      inputRef.value && inputRef.value.blur()
    }

    // private
    function clear() {
      emit('clear')
    }
    function handleBlur(e: Event) {
      emit('blur', e)
    }
    function handleFocus(e: Event) {
      currentPlaceholder.value = valueStr.value || props.placeholder
      if (props.autoClearQuery && props.filterable) {
        inputValue.value = ''
      }
      emit('focus', e)
    }
    function handleInput(v: string) {
      inputValue.value = v
    }
    function handleChange(v: string) {
      emit('query', v)
      emit('change', v)
    }

    const listeners = useListeners({
      input: handleInput,
      clear: clear,
      blur: handleBlur,
      focus: handleFocus,
    })

    return {
      inputValue, currentPlaceholder, valueStr, inputRef,
      focus, blur, reset, listeners,
      clear, handleBlur, handleFocus, handleInput, handleChange,
    }
  },

  render() {
    const {
      currentPlaceholder, clearable,
      inputValue, icon,
      readonly, size,
      genre, disabled, listeners,
      status, hasFeedback, loading,
    } = this
    const props = toProps({
      placeholder: currentPlaceholder,
      modelValue: inputValue,
      suffixIcon: icon,
      clearable, readonly,
      formNoValidate: true,
      size, genre, disabled,
      noReadonlyClass: true,
      clearableOnReadonly: true,
      status, hasFeedback,
      loading,
    })

    return <mtd-input
      {...props}
      {...listeners}
      onChange={this.handleChange}
      class={classNames(this)}
      style={styles(this)}
      ref="inputRef"
    />
  },
})
