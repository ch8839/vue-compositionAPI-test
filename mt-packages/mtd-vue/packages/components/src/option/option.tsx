import {
  computed,
  defineComponent,
  inject,
  onMounted,
  onUnmounted,
  PropType,
  ref,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import MtdCheckbox from '@components/checkbox'
import { Emitter } from '@utils/mitt'
import vueInstance from '@components/hooks/instance'
import { Option, OptionCPI, OptionSelect, SELECT_ALL_VALUE } from './types'
import { isNumber } from '@utils/type'

import {
  getRealValue, hasProps,
} from '@components/picker/util'


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
    const ins = vueInstance() as OptionCPI
    const select = inject('select') as OptionSelect // 选择器picker的引用
    const index = ref(isNumber(attrs.index) ? attrs.index : -1)
    const visible = ref(true)
    const hover = ref(false)

    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('option'))
    const iconPrefix = computed(() => config.getIconCls)
    const selectPrefix = computed(() => config.getPrefixCls('select'))
    const dmi_p = computed(() => config.getPrefixCls('dropdown-menu-item'))
    const _selected = computed(() => {
      return props.selected || select.judgeSelectd(props.value)
    })
    const _option = computed(() => props.option || formatOption()) // option得是 Option

    const multiple = computed(() => select.multiple)
    const showCheckbox = computed(() => select.multiple && select.showCheckbox)

    const _hover = computed(() => {
      return hover.value
        || select.hoverOptionIns === ins
        || (select.hoverIndex >= 0 && select.hoverIndex === index.value)
    })

    const formatOption = (): Option => {
      const label = hasProps(ins, 'label') ? props.label : String(props.value)

      return {
        label,
        value: props.value,
        disabled: props.disabled,
        index: index.value,
        realValue: getRealValue(props.value, select.valueKey),
      }
    }

    const hoverItem = () => {
      if (select.emitter) {
        (select.emitter as Emitter).emit('hover', ins)
        hover.value = true
      }
    }

    const leaveItem = () => {
      hover.value = false
    }

    const selectOption = () => {
      if (props.disabled) {
        return
      }
      (select.emitter as Emitter).emit('optionClick', ins)
    }

    //created
    const propOption = props.option
    if (propOption) {
      propOption.index = index.value
    }
    onMounted(() => {
      if (!select.virtual && props.value === SELECT_ALL_VALUE) {
        select.addSelectAllOptionIns(ins)
      }
    })

    onUnmounted(() => {
      /* if (!select.virtual) {
        select.removeOption(ins)
      } */
    })


    return {
      prefix, iconPrefix, selectPrefix, dmi_p, _selected, hover,
      _hover, multiple, showCheckbox, _option, index,
      hoverItem, leaveItem, selectOption, visible,
    }
  },
  render() {
    const { prefix, dmi_p, selectPrefix, iconPrefix, _selected, visible,
      disabled, _hover, showCheckbox, indeterminate, multiple, label } = this
    return <div
      v-show={visible}
      onMouseenter={this.hoverItem}
      onMouseleave={this.leaveItem}
      onClick={(e: Event) => { e.stopPropagation(); this.selectOption() }}
      class={{
        [dmi_p]: true,
        [`${dmi_p}-selected`]: _selected,
        [`${dmi_p}-disabled`]: disabled,
        'hover': _hover,
      }}
      style={{
        display: visible ? 'flex' : 'none',
      }}
    >
      {showCheckbox
        ? <mtd-checkbox
          nativeOnClick={(e: Event) => e.stopPropagation()}
          onChange={this.selectOption}
          formNoValidate={true}
          indeterminate={indeterminate}
          value={!!_selected}
          disabled={disabled}>
          {this.$slots.default || label}
        </mtd-checkbox>
        :
        < span class={`${prefix}-label-wrapper`} >
          {this.$slots.default || label}
          {(multiple && _selected) &&
            <span class={`${selectPrefix}-selected-check ${iconPrefix('check-thick')}`} />}
        </span >
      }
    </div >
  },
})
