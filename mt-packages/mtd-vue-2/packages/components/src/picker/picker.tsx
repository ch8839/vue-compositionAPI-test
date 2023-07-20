import {
  defineComponent,
  PropType,
  computed,
  provide,
  reactive,
  toRefs,
  watch,
  nextTick,
  markRaw,
  ref,
  onMounted,
  onUpdated,
  hasProp,
  vueInstance,
  useClassStyle,
  VNode,
  getChildInsList,
  getSlotsInRender,
  getScopedSlotsInRender,
  vSlots,
  getAllScopedSlots,
  toProps,
  useResetAttrs,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import {
  isArray, isExist,
  getRealValue,
  isKeyDown, isKeyUp, isKeyEnter,
  isKeyEsc,
  isKeyDelete,
} from './util'

import MtdDropdown from '@components/dropdown'
import MtdOption from '@components/option'
import MtdInput from '@components/input'
import MtdVirtual from '@components/virtual'
import MtdTooltip from '@components/tooltip'
import MtdSelectInput from '@components/select-input'
import Selection from './selection'

import mitt from '@utils/mitt'
import { debounce } from '@utils/debounce'

import { Option, IOption, SELECT_ALL_VALUE } from '@components/option/types'
import { isNumber } from '@utils/type'
import { useFormItem } from '@components/form-item/useFormItem'

import { InputStatus } from '@components/input/types'
import MtdIcon from '@components/icon'
import getElement from '@components/hooks/getElement'

import { VirtualOption } from '@components/virtual/types'

const defaultVirtualOption:VirtualOption  = {
  rowHeight: 36,
}

// 🤡这里的any有点多了

function createDefaultOption(value: any) {
  return { value, label: isExist(value) ? value.toString() : '', m__DEFAULT_OPTION__: true }
}

function getOption(value: any, cachedMap: Map<any, any>, optionsMap: Map<any, any>, valueKey: string | undefined) {
  const realValue = getRealValue(value, valueKey)
  return cachedMap.get(realValue)
    || optionsMap.get(realValue)
    || createDefaultOption(value)
}

function getOptions(values: any[], cachedMap: Map<any, any>, optionsMap: Map<any, any>, valueKey: string | undefined) {
  const unmatchValues: any[] = []
  const matchValues: any[] = []
  const result = new Array(values.length)

  for (let i = 0; i < values.length; i++) {
    const value = values[i]
    const realValue = getRealValue(value, valueKey)
    let option = cachedMap.get(realValue) || optionsMap.get(realValue)
    if (!option) {
      option = createDefaultOption(value)
      unmatchValues.push({ index: i, realValue, value, option })
    } else {
      matchValues.push({ index: i, realValue, value, option })
    }
    result[i] = option
  }

  return { options: result, unmatchValues, matchValues }
}

function formatShowValue(value: any): string {
  return Array.isArray(value)
    ? value.join('，')
    : (value ? String(value) : '')
}

export default defineComponent({
  name: 'MtdPicker',
  components: {
    MtdDropdown,
    MtdOption,
    MtdInput,
    MtdIcon,
    MtdVirtual,
    MtdTooltip,
    MtdSelectInput,
    Selection,
  },
  inheritAttrs: false,
  model: {
    prop: 'modelValue',
    event: 'update:modelValue',
  },
  props: {
    icon: [String, Array, Object],
    options: { // type: { label: string, value: any, disabled?: boolean }
      type: Array,
    },
    fieldNames: {
      type: Object,
      default: () => {
        return {
          label: 'label',
          value: 'value',
          disabled: 'disabled',
        }
      },
    },
    modelValue: [Number, String, Array, Object],
    valueKey: String,
    visible: Boolean,
    disabled: Boolean,
    placeholder: String,
    clearable: {
      type: Boolean,
      default: true,
    },
    size: {
      type: String,
    },
    maxCount: {
      type: [Number, String],
      default: 0,
    },
    loading: Boolean,
    loadingText: {
      type: String,
      default: () => {
        return '搜索中'
      },
    },
    noDataText: {
      type: String,
      default: () => {
        return '暂无数据'
      },
    },
    filterable: Boolean,
    showFilterInput: {
      type: Boolean,
      default: true,
    },
    filterMethod: {
      type: Function,
      default: (query: any, value: any) => {
        const parsedQuery = String(query)
          .replace(/(\^|\(|\)|\[|\]|\$|\*|\+|\.|\?|\\|\{|\}|\|)/g, '\\$1')
        return new RegExp(parsedQuery, 'i').test(value)
      },
    },
    debounce: {
      type: Number,
      default: 0,
    },
    remote: Boolean,
    remoteMethod: Function,
    noMatchText: {
      type: String,
      default: () => {
        return '暂无搜索结果'
      },
    },
    popperClass: [String, Array, Object],
    popperOptions: Object,
    formatter: Function,
    multiple: Boolean,
    appendToContainer: {
      type: Boolean,
      default: true,
    },
    getPopupContainer: Function,
    showCheckbox: {
      type: Boolean,
      default: true,
    },
    showSelectAll: Boolean,
    panelStyle: Object,
    prefix: {
      type: String,
    },
    separator: {
      type: String,
      default: '、',
    },
    onlyKeyValue: Boolean,
    virtual: {
      type: Boolean,
      default: false,
    },
    virtualOption: {
      type: Object as PropType<VirtualOption>,
    },
    status: {
      type: String as PropType<InputStatus>,
    },
    allowCreate: Boolean,
    tooltip: Boolean,
    type: {
      type: String,
      default: 'button',
    },
  },

  emits: ['update:modelValue', 'input', 'focus', 'blur', 'update:visible', 'clickoutside', 'clear', 'change'],
  setup(props, { emit, slots, attrs }) {
    const config = useConfig()
    const ins = vueInstance()
    provide('select', ins)

    const allowUpdateOptComps = ref(false)

    const formItemHook = useFormItem(props, { emit, slots, attrs })

    const state = reactive({
      innerVisible: false,
      valueSet: new Set(),
      cachedSelected: new Map(),
      optionsMap: new Map(),
      m_options: [] as Option[], // 最终输出的被封装的Option数据
      renderOptions: [] as Option[], // 最终实际渲染的被封装的Option数据，是_options 的子集
      optionComponents: [] as IOption[], // option的组件实例
      selected: undefined as (undefined | Option | Option[]), // option[]
      unmatchedSelected: [] as Option[], // type: { index: number, value: any }[];
      isSelectAll: false,
      query: '',
      previousQuery: 'mtd_never_query_A4d&&8060',
      hoverIndex: -1,
      hoverOptionIns: undefined as IOption | undefined,
      optionIndex: 0,
      hasInit: !(props.modelValue), // 是否初始化过第一次选中的值
      isOnComposition: false,
    })

    const dropdownRef = ref<typeof MtdDropdown | null>(null)
    const panelRef = ref<HTMLElement | null>(null)
    const inputRef = ref<any | null>(null)
    const virtualRef = ref<any | null>(null)
    const selectAllOptionRef = ref<IOption | null>(null)

    const firstDropdownVisible = ref(true)
    const isSlotOption = computed(() => !!slots.default || !props.options) // 🤡🤡🤡这个判断准不准？
    const m_icon = computed(() => hasProp(ins, 'icon') ? props.icon : 'down-thick')
    const pickerPrefix = computed(() => config.getPrefixCls('picker'))
    const m_preifx = computed(() => props.prefix || pickerPrefix.value)
    const dropdownPrefix = computed(() => config.getPrefixCls('dropdown'))
    const mtdPrefix = computed(() => config.getPrefix())
    const hasMatched = computed(() => {
      if (props.filterable && state.query) {
        return !!state.renderOptions.length
      }
      return true
    })
    const hasSelected = computed(() => !!state.selected)
    const empty = computed(() => {
      return (!state.m_options || !state.m_options.length)
    })
    const hasShowSelectAll = computed<boolean>(() => {
      return props.multiple && props.showSelectAll && !empty.value && (!state.query || inputRef.value?.isComposing)
    })
    const dropdownVisible = computed(() => hasProp(ins, 'visible') ? props.visible : state.innerVisible)
    const m_virtualOption = computed(() => {
      return {
        ...defaultVirtualOption,
        ...props.virtualOption,
      }
    })



    // use form-item
    const m_loading = formItemHook.loading
    const m_status = formItemHook.status
    const m_disabled = formItemHook.disabled

    /* Watch */

    watch(() => props.options, (v) => {
      if (!isSlotOption.value && v) {
        state.m_options = fieldNamesFormatter(v)
        // allowUpdateOptComps.value = true
      }
    }, { immediate: true })
    watch(() => state.m_options, () => {
      state.renderOptions = getAllOptions()
      state.hoverIndex = -1
      state.optionsMap.clear()
      if (state.m_options && state.m_options.length) {
        state.m_options.forEach((option: Option) => {
          const value = getRealValue(option.value, props.valueKey)
          state.optionsMap.set(value, option)
        })

        resetHover()
      }
      computedUnmatchSelected()
      computedSelectAll()
    }, { immediate: true })
    watch(() => props.modelValue, () => {
      state.selected = computedSelectedOptions()
      computedSelectAll()
      if (props.multiple) {
        nextTick(updatePopper)
      }
    }, { immediate: true })
    watch(() => state.renderOptions.length, () => {
      if (dropdownVisible.value) {
        updatePopper()
      }
    })
    watch(dropdownVisible, (visible: boolean) => {
      if (visible) {
        resetQuery()
      }
      if (visible) {
        emit('focus')
      } else {
        formItemHook.m_handleBlur()
      }

    })
    watch(() => props.loading, () => {
      if (dropdownVisible.value) {
        updatePopper()
      }
    })

    const emitter = markRaw(mitt())

    //created
    emitter.on('optionClick', handleOptionClick)
    emitter.on('hover', setHoverOption)
    const debouncedQuery = props.debounce
      ? debounce(props.debounce, handleQuery)
      : handleQuery

    // public methods
    function filter(value: any) {
      state.query = value
      debouncedQuery(value)
    }
    function getPanelEl() {
      return panelRef.value
    }
    function updatePopper() {
      dropdownRef.value && dropdownRef.value.updatePopper()
    }

    // private methods
    function getAllOptions() {
      let allOptions: Option[] = []
      if (hasShowSelectAll.value) {
        allOptions = [{ value: SELECT_ALL_VALUE, label: '全选' }, ...state.m_options]
      } else {
        allOptions = state.m_options
      }
      allOptions.forEach((opt: any) => {
        delete opt.hidden
      })
      return allOptions
    }

    function toggleDropdown() {
      const v = !dropdownVisible.value
      state.innerVisible = v
      emit('update:visible', v)
    }
    function openDropdown() {
      state.innerVisible = true
      emit('update:visible', true)
    }
    function closeDropdown() {
      state.innerVisible = false
      emit('update:visible', false)
    }
    function handleAllClick() {
      if (state.isSelectAll) {
        // set empty
        emit('input', [])
        emit('update:modelValue', [])
        formItemHook.m_handleChange([])
      } else {
        // select all
        let values
        if (!props.valueKey) {
          values = Array.from(state.optionsMap.keys()).filter((key: any) => {
            return !state.optionsMap.get(key).disabled
          })
        } else {
          const availableOptions = state.m_options.filter((opt: any) => !opt.disabled)
          values = (availableOptions || []).map((opt: any) => opt.value)
        }
        emit('input', values)
        emit('update:modelValue', values)
        formItemHook.m_handleChange(values)
      }
      return
    }
    function handleOptionClick(optionComponent: IOption) {
      if (m_disabled.value) {
        return
      }
      if (inputRef.value) {
        inputRef.value.focus()
      }
      if (optionComponent.value === SELECT_ALL_VALUE) {
        return handleAllClick()
      }
      const { m_option: option } = optionComponent
      setOption(option, props.multiple ? !optionComponent.m_selected : true)

      if (!props.multiple) {
        // 单选，选中后关闭下拉
        closeDropdown()
      }
    }

    function setOptionComponent(optionComponent: IOption, index: any, isRemove = false) {
      if (isRemove) {
        state.optionComponents.splice(index, 1)
      } else {
        state.optionComponents[index] = optionComponent
      }
    }

    function setSelected(option: Option) {
      if (props.valueKey) {
        //当value为对象才会生效
        state.selected = option
      }
    }

    function setOption(option: Option, selected: any) {
      if (option.value === SELECT_ALL_VALUE) {
        return handleAllClick()
      }
      const r = getRealValue(option.value, props.valueKey)

      if (props.multiple) {
        const nextValue = [...(isArray(props.modelValue) ? (props.modelValue as any) : [])]
        // todo: 提示数据错误
        if (selected) {
          nextValue.push(option.value)
          state.cachedSelected.set(r, option)
        } else {
          const r = getRealValue(option.value, props.valueKey)
          for (let i = 0; i < nextValue.length; i++) {
            if (getRealValue(nextValue[i], props.valueKey) === r) {
              nextValue.splice(i, 1)
              break
            }
          }
        }
        emit('input', nextValue)
        emit('update:modelValue', nextValue)
        formItemHook.m_handleChange(nextValue)
      } else {
        state.cachedSelected.set(r, option)
        emit('input', option.value)
        emit('update:modelValue', option.value)
        formItemHook.m_handleChange(option.value)
      }
    }
    function setHoverOption(optIns?: IOption) {
      if (optIns && !optIns.disabled) {
        state.hoverIndex = optIns.index
        state.hoverOptionIns = optIns
      }
    }

    function addSelectAllOptionIns(optionCPI: IOption) {
      state.optionComponents.unshift(optionCPI)
    }

    function resetHover() {
      if (state.hoverOptionIns) {
        state.hoverOptionIns.hover = false
      }
      state.hoverOptionIns = undefined

      // 重置为第一个选中hover
      state.optionComponents && setHoverOption(state.optionComponents[0])
      state.hoverIndex = 0
    }


    function disabledHover(hoverIndex: number) {
      if (isSlotOption.value) {
        return state.optionComponents[hoverIndex] &&
          (state.optionComponents[hoverIndex].disabled || !state.optionComponents[hoverIndex].visible)
      } else {
        const curOption = state.renderOptions[hoverIndex]
        return curOption && (curOption.disabled || curOption.hidden)
      }
    }

    function handleKeydown(e: KeyboardEvent) {
      if (isKeyUp(e) || isKeyDown(e) || isKeyEnter(e)) {
        e.preventDefault()
        e.stopPropagation()

        if (!dropdownVisible.value) {
          openDropdown()
          return
        }
        let hoverIndex = (isSlotOption.value && state.hoverOptionIns)
          ? state.optionComponents.indexOf(state.hoverOptionIns)
          : state.hoverIndex

        if (isKeyDown(e)) {
          do {
            hoverIndex++
            hoverIndex = changeIndex(hoverIndex)
          } while (disabledHover(hoverIndex))
        } else if (isKeyUp(e)) {
          do {
            hoverIndex--
            hoverIndex = changeIndex(hoverIndex)
          } while (disabledHover(hoverIndex))
        } else if (isKeyEnter(e)) {
          // 回车事件
          if (hoverIndex >= 0) {
            setOptionByIndex(hoverIndex)
          } else if (!hasMatched.value && props.allowCreate) {
            createOptionAndSelect(state.query)
          }

        }

        if (hoverIndex !== undefined) {
          if (isSlotOption.value) {
            setHoverOption(state.optionComponents[hoverIndex])
          }
          state.hoverIndex = hoverIndex
          scrollToOption(state.hoverIndex)
        }
      } else if (isKeyDelete(e)) {
        if (props.multiple && !state.query) {
          removeFinalValue()
        }
      } else if (isKeyEsc(e)) {
        if (dropdownVisible.value) {
          closeDropdown()
        }
      }

      function setOptionByIndex(index: number) {
        if (isSlotOption.value) {
          const optionComponent = state.optionComponents[index]
          const r = getRealValue(optionComponent.value, props.valueKey)
          setOption(optionComponent.m_option, !state.valueSet.has(r))
        } else {
          const curOption = state.renderOptions[index]
          const r = getRealValue(curOption.value, props.valueKey)
          setOption(curOption, !state.valueSet.has(r))
        }
      }

      function changeIndex(hoverIndex: number) {
        const length = isSlotOption.value ? state.optionComponents.length : state.renderOptions.length
        if (hoverIndex >= length) {
          hoverIndex = 0
        } else if (hoverIndex < 0) {
          hoverIndex = length - 1
        }
        return hoverIndex
      }
    }

    // 获得最后value对应的option
    function removeFinalValue() {
      if (Array.isArray(props.modelValue) && props.modelValue.length > 0) {
        setOption(state.optionsMap.get(props.modelValue[props.modelValue.length - 1]), false)
      }
    }

    function scrollToOption(index: number) {
      if (virtualRef.value) {
        virtualRef.value.scrollIntoViewByIndex(index)
      }
    }
    function resetQuery() {
      state.query = ''
      handleQuery('')
    }

    function showAllOptionComponent() {
      state.optionComponents.forEach((optionComponent: IOption) => {
        optionComponent.visible = true
      })
    }
    function handleQuery(val: string) {
      if (!props.filterable || state.previousQuery === val) {
        return
      }
      (state.previousQuery as any) = val
      if (props.remote && typeof props.remoteMethod === 'function') {
        props.remoteMethod(val)
      } else if (val === '') {
        state.renderOptions = getAllOptions()
        showAllOptionComponent()
      } else if (typeof props.filterMethod === 'function') {

        state.renderOptions = (state.m_options || []).filter((option: Option) => {
          option.hidden = !(props.filterMethod as Function)(val, option.label)
          return !option.hidden// 传入函数怎么处理🤡
        })
        state.optionComponents.forEach((optionComponent: IOption) => {
          optionComponent.visible = (props.filterMethod as Function)(val, optionComponent.label)
        })
      }
      // reset
      state.hoverIndex = -1
      if (virtualRef.value) {
        virtualRef.value.scrollToTop()
      }
    }
    function handleClickoutside(e: Event) {
      emit('clickoutside', e)
      closeDropdown()
    }

    /**
* @returns selected options, if no selected will return undefined;
*/
    function computedSelectedOptions() {
      const values = props.modelValue
      let result
      let unmatchedSelected
      if (props.multiple) {
        // iArray🤡
        if (Array.isArray(values) && values.length) {
          const {
            unmatchValues,
            options,
          } = getOptions(values, state.cachedSelected, state.optionsMap, props.valueKey)

          result = options
          unmatchedSelected = unmatchValues
        }
      } else {
        result = getOption(values, state.cachedSelected, state.optionsMap, props.valueKey)
        if (result.m__DEFAULT_OPTION__) {
          unmatchedSelected = [values]
          if (!isExist(values)) {
            result = undefined
          }
        }
      }
      state.unmatchedSelected = unmatchedSelected || []
      // update cached
      state.cachedSelected = new Map()
      state.valueSet = new Set()
      if (result) {
        const cachedOptions = props.multiple ? result : [result]
        cachedOptions.forEach((opt: Option) => {
          const r = getRealValue(opt.value, props.valueKey)
          state.cachedSelected.set(r, opt)
          state.valueSet.add(r)
        })
      }
      return result
    }

    function computedSelectAll() {

      state.isSelectAll = props.showSelectAll
        && props.multiple
        && hasSelected.value && state.m_options && Array.isArray(props.modelValue)
        && ((props.modelValue).length - state.unmatchedSelected.length) === state.m_options.filter((opt: any) => !opt.disabled).length
      // -1 是不包括全选option
    }

    function computedUnmatchSelected() {
      if (!state.unmatchedSelected || !state.unmatchedSelected.length) {
        return
      }
      if (!props.multiple) {
        const value = state.unmatchedSelected[0]
        const realValue = getRealValue(value, props.valueKey)
        const option = state.optionsMap.get(realValue)
        if (option) {
          state.selected = option
          state.cachedSelected.set(realValue, option)
        }
      } else {
        const unmatched: any[] = []
        state.selected = [] // 重置selected
        state.unmatchedSelected.forEach((rest) => {
          const { index, realValue } = rest
          const option = state.optionsMap.get(realValue)
          if (option) {
            if (isArray(state.selected) && isNumber(index)) {
              state.selected[index] = option
              state.cachedSelected.set(realValue, option)
            }
          } else {
            unmatched.push(rest);
            (state.selected as Option[]).push(rest)
          }
        })
        state.unmatchedSelected = unmatched as any
      }
    }

    function clear() {
      if (m_disabled.value) {
        return
      }
      emit('clear')
      const nextValue = props.multiple ? [] : ''
      emit('input', nextValue)
      emit('update:modelValue', nextValue)
      formItemHook.m_handleChange(nextValue)
    }

    function judgeSelectd(optionValue: any) {
      const r = getRealValue(optionValue, props.valueKey)
      return state.valueSet.has(r)
    }

    // 获取 Option 的实例
    // 💡：只能通过 插槽获取 实例，同时必须在nextTick里面调用，因为刚开始的时候插槽的VNode里面是不会保存实例的
    function getOptionComponents(children: VNode[]) {
      if (children) {
        state.optionComponents = getChildOptionCPIList(children)
      }
    }

    function getChildOptionCPIList(children: VNode[]) {
      if(!children.length){
        return []
      }

      const result = getChildInsList(ins, ['MtdOption'], {
        isDFS: true,
      }, children) as unknown as IOption[]
      selectAllOptionRef.value && result.unshift(selectAllOptionRef.value)
      return result
    }

    watch(() => state.optionComponents, (newOptComps, oldOptComps) => {
      // 新的和旧的option 实例不一致就会更新_option
      // console.log('实例计算', newOptComps, ins)
      oldOptComps = (oldOptComps ? oldOptComps : [])
      if (newOptComps && (
        (oldOptComps.length !== newOptComps.length)
        || oldOptComps.some((ins: IOption, index: number) => ins !== newOptComps[index]))
      ) {
        state.m_options = newOptComps.filter((optionComponents: IOption) => {
          return optionComponents.value !== SELECT_ALL_VALUE && optionComponents.visible
        }).map((optionComponents: IOption) => {
          return optionComponents.m_option
        })
      }
    }, { immediate: true })

    function fieldNamesFormatter(customOptions: any[]): Option[] {
      const labelProp = props.fieldNames.label
      const valueProp = props.fieldNames.value
      const disabledProp = props.fieldNames.disabled
      return customOptions.map(opt => {
        return {
          label: opt[labelProp],
          value: opt[valueProp],
          disabled: opt[disabledProp],
          data: opt,
        }
      })
    }

    function createOptionAndSelect(val: string) {
      const option = {
        label: val,
        value: val,
      }
      setOption(option, true)
    }

    onMounted(() => {
      firstDropdownVisible.value = false
      allowUpdateOptComps.value = true
    })

    const resetAttrs = useResetAttrs(attrs, true)

    return {
      emitter, firstDropdownVisible, m_loading, pickerPrefix, mtdPrefix,
      dropdownRef, panelRef, inputRef, virtualRef, m_status, m_disabled,
      selectAllOptionRef, allowUpdateOptComps, m_preifx,m_virtualOption,
      hasSelected, hasMatched, dropdownPrefix, empty, m_icon, hasShowSelectAll, dropdownVisible,
      ...toRefs(state), resetAttrs,
      resetHover, addSelectAllOptionIns, getOptionComponents,
      filter, getPanelEl, updatePopper, setSelected, createOptionAndSelect,
      getAllOptions, toggleDropdown, openDropdown, closeDropdown, handleAllClick, setOptionComponent,
      handleOptionClick, setOption, setHoverOption, handleKeydown, scrollToOption, resetQuery,
      handleQuery, handleClickoutside, computedSelectedOptions, computedSelectAll, computedUnmatchSelected, clear,
      debouncedQuery, judgeSelectd,
    }
  },
  methods: {
    // render
    renderOptionsFun(options?: any[]) {
      if (this.virtual) {
        return
      }

      let optVNodes = [] as VNode[]
      let selectAllOpt: any = null

      if (this.hasShowSelectAll) {
        selectAllOpt = <mtd-option
          ref={'selectAllOptionRef'}
          value={SELECT_ALL_VALUE}
          key={SELECT_ALL_VALUE}
          label="全选"
          selected={this.isSelectAll}
          indeterminate={this.hasSelected && !this.isSelectAll}
          /* style={{
  display: this.hasShowSelectAll ? 'none' : undefined,
}} */
          index={0}
        >全选</mtd-option>
        optVNodes.push(selectAllOpt)
      }
      

      if (getSlotsInRender(this) || !this.options) {

        optVNodes.push(...(getSlotsInRender(this) || []))

        // 只有这里才能更新 实例数组
        nextTick(() => {
          this.getOptionComponents(optVNodes)
        })
      } else if (options) {
        optVNodes = options.map((opt, index) => {
          if (opt.value === SELECT_ALL_VALUE) {
            return selectAllOpt
          } else {
            return <mtd-option
              disabled={opt.disabled}
              value={opt.value}
              label={opt.label}
              key={index}
              index={index}
              option={opt}
              selected={this.judgeSelectd(opt.value)}
            />
          }
        })
      } else {
        return undefined
      }

      return optVNodes

    },
    renderSelected(selected: Option | Option[]) {
      const { formatter, separator, maxCount } = this
      if (this.multiple && isArray(selected) && isNumber(maxCount)) {
        const values = maxCount > 0 ? selected.slice(0, maxCount) : selected
        const tx = values.map((opt: any) => {
          return formatter ? formatter(opt) : opt.label
        }).join(separator)
        const more = values.length !== selected.length ? ` ... ，共${selected.length}项` : ''
        return tx + more
      } else {
        return formatter ? formatter(selected) : (selected as Option).label
      }
    },
    renderIcon() {
      return getSlotsInRender(this, 'icon') || <mtd-icon name={this.m_icon} />
    },
    renderContent() {
      const {
        m_preifx, allowCreate, pickerPrefix,
        query,
        m_loading, loadingText,
        empty, noDataText,
        hasMatched, noMatchText,
      } = this

      return m_loading ? <li class={`${m_preifx}-loading ${pickerPrefix}-loading`}>
        {getSlotsInRender(this, 'loading') || loadingText}
      </li> : (
        !hasMatched ? <div class={`${m_preifx}-no-matched ${pickerPrefix}-no-matched`}>
          <span style="text-align:center">
            {getSlotsInRender(this, 'noMatched') || noMatchText}<br />
            {allowCreate &&
              <span>你可以新建
                <a class={`${m_preifx}-allow-create`} onClick={() => this.createOptionAndSelect(query)}>"{query}"</a>
              </span>
            }
          </span>
        </div> : (empty && !getSlotsInRender(this)) &&
        <div class={` ${m_preifx}-empty ${pickerPrefix}-empty`}>
          {getSlotsInRender(this, 'empty') || noDataText}
        </div>
      )
    },
    // 虚拟滚动用的渲染Option函数
    renderOption({ row: opt, index }: any) {
      if (opt.value === SELECT_ALL_VALUE) {
        const { isSelectAll, hasSelected } = this
        return <mtd-option 
          index={index} 
          key={index}
          option={opt} 
          value={SELECT_ALL_VALUE}
          label="全选" 
          selected={isSelectAll}
          indeterminate={hasSelected && !isSelectAll}
          style={{
            display: this.query ? 'none' : undefined,
          }}
        >全选</mtd-option>
      }
      // const render = this.$scopedSlots.default
      const r = getRealValue(opt.value, this.valueKey)

      return <mtd-option
        index={index}
        option={opt}
        disabled={opt.disabled}
        value={opt.value}
        label={opt.label}
        key={index}
        selected={this.valueSet.has(r)}
      />
    },
  },
  render() {

    const {
      renderOptions, icon, renderOptionsFun, m_preifx,
      placeholder, mtdPrefix, size,
      m_disabled: disabled, hasSelected, modelValue,
      clearable, dropdownVisible,
      appendToContainer, getPopupContainer,
      popperClass, popperOptions,
      isSelectAll, firstDropdownVisible,
      maxCount, type, virtual, resetAttrs,
      filterable, showFilterInput, query,
      panelStyle, selected, tooltip,m_virtualOption,
      renderOption,
    } = this

    const $rendered = getScopedSlotsInRender(this, 'rendered')

    const selectionProps = {
      clearable,
      icon,
      value: selected,
      placeholder,
      prefix: m_preifx,
      isSelectAll,
      focused: dropdownVisible,
      hasSelected: hasSelected,
      disabled,
      maxCount,
      type,
      size,
    }
    const selectionOptions = {
      on: {
        clear: this.clear,
        click: this.toggleDropdown,
      },
      scopedSlots: {
        selected: this.renderSelected,
        icon: this.renderIcon,
        ...getAllScopedSlots,
      },
    }

    const renderVNodes = renderOptionsFun(renderOptions)
    const virtualSlots = {
      footer: getSlotsInRender(this, 'footer') ? () => getSlotsInRender(this, 'footer') : undefined,
      default: getSlotsInRender(this) ? () => renderVNodes : undefined,
    }

    const dropdownSlots = {
      dropdown: () => <div
        class={`${m_preifx}-panel`}
        style={panelStyle}
        ref="panelRef"
      >

        {getSlotsInRender(this, 'prefix-input')}

        {filterable && showFilterInput &&
          <div class={`${m_preifx}-filter`}>
            <mtd-input
              ref="inputRef"
              modelValue={query}
              formNoValidate={true}
              clearable={true}
              autocomplete="off"
              onInput={(v: string) => { this.query = v }}
              onChange={this.debouncedQuery}
              onKeydown={this.handleKeydown}
              prefix-icon="search"
            />
          </div>
        }

        <mtd-virtual
          ref="virtualRef"
          visible={firstDropdownVisible || dropdownVisible}
          class={`${mtdPrefix}-dropdown-menu ${m_preifx}-menus`}
          view-tag="div"
          loading={this.m_loading}
          renderDefault={this.renderContent}
          renderItem={renderOption}
          data={renderOptions}
          row-height={m_virtualOption.rowHeight} // 🤡 🤡 🤡 这里给个配置吧
          {...vSlots(virtualSlots)}
          v-slots={virtualSlots}
          virtual={virtual}
        >
        </mtd-virtual>
      </div>,
    }

    return <mtd-dropdown
      disabled={disabled}
      appendToContainer={appendToContainer}
      getPopupContainer={getPopupContainer}
      ref="dropdownRef"
      visible={dropdownVisible}
      popper-class={[`${m_preifx}-popper`, popperClass]}
      should-computed-width={false}
      popper-options={popperOptions}
      use-show={true}
      onClickoutside={this.handleClickoutside}
      lazy={false}
      {...vSlots(dropdownSlots)}
      v-slots={dropdownSlots}

      {...resetAttrs}
      wrapperTag="div"
      class={{
        [m_preifx]: true,
        [`${m_preifx}-disabled`]: disabled,
        [`${m_preifx}-selected`]: hasSelected,
        [`${m_preifx}-${size}`]: size,
      }}
    >
      {$rendered
        ? $rendered(selectionProps)
        : <selection
          {...toProps(selectionProps)}
          on={selectionOptions.on}
          {...vSlots(selectionOptions.scopedSlots)}
          v-slots={selectionOptions.scopedSlots}
        />
      }
    </mtd-dropdown>
  },
})
