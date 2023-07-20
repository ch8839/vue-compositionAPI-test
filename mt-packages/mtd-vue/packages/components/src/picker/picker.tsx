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
  h as hFun,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import {
  isArray, isExist,
  hasProps, getRealValue,
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

import vueInstance from '@components/hooks/instance'
import mitt from '@utils/mitt'
import { debounce } from '@utils/debounce'

import { Option, OptionCPI, SELECT_ALL_VALUE } from '@components/option/types'
import { PickerState } from './types'
import { isNumber } from '@components/__utils__/type'
import { getChildInstanceList } from '@components/__utils__/vnode'
import { VNode } from 'vue'
import { useClassStyle } from '@components/hooks/pass-through'
import { useFormItem } from '@components/form-item/useFormItem'

import { InputStatus } from '@components/input/types'
import MtdIcon from '@components/icon'

// 🤡这里的any有点多了

function createDefaultOption(value: any) {
  return { value, label: isExist(value) ? value.toString() : '', __DEFAULT_OPTION__: true }
}

function getOption(value: any, cachedMap: Map<any, any>, optionsMap: Map<any, any>, valueKey: string | undefined) {
  const realValue = getRealValue(value, valueKey)
  return cachedMap.get(realValue)
    || optionsMap.get(realValue)
    || createDefaultOption(value)
}

function getOptions(values: any[], cachedMap: Map<any, any>, optionsMap: Map<any, any>, valueKey: string | undefined) {
  const unmatchValues = []
  const matchValues = []
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

  emits: [],
  setup(props, { emit, slots, attrs }) {
    const config = useConfig()
    const ins = vueInstance()
    provide('select', ins)


    const allowUpdateOptComps = ref(false)

    const classStyle = useClassStyle()

    const formItemHook = useFormItem(props, { emit, slots, attrs })

    const state: PickerState = reactive({
      innerVisible: false,
      valueSet: new Set(),
      cachedSelected: new Map(),
      optionsMap: new Map(),
      _options: [],
      renderOptions: [],
      optionComponents: [], // option的组件实例
      selected: undefined, // option[]
      unmatchedSelected: [], // type: { index: number, value: any }[];
      isSelectAll: false,
      query: '',
      previousQuery: '',
      hoverIndex: -1,
      hoverOptionIns: undefined,
      optionIndex: 0,
      hasInit: !(props.modelValue), // 是否初始化过第一次选中的值
      isOnComposition: false,
    })

    const dropdownRef = ref<typeof MtdDropdown | null>(null)
    const panelRef = ref<HTMLElement | null>(null)
    const inputRef = ref<any | null>(null)
    const virtualRef = ref<any | null>(null)
    const selectAllOptionRef = ref<OptionCPI | null>(null)

    const firstDropdownVisible = ref(true)

    const isSlotOption = computed(() => !!slots.default || !props.options) // 🤡🤡🤡这个判断准不准？
    const _icon = computed(() => hasProps(ins, 'icon') ? props.icon : 'down-thick')
    const pickerPrefix = computed(() => config.getPrefixCls('picker'))
    const _preifx = computed(() => props.prefix || pickerPrefix.value)
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
      return (!state._options || !state._options.length) && !ins.$slots.default
    })
    const hasShowSelectAll = computed<boolean>(() => {
      return props.multiple && props.showSelectAll && !empty.value && (!state.query || inputRef.value?.isComposing)
    })
    const dropdownVisible = computed(() => hasProps(ins, 'visible') ? props.visible : state.innerVisible)

    // use form-item
    const _loading = formItemHook.loading
    const _status = formItemHook.status

    /* Watch */
    watch(() => state.optionComponents, (newOptComps, oldOptComps) => {
      if (
        isSlotOption.value && newOptComps &&
        ((oldOptComps as OptionCPI[]).length !== newOptComps.length
          || (oldOptComps as OptionCPI[]).some((ins, index) => ins !== newOptComps[index]))
      ) {
        state._options = newOptComps.filter((optionComponents: OptionCPI) => {
          return optionComponents.value !== SELECT_ALL_VALUE && optionComponents.visible
        }).map((optionComponents: OptionCPI) => {
          return optionComponents._option
        })
      }
    }, { immediate: true })

    watch(() => props.options, (v) => {
      if (!isSlotOption.value && v) {
        state._options = fieldNamesFormatter(v)
        allowUpdateOptComps.value = true
      }
    }, { immediate: true })
    watch(() => state._options, () => {
      state.renderOptions = getAllOptions()
      state.hoverIndex = -1
      state.optionsMap.clear()
      if (state._options && state._options.length) {
        state._options.forEach((option: Option) => {
          const value = getRealValue(option.value, props.valueKey)
          state.optionsMap.set(value, option)
        })
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
        formItemHook._handleBlur()
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
      let allOptions = []
      if (hasShowSelectAll.value) {
        allOptions = [{ value: SELECT_ALL_VALUE, label: '全选' }, ...state._options]
      } else {
        allOptions = state._options
      }
      allOptions.forEach(opt => {
        delete opt.hidden
      })
      return allOptions
    }

    function toggleDropdown(v: boolean | undefined) {
      if (v === undefined) {
        v = !dropdownVisible.value
      }
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
        formItemHook._handleChange([])
      } else {
        // select all
        let values
        if (!props.valueKey) {
          values = Array.from(state.optionsMap.keys()).filter((key: any) => {
            return !state.optionsMap.get(key).disabled
          })
        } else {
          const availableOptions = state._options.filter((opt: any) => !opt.disabled)
          values = (availableOptions || []).map((opt: any) => opt.value)
        }
        emit('input', values)
        emit('update:modelValue', values)
        formItemHook._handleChange(values)
      }
      return
    }
    function handleOptionClick(optionComponent: OptionCPI) {
      if (props.disabled) {
        return
      }
      if (inputRef.value) {
        inputRef.value.focus()
      }
      if (optionComponent.value === SELECT_ALL_VALUE) {
        return handleAllClick()
      }
      const { _option: option } = optionComponent
      setOption(option, props.multiple ? !optionComponent._selected : true)

      if (!props.multiple) {
        // 单选，选中后关闭下拉
        toggleDropdown(false)
      }
    }

    function setOptionComponent(optionComponent: OptionCPI, index: any, isRemove = false) {
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
        formItemHook._handleChange(nextValue)
      } else {
        state.cachedSelected.set(r, option)
        emit('input', option.value)
        emit('update:modelValue', option.value)
        formItemHook._handleChange(option.value)
      }
    }
    function setHoverOption(optIns?: OptionCPI) {
      if (optIns && !optIns.disabled) {
        state.hoverIndex = optIns.index
        state.hoverOptionIns = optIns
      }
    }

    function addSelectAllOptionIns(optionCPI: OptionCPI) {
      state.optionComponents.unshift(optionCPI)
    }

    function resetHover() {
      if (state.hoverOptionIns) {
        state.hoverOptionIns.hover = false
      }
      state.hoverOptionIns = undefined
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
          const optionComponent = state.optionComponents[index] as OptionCPI
          const r = getRealValue(optionComponent.value, props.valueKey)
          setOption(optionComponent._option, !state.valueSet.has(r))
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
      state.optionComponents.forEach((optionComponent: OptionCPI) => {
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
        state.renderOptions = (state._options || []).filter((option: Option) => {
          option.hidden = !(props.filterMethod as Function)(val, option.label)
          return !option.hidden// 传入函数怎么处理🤡
        })
        state.optionComponents.forEach((optionComponent: OptionCPI) => {
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
      resetHover()
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
        if (result.__DEFAULT_OPTION__) {
          unmatchedSelected = [values]
          if (!isExist(values)) {
            result = undefined
          }
        }
      }
      state.unmatchedSelected = unmatchedSelected as any || []
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

      state.isSelectAll = props.showSelectAll && props.multiple
        && hasSelected.value && state._options && Array.isArray(props.modelValue)
        && ((props.modelValue as any[]).length - state.unmatchedSelected.length)
        === state._options.filter((opt: any) => !opt.disabled).length


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
            unmatched.push(rest)
          }
        })
        state.unmatchedSelected = unmatched as any
      }
    }

    function clear() {
      if (props.disabled) {
        return
      }
      emit('clear')
      const nextValue = props.multiple ? [] : ''
      emit('input', nextValue)
      emit('update:modelValue', nextValue)
      emit('change', nextValue)
    }

    function judgeSelectd(optionValue: any) {
      const r = getRealValue(optionValue, props.valueKey)
      return state.valueSet.has(r)
    }

    // 重新获取 Option 的实例
    function getOptionComponents() {
      if (ins.$slots.default) {
        state.optionComponents = getChildOptionCPIList()
      }
    }

    function getChildOptionCPIList() {
      const isDFS = true
      const result = getChildInstanceList(ins, ['MtdOption'], isDFS) as OptionCPI[]
      selectAllOptionRef.value && result.unshift(selectAllOptionRef.value)
      return result
    }

    function fieldNamesFormatter(customOptions: any[]): Option[] {
      const labelProp = props.fieldNames.label
      const valueProp = props.fieldNames.value
      const disabledProp = props.fieldNames.disabled
      return customOptions.map(opt => {
        return {
          label: opt[labelProp],
          value: opt[valueProp],
          disabled: opt[disabledProp],
          sourceOptionData: opt,
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
      // getOptionComponents()
    })
    onUpdated(() => {
      getOptionComponents()
    })
    return {
      emitter, firstDropdownVisible, _loading, pickerPrefix, mtdPrefix,
      dropdownRef, panelRef, inputRef, virtualRef, _status,
      selectAllOptionRef, allowUpdateOptComps, classStyle, _preifx,
      hasSelected, hasMatched, dropdownPrefix, empty, _icon, hasShowSelectAll, dropdownVisible,
      ...toRefs(state),
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

      if (this.$slots.default) {
        optVNodes.push(...this.$slots.default)
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
            >
              {opt.label}
            </mtd-option>
          }
        })
      } else {
        return undefined
      }

      if (this.allowUpdateOptComps) {
        this.$nextTick(() => {
          this.getOptionComponents()
          this.allowUpdateOptComps = false
        })
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
      return this.$slots.icon || <mtd-icon name={this._icon} />
    },
    renderContent() {
      const {
        _preifx, allowCreate, pickerPrefix,
        query,
        _loading, loadingText,
        empty, noDataText,
        hasMatched, noMatchText,
      } = this
      const {
        empty: $empty,
        loading: $loading,
        noMatched: $noMatched,
      } = this.$slots
      return _loading ? <li class={`${_preifx}-loading ${pickerPrefix}-loading`}>
        {$loading || loadingText}
      </li> : (
        !hasMatched ? <div class={`${_preifx}-no-matched ${pickerPrefix}-no-matched`}>
          <span style="text-align:center">
            {$noMatched || noMatchText}<br />
            {allowCreate &&
              <span>你可以新建
                <a class={`${_preifx}-allow-create`} onClick={() => this.createOptionAndSelect(query)}>"{query}"</a>
              </span>
            }
          </span>
        </div> : (empty && !this.$slots.default) &&
        <div class={` ${_preifx}-empty ${pickerPrefix}-empty`}>
          {$empty || noDataText}
        </div>
      )
    },
  },
  render() {
    const {
      renderOptions, icon, renderOptionsFun, _preifx,
      placeholder, mtdPrefix, size,
      disabled, hasSelected, modelValue,
      clearable, dropdownVisible,
      appendToContainer, getPopupContainer,
      popperClass, popperOptions,
      isSelectAll, firstDropdownVisible,
      maxCount, type,
      filterable, showFilterInput, query,
      panelStyle, selected, classStyle, tooltip,
    } = this
    const {
      'prefix-input': $input,
    } = this.$slots
    const {
      rendered: $rendered,
    } = this.$scopedSlots
    const selectionOptions = {
      props: {
        clearable,
        icon,
        value: selected,
        placeholder,
        prefix: _preifx,
        isSelectAll,
        focused: dropdownVisible,
        hasSelected: hasSelected,
        disabled,
        maxCount,
        type,
        size,
      },
      on: {
        clear: this.clear,
        click: this.toggleDropdown,
      },
      scopedSlots: {
        selected: this.renderSelected,
        ...this.$scopedSlots,
        icon: this.renderIcon,
      },
      /* attrs: {
        class: {
          [prefix]: true,
          [`${prefix}-disabled`]: disabled,
          [`${prefix}-selected`]: hasSelected,
        },
      }, */
    }
    return <mtd-dropdown
      disabled={disabled}
      appendToContainer={appendToContainer}
      getPopupContainer={getPopupContainer}
      ref="dropdownRef"
      visible={dropdownVisible}
      popper-class={[`${_preifx}-popper`, popperClass]}
      should-computed-width={false}
      popper-options={popperOptions}
      use-show={true}
      onClickoutside={this.handleClickoutside}
      wrapperTag="fragment"
      lazy={false}
    >
      <div
        class={[
          {
            [_preifx]: true,
            [`${_preifx}-disabled`]: disabled,
            [`${_preifx}-selected`]: hasSelected,
            [`${_preifx}-${size}`]: size,
          },
          classStyle.class,
        ]}
        style={classStyle.style}
      >
        <mtd-tooltip content={formatShowValue(modelValue)} placement="top" disabled={!(tooltip && hasSelected)}>
          {$rendered ? $rendered(selectionOptions.props) : hFun(Selection as any, selectionOptions as any)}
        </mtd-tooltip>
      </div>
      <div slot="dropdown" class={`${_preifx}-panel`}
        ref="panelRef" style={{
          ...panelStyle,
        }}>
        {$input}
        {filterable && showFilterInput && <div class={`${_preifx}-filter`}>
          <mtd-input ref="inputRef" modelValue={query} formNoValidate={true}
            clearable={true} autocomplete="off"
            onInput={(v: string) => { this.query = v }}
            onChange={this.debouncedQuery}
            onKeydown={this.handleKeydown}
            prefix-icon="search"
          />
        </div>}
        <mtd-virtual ref="virtualRef" visible={firstDropdownVisible || dropdownVisible}
          class={`${mtdPrefix}-dropdown-menu ${_preifx}-menus`}
          view-tag="div"
          loading={this._loading}
          renderDefault={this.renderContent}
          data={renderOptions}
          row-height={36} // 🤡 这里给个配置吧
          height={300} // 🤡 这里给个配置吧
        >
          {renderOptionsFun(renderOptions)}
          {this.$slots.footer &&
            <template slot="footer">
              {this.$slots.footer}
            </template>
          }
        </mtd-virtual>
      </div>
    </mtd-dropdown>
  },
})
