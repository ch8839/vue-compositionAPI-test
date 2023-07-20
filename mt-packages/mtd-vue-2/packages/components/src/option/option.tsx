import {
  computed,
  defineComponent,
  inject,
  onMounted,
  onUnmounted,
  PropType,
  ref,
  hasProp,
  getSlotsInRender,
  vueInstance,
  getAllScopedSlots,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import MtdCheckbox from '@components/checkbox'
import { Emitter } from '@utils/mitt'

import { Option, OptionSelect, SELECT_ALL_VALUE } from './types'
import { isNumber } from '@utils/type'

import {
  getRealValue,
} from '@components/picker/util'

// 改组件强依赖于在picker和select组件内部使用


export default defineComponent({
  name: 'MtdOption',
  components: {
    MtdCheckbox,
  },
  props: {
    value: {
      type: [String, Number, Object, Boolean],
      default: '',
    },
    label: {
      type: [String, Number],
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    option: Object as PropType<Option>,
    selected: Boolean,
    indeterminate: Boolean, // 是否半选状态，仅用于 全选时
    virtual: {
      type: Boolean,
      default: false,
    },
  },
  emits: [],
  setup(props, { attrs }) {
    const ins = vueInstance()
    const select = inject('select', null) as OptionSelect | null// 🤡选择器picker的引用

    const index = ref(isNumber(attrs.index) ? attrs.index : -1)
    const visible = ref(true)
    function setVisible(v: boolean) {
      visible.value = v
    }
    const hover = ref(false)

    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('option'))
    const iconPrefix = computed(() => config.getIconCls)
    const selectPrefix = computed(() => config.getPrefixCls('select'))
    const dmi_p = computed(() => config.getPrefixCls('dropdown-menu-item'))
    const m_selected = computed(() => {
      return props.selected || (select && select.judgeSelectd(props.value))
    })
    const m_option = computed(() => props.option || formatOption()) // option得是 Option

    const multiple = computed(() => select && select.multiple)
    const showCheckbox = computed(() => select && select.multiple && select.showCheckbox)

    const m_hover = computed(() => {
      if (!select) {
        return false
      }
      return hover.value
        || select.hoverOptionIns === (ins )
        || (select.hoverIndex >= 0 && select.hoverIndex === index.value)
    })

    const formatOption = (): Option => {
      const label = hasProp(ins, 'label') ? props.label : String(props.value)

      return {
        label,
        value: props.value,
        disabled: props.disabled,
        index: index.value,
        realValue: select ? getRealValue(props.value, select.valueKey) : undefined,
      }
    }

    const hoverItem = () => {
      if (select && select.emitter) {
        (select.emitter ).emit('hover', ins)
        hover.value = true
      }
    }

    const leaveItem = () => {
      hover.value = false
    }

    const selectOption = () => {
      if (props.disabled || !select) {
        return
      }
      (select.emitter ).emit('optionClick', ins)
    }

    function handleCheckboxChange() {
      selectOption()
    }

    //created
    const propOption = props.option
    if (propOption) {
      propOption.index = index.value
    }
    onMounted(() => {
      if (select && !select.virtual && props.value === SELECT_ALL_VALUE) {
        select.addSelectAllOptionIns(ins )
      }
    })

    const pickerSlots = computed(() => getAllScopedSlots(select))

    return {
      prefix, iconPrefix, selectPrefix, dmi_p, m_selected, hover,
      m_hover, multiple, showCheckbox, m_option, index,pickerSlots,
      hoverItem, leaveItem, selectOption, visible, handleCheckboxChange, setVisible,
    }
  },
  render() {
    const { prefix, dmi_p, selectPrefix, iconPrefix, m_selected, visible,pickerSlots,option,
      disabled, m_hover, showCheckbox, indeterminate, multiple, label } = this

    const $render = pickerSlots.option

    const labelRender = getSlotsInRender(this) 
      || (!!($render && option) && $render(option))
      || label

    return <div
      v-show={visible}
      onMouseenter={this.hoverItem}
      onMouseleave={this.leaveItem}
      onClick={(e: Event) => { e.stopPropagation(); this.selectOption() }}
      class={{
        [dmi_p]: true,
        [`${dmi_p}-selected`]: m_selected,
        [`${dmi_p}-disabled`]: disabled,
        'hover': m_hover,
      }}
      style={{
        display: visible ? 'flex' : 'none',
      }}
    >
      {showCheckbox
        ? <mtd-checkbox
          onClick={(e: Event) => e.stopPropagation()}
          onChange={this.handleCheckboxChange}
          formNoValidate={true}
          indeterminate={indeterminate}
          value={!!m_selected}
          disabled={disabled}>
          {labelRender}
        </mtd-checkbox>
        : < span class={`${prefix}-label-wrapper`} >
          {labelRender}
          {(multiple && m_selected) &&
            <span class={`${selectPrefix}-selected-check ${iconPrefix('check-thick')}`} />
          }
        </span >
      }
    </div >
  },
})
