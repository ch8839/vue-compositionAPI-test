import {
  defineComponent,
  computed,
  provide,
  reactive,
  toRefs,
  watch,
  nextTick,
  markRaw,
  ref,
  h as hFun,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import {
  isArray, isExist,
  hasProps, getRealValue,
  isKeyDown, isKeyUp, isKeyEnter,
  isKeyEsc,
  isKeyDelete,
} from '../picker/util'

import MtdDropdown from '@components/dropdown'
import MtdOption from '@components/option'
import MtdInput from '@components/input'
import MtdVirtual from '@components/virtual'
import Selection from '../picker/selection'
import vueInstance from '@components/hooks/instance'
import mitt from '@utils/mitt'
import { debounce } from '@utils/debounce'

import { Option, OptionCPI } from '@components/option/types'
import { PickerVirtualState } from '../picker/types'
import { useClassStyle } from '@components/hooks/pass-through'


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

export const SELECT_ALL_VALUE = '__SELECT_ALL__'

export default defineComponent({
  name: 'MtdPickerVirtual',
  components: {
    MtdDropdown,
    MtdOption,
    MtdInput,
    MtdVirtual,
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
      require: true,
      default: () => [],
    },
    fieldNames: Object,
    modelValue: [Number, String, Array, Object],
    valueKey: String,
    visible: Boolean,
    disabled: Boolean,
    placeholder: String,
    clearable: {
      type: Boolean,
      default: true,
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
      default: 'mtd-picker',
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
  },
  emits: [],
  setup(props, { emit, slots }) {
    const config = useConfig()
    const ins = vueInstance()
    provide('select', ins)

    const classStyle = useClassStyle()
    const prefixMTD = computed(() => config.getPrefix())


    const state: PickerVirtualState = reactive({
      innerVisible: false,
      valueSet: new Set(),
      cachedSelected: new Map(),
      optionsMap: new Map(),
      _options: initOptions(),
      renderOptions: [],
      selected: undefined, // option[]
      unmatchedSelected: [], // type: { index: number, value: any }[];
      isSelectAll: false,
      query: '',
      previousQuery: '',
      hoverIndex: -1,
      hoverOption: undefined,
    })

    const dropdownRef = ref<typeof MtdDropdown | null>(null)
    const panelRef = ref<HTMLElement | null>(null)
    const inputRef = ref<any | null>(null)
    const virtualRef = ref<any | null>(null)

    const _icon = computed(() => hasProps(ins, 'icon') ? props.icon : 'down-thick')
    const dropdownPrefix = computed(() => config.getPrefixCls('dropdown'))
    const hasMatched = computed(() => {
      if (props.filterable && state.query) {
        return !!state.renderOptions.length
      }
      return true
    })
    const hasSelected = computed(() => !!state.selected)
    const empty = computed(() => (!state._options || !state._options.length) && !slots.default)
    const hasShowSelectAll = computed(() => {
      return props.multiple && props.showSelectAll && !empty.value && !state.query
    })
    const dropdownVisible = computed<boolean>(() => hasProps(ins, 'visible') ? props.visible : state.innerVisible)

    watch(() => props.modelValue, () => {
      state.selected = computedSelectedOptions()
      computedSelectAll()
      if (props.multiple) {
        nextTick(updatePopper)
      }
    }, { immediate: true })
    watch(() => state._options, () => {
      state.renderOptions = getAllOptions()
      state.hoverIndex = -1
      state.optionsMap.clear()
      if (state._options && state._options.length) {
        state._options.forEach((option: any) => {
          const value = getRealValue(option.value, props.valueKey)
          state.optionsMap.set(value, option)
        })
      }
      computedUnmatchSelected()
      computedSelectAll()
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
      emit(visible ? 'focus' : 'blur')
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
    function initOptions() {
      if (props.fieldNames) {
        return props.options.map((optionData: any) => {
          return formatOption(optionData)
        })
      } else {
        return props.options
      }
    }

    function formatOption(optionData: any): Option {
      let realLabel = 'label'
      let realDisabled = 'disabled'
      let realValue = 'value'

      if (props.fieldNames) {
        realLabel = props.fieldNames.label ? props.fieldNames.label : 'label'
        realDisabled = props.fieldNames.disabled ? props.fieldNames.disabled : 'disabled'
        realValue = props.fieldNames.value ? props.fieldNames.value : 'value'
      }

      return {
        label: optionData[realLabel],
        value: optionData[realValue],
        disabled: optionData[realDisabled],
        index: -1, // 初始化
        realValue: getRealValue(optionData[realValue], props.valueKey),
      }
    }

    function getAllOptions() {
      if (hasShowSelectAll.value) {
        return [{ value: SELECT_ALL_VALUE, label: '全选' }, ...state._options]
      }
      return state._options || []
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
        emit('change', [])
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
        emit('change', values)
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
        emit('change', nextValue)
      } else {
        state.cachedSelected.set(r, option)
        emit('input', option.value)
        emit('update:modelValue', option.value)
        emit('change', option.value)
      }
    }
    function setHoverOption(optionComponent: OptionCPI) {
      state.hoverIndex = optionComponent.index
    }

    function handleKeydown(e: KeyboardEvent) {

      if (isKeyUp(e) || isKeyDown(e) || isKeyEnter(e)) {
        e.preventDefault()
        e.stopPropagation()

        if (!dropdownVisible.value) {
          openDropdown()
          return
        }
        let hoverIndex
        if (isKeyDown(e)) {
          hoverIndex = (state.hoverIndex) + 1
          while (state.renderOptions[hoverIndex] && (state.renderOptions[hoverIndex].disabled)) {
            hoverIndex++
          }
        } else if (isKeyUp(e)) {
          hoverIndex = (state.hoverIndex) - 1
          while (state.renderOptions[hoverIndex] && (state.renderOptions[hoverIndex].disabled)) {
            hoverIndex--
          }
        } else if (isKeyEnter(e)) {
          if (state.hoverIndex >= 0 && state.hoverIndex < state.renderOptions.length) {
            const option = state.renderOptions[state.hoverIndex]
            const r = getRealValue(option.value, props.valueKey)
            setOption(option, !state.valueSet.has(r))
          }
        }

        if (hoverIndex !== undefined) {
          const { length } = state.renderOptions
          // todo: 需要处理 disabled 的情况
          if (hoverIndex >= length) {
            hoverIndex = 0
          } else if (hoverIndex < 0) {
            hoverIndex = length - 1
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
    }

    // 获得最后value对应的option
    function removeFinalValue() {
      if (Array.isArray(props.modelValue)) {
        setOption(state.optionsMap.get(props.modelValue[0]), false)
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
    function handleQuery(val: string) {
      if (!props.filterable || state.previousQuery === val) {
        return
      }
      (state.previousQuery as any) = val
      if (props.remote && typeof props.remoteMethod === 'function') {
        props.remoteMethod(val)
      } else if (val === '') {
        state.renderOptions = getAllOptions()
      } else if (typeof props.filterMethod === 'function') {
        state.renderOptions = (state._options || []).filter((option: any) => {
          return (props.filterMethod as Function)(val, option.label) // 传入函数怎么处理🤡
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
        && hasSelected.value && state._options
        && ((props.modelValue as any[]).length - state.unmatchedSelected.length)
        === state._options.filter((opt: any) => !opt.disabled).length
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
          if (option as number) {
            (state.selected as any)[index as number] = option
            state.cachedSelected.set(realValue, option)
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
      return state.valueSet.has(getRealValue(optionValue, props.valueKey))
    }

    return {
      emitter, prefixMTD,
      dropdownRef, panelRef, inputRef, virtualRef,
      hasSelected, hasMatched, dropdownPrefix, empty, _icon, hasShowSelectAll, dropdownVisible,
      ...toRefs(state),
      filter, getPanelEl, updatePopper,
      getAllOptions, toggleDropdown, openDropdown, closeDropdown, handleAllClick,
      handleOptionClick, setOption, setHoverOption, handleKeydown, scrollToOption, resetQuery,
      handleQuery, handleClickoutside, computedSelectedOptions, computedSelectAll, computedUnmatchSelected, clear,
      debouncedQuery, judgeSelectd, classStyle,
    }
  },
  methods: {
    renderOption({ row: opt, index }: any) {
      if (opt.value === SELECT_ALL_VALUE) {
        const { isSelectAll, hasSelected } = this
        return <mtd-option index={index} key={index}
          option={opt} value={SELECT_ALL_VALUE}
          label="全选" selected={isSelectAll}
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
        option={opt} disabled={opt.disabled}
        value={opt.value} label={opt.label} key={index}
        selected={this.valueSet.has(r)}
      >
        {opt.label}
      </mtd-option>
    },
    renderSelected(selected: any) {
      const { formatter, separator, maxCount } = this
      if (this.multiple) {
        const values = maxCount > 0 ? selected.slice(0, maxCount) : selected
        const tx = values.map((opt: any) => {
          return formatter ? formatter(opt) : opt.label
        }).join(separator)
        const more = values.length !== selected.length ? `，共${selected.length}项` : ''
        return tx + more
      }
      return formatter ? formatter(selected) : selected.label
    },
    renderIcon() {
      return this.$slots.icon || <i class={this._icon} />
    },
    renderContent() {
      const {
        prefix,
        dropdownPrefix,
        loading, loadingText,
        empty, noDataText,
        hasMatched, noMatchText,
      } = this
      const {
        empty: $empty,
        loading: $loading,
        noMatched: $noMatched,
      } = this.$slots
      return loading ? <li class={`${dropdownPrefix}-menu-item ${prefix}-loading`}>
        {$loading || loadingText}
      </li> : (
        !hasMatched ? <li class={`${dropdownPrefix}-menu-item ${prefix}-no-matched`}>
          {$noMatched || noMatchText}
        </li> : (empty && <div class={`${dropdownPrefix}-menu-item ${prefix}-empty`}>
          {$empty || noDataText}
        </div>
        )
      )
    },
  },
  render() {
    const {
      renderOptions, icon,
      placeholder, prefix, prefixMTD,
      disabled, hasSelected,
      clearable, dropdownVisible,
      appendToContainer, getPopupContainer,
      popperClass, popperOptions,
      isSelectAll,
      loading, maxCount,
      filterable, showFilterInput, query,
      panelStyle, selected, classStyle,
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
        prefix,
        isSelectAll,
        focused: dropdownVisible,
        hasSelected: hasSelected,
        disabled,
        maxCount,
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
    }


    return <mtd-dropdown
      disabled={disabled}
      appendToContainer={appendToContainer}
      getPopupContainer={getPopupContainer}
      ref="dropdownRef"
      visible={dropdownVisible}
      popper-class={[`${prefix}-popper`, popperClass]}
      should-computed-width={false}
      popper-options={popperOptions}
      use-show={true}
      onClickoutside={this.handleClickoutside}
      class={{
        [prefix]: true,
        [`${prefix}-disabled`]: disabled,
        [`${prefix}-selected`]: hasSelected,
      }}
      wrapperTag="fragment"
    >
      <div
        class={[
          {
            [prefix]: true,
            [`${prefix}-disabled`]: disabled,
            [`${prefix}-selected`]: hasSelected,
          },
          classStyle.class,
        ]}
        style={classStyle.style}
      >
        {$rendered ? $rendered(selectionOptions.props) : hFun(Selection as any, selectionOptions as any)}
      </div>
      <div slot="dropdown" class={`${prefix}-panel`}
        ref="panelRef" style={panelStyle}>
        {$input}
        {filterable && showFilterInput && <div class={`${prefixMTD}-picker-filter`}>
          <mtd-input ref="inputRef" modelValue={query} formNoValidate={true}
            clearable={true} autocomplete="off"
            onInput={(v: string) => this.query = v}
            onChange={this.debouncedQuery}
            onKeydown={this.handleKeydown}
            prefix-icon="search"
          />
        </div>}
        <mtd-virtual
          ref="virtualRef"
          visible={dropdownVisible}
          class={`${prefixMTD}-dropdown-menu ${prefixMTD}-picker-menus`}
          view-tag="div"
          data={renderOptions}
          row-height={36}
          loading={loading}
          renderItem={this.renderOption}
          renderDefault={this.renderContent}
          virtual={true}
        />
      </div>
    </mtd-dropdown>
  },
})
