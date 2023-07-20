import {
  computed,
  defineComponent,
  PropType,
  ref,
  watch,
  useResetAttrs,
  useListeners,
} from '@ss/mtd-adapter'
import MtdInput from '@components/input'
import MtdMultiple from '@components/multiple'
import { Option } from '@components/option/types'

export default defineComponent({
  name: 'DatePickerInput',
  components: {
    MtdInput,
    MtdMultiple,
  },
  props: {
    value: String,
    multiple: Boolean,
    closable: Boolean,
    options: {
      type: Array as PropType<Option[]>,
    },
    showTag: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['focus', 'input', 'change', 'blur', 'enter', 'remove'],
  setup(props, ctx) {
    const inputValue = ref(props.value)
    const m_options = computed((): Option[] => {
      if (props.options) {
        return props.options
      }
      return inputValue.value && props.multiple && props.showTag
        ? inputValue.value.split(',').map(time => {
          return {
            value: time,
            label: time,
          }
        })
        : []
    })
    const focused = ref(false)

    const resttAttrs = useResetAttrs(ctx.attrs, true)
    const restListeners = useListeners({
      input: handleInput,
      enter: handleEnter,
      blur: handleBlur,
      focus: handleFocus,
      remove: handleRemove,
    }, ['focus', 'input', 'change', 'blur'])

    watch(() => props.value, (v) => {
      inputValue.value = v
    })
    watch(focused, (v) => {
      if (!v) {
        inputValue.value = props.value
      }
    })

    function handleFocus(e: Event) {
      focused.value = true
      ctx.emit('focus', e)
    }
    function handleBlur(e: Event) {
      submit()
      focused.value = false
      ctx.emit('blur', e)
    }
    function handleEnter(e: Event) {
      submit()
      ctx.emit('enter', e)
    }
    function submit() {
      if (inputValue.value !== props.value) {
        ctx.emit('input', inputValue.value)
        ctx.emit('change', inputValue.value)
      }
    }
    function handleInput(v: string) {
      inputValue.value = v
    }
    function handleRemove(opt: Option) {
      ctx.emit('remove', opt)
    }
    return {
      inputValue, focused, resttAttrs, restListeners, m_options,
    }
  },
  methods: {
    focus() {
      return (this.$refs.inputRef as any).focus()
    },
    blur() {
      return (this.$refs.inputRef as any).blur()
    },
  },
  render() {
    const { resttAttrs, restListeners, inputValue, multiple, showTag, m_options, closable } = this

    return (multiple && showTag) ?
      <mtd-multiple
        ref="inputRef"
        {...resttAttrs}
        {...restListeners}
        closable={closable}
        value={m_options}
        fieldNames={{ value: 'value', label: 'label' }}
      /> :
      <mtd-input
        ref="inputRef"
        {...resttAttrs}
        {...restListeners}
        modelValue={inputValue}
      />
  },
})
