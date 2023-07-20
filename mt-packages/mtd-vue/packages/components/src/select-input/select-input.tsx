import { useConfig } from '@components/config-provider'
import { getListeners, useAttrs, useListeners } from '@components/hooks/pass-through'
import { defineComponent, computed, ref, watch, classNames, styles } from '@ss/mtd-adapter'
import MtdMultiple from '../multiple/multiple'
import MtdSingle from './single'

export default defineComponent({
  name: 'MtdSelectInput',
  components: {
    MtdMultiple,
    MtdSingle,
  },
  inheritAttrs: false,
  props: {
    multiple: Boolean,
    maxCount: [Number, String],
    tipMaxCount: Number,
    collapseTags: Boolean,
    closable: [Boolean, Function],

    filterable: Boolean,
    icon: String,
    placeholder: String,
    prefix: {
      type: String,
    },
    value: [String, Number, Object, Array, Boolean], // selectOption || selectOption[]
    clearable: Boolean,
    focused: Boolean,
    isSelectAll: Boolean,
    hasSelected: Boolean,
    formatter: Function,
    size: String,
    genre: String,
    disabled: Boolean,
    invalid: Boolean,
  },
  setup(props, { emit, attrs }) {
    const multipleRef = ref<typeof MtdMultiple | null>(null)
    const singleRef = ref<typeof MtdSingle | null>(null)

    const config = useConfig()
    const prefixMTD = computed(() => config.getPrefix())

    const input = computed(() => props.multiple ? multipleRef.value : singleRef.value) as any
    watch(() => props.focused, (val) => {
      if (val) {
        input.value && input.value.focus()
      }
    })

    // public
    const reset = () => {
      input.value && input.value.reset()
      emit('query', '')
    }
    const focus = () => {
      input.value && input.value.focus()
    }
    const blur = () => {
      input.value && input.value.blur()
    }

    // private

    const listeners = getListeners()
    const handleClick = () => {
      if (listeners.value.click) {
        emit('click')
      }
      if (props.disabled) {
        return
      }
      if (props.filterable) {
        emit('open')
      } else {
        emit('toggle')
      }
    }

    const restAttrs = useAttrs(attrs)

    const restSingleListeners = useListeners({
      'click-suffix': handleClick,
      click: handleClick,
    })

    const restMultipleListeners = useListeners({
      'click-suffix': handleClick,
      click: handleClick,
    })

    return {
      reset, focus, blur, handleClick,
      input, multipleRef, singleRef,
      restSingleListeners,
      restMultipleListeners,
      restAttrs, prefixMTD,
    }
  },

  render() {
    const {
      multiple, placeholder,
      clearable, value, icon,
      filterable, formatter,
      maxCount, tipMaxCount,
      collapseTags, closable,
      disabled, invalid,
      size, genre, focused,
      restSingleListeners,
      restMultipleListeners,
      restAttrs, prefixMTD,
    } = this

    return <div
      class={classNames(this, {
        [`${prefixMTD}-select-search-focus`]: focused,
      })}
      style={styles(this, { width: '100%' })}
    >
      {multiple ? <mtd-multiple ref={'multipleRef'} placeholder={placeholder}
        formatter={formatter} suffixIcon={icon}
        focused={focused}
        clearable={clearable} readonly={!filterable}
        value={value} fieldNames={{ value: 'value', label: 'label' }}
        maxCount={maxCount} closable={closable}
        tipMaxCount={tipMaxCount} collapseTags={collapseTags}
        size={size} disabled={disabled}
        invalid={invalid}
        {...restMultipleListeners}
        renderTag={this.$scopedSlots.tag}
        filterable={filterable}
        {...restAttrs}
      /> : <mtd-single ref='singleRef' placeholder={placeholder}
        value={value} formatter={formatter}
        focused={focused}
        icon={icon} size={size} genre={genre}
        clearable={clearable} invalid={invalid}
        readonly={!filterable} disabled={disabled}
        filterable={filterable}
        {...restSingleListeners}
        {...restAttrs}
      />}
    </div>
  },
})
