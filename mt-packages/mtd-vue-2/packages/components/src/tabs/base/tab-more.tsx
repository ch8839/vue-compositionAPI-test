import {
  defineComponent, computed, PropType, ref, watch, classNames, styles,
} from '@ss/mtd-adapter'
import MtdSelect from '@components/select'
import MtdPicker from '@components/picker'
import MtdOption from '@components/option'
import useConfig from '@hooks/config'
import { ITabPane } from '../types'

export default defineComponent({
  name: 'MtdTabMore',
  components: {
    MtdSelect,
    MtdPicker,
    MtdOption,
  },
  inheritAttrs: false,
  props: {
    label: String,
    size: String,
    disabled: Boolean,
    moreTabs: {
      type: Array as PropType<any[]>,
      required: true,
    },
    currentValue: [String, Number, Object, Array],
  },
  emits: ['tabSelectClick'],
  setup(props, { emit }) {
    const config = useConfig()
    const prefixSelect = computed(() => config.getPrefixCls('tabs-select'))

    const selectValue = ref(props.label)
    const inputSize = computed(() => props.size === 'large' ? '' : props.size)

    watch(() => props.currentValue, () => {
      setSelectValue()
    }, { immediate: true })
    watch(() => props.moreTabs, () => {
      setSelectValue()
    })

    function setSelectValue() {
      const selected: ITabPane | undefined = props.moreTabs.find((item) => {
        return item.value === props.currentValue
      })

      if (!selected) {
        selectValue.value = props.label
      } else {
        selectValue.value = (selected as any).value
      }
    }

    function updateSelect(value: any) {
      if (value) {
        setSelectValue()
        emit('tabSelectClick', value)
      }
    }

    return {
      prefixSelect,
      selectValue,
      inputSize,
      updateSelect,
    }
  },
  render() {
    const { prefixSelect, selectValue, inputSize } = this
    const { disabled, moreTabs } = this.$props
    return <mtd-picker
      modelValue={selectValue}
      onChange={this.updateSelect}
      popperClass={prefixSelect}
      placeholder=""
      disabled={disabled}
      size={inputSize}
      type="text"
      genre="line"
      class={classNames(this, `${prefixSelect}-item`)}
      style={styles(this)}
      clearable={false}
    >
      {moreTabs.map(item => <mtd-option
        key={item.value}
        value={item.value}
        label={item.label}
      />)}
    </mtd-picker>
  },
})
