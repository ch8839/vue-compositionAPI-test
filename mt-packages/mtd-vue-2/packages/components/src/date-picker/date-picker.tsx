import {
  computed,
  defineComponent,
  markRaw,
  PropType,
  provide,
  reactive,
  ref,
  toRefs,
  useResetAttrs,
  getScopedSlotsInRender,
  vSlots,
  getSlotsInRender,
} from '@ss/mtd-adapter'
import { Popper, Drop, Reference } from '@components/popper'
import {
  clearHours,
  DEFAULT_FORMATS,
  TYPE_VALUE_RESOLVER_MAP,
} from '@utils/date'
import { isArray } from '@utils/type'

import DatePickerPanel from './panel/date'
import RangeDatePickerPanel from './panel/date-range'
import WeekPickerPanel from './panel/week'

import DatePickerInput from '@components/time-picker/time-picker-input'
import RangeInput from '@components/time-picker/range-input'

import dayjs, { Dayjs } from 'dayjs'
import mitt from '@utils/mitt'
import {
  DatePickerMode,
  DatePickerType,
  DatePickerOptions,
  IDateCell,
} from './types'
import useConfig from '@hooks/config'
import useControlled from '@hooks/controlled'

import { ProvideKey } from './provide'
import { Option } from '@components/option/types'

import { useFormItem } from '@components/form-item/useFormItem'

function getDefaultPopupContainer() {
  return document.body
}

function isRange(t: any) {
  return t.type.indexOf('range') > -1
}

function fill<T = any>(
  arr: Array<T>,
  length: number,
  defaultValue: any,
): Array<T> {
  for (let i = arr.length; i < length; i++) {
    arr[i] = defaultValue
  }
  return arr
}

export default defineComponent({
  name: 'MtdDatePicker',
  components: {
    Popper,
    Drop,
    Reference,
    DatePickerInput,
    RangeInput,
  },
  inheritAttrs: true,
  model: {
    prop: 'modelValue',
    event: 'update:modelValue',
  },
  props: {
    format: {
      type: String,
    },
    valueFormat: {
      // 如果没有配置则默认按照当前 value 属性推断
      type: String,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    editable: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    closable: {
      type: Boolean,
      default: true,
    },
    clearable: {
      type: Boolean,
      default: true,
    },
    confirm: {
      type: Boolean,
      default: false,
    },
    open: {
      type: Boolean,
      default: undefined,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    timePickerOptions: {
      default: () => ({}),
      type: Object,
    },
    splitPanels: {
      type: Boolean,
      default: true,
    },
    showWeekNumbers: {
      type: Boolean,
      default: false,
    },
    startDate: {
      type: Date,
    },
    size: {
      type: String,
    },
    placeholder: {
      type: [String, Array],
      default: '',
    },
    placement: {
      type: String,
    },
    name: {
      type: String,
    },
    id: {
      type: String,
    },
    steps: {
      type: Array,
      default: () => [],
    },
    modelValue: {
      type: [Date, String, Array, Number],
    },
    options: {
      type: Object as PropType<DatePickerOptions>,
      default: () => ({}),
    },
    icon: {
      type: String,
      default: 'calendar-o',
    },
    appendToContainer: {
      type: Boolean,
      default: true,
    },
    getPopupContainer: {
      type: Function,
      default: getDefaultPopupContainer,
    },
    invalid: Boolean,
    loading: Boolean,
    genre: String,
    showBtnNow: {
      type: Boolean,
      default: true,
    },
    popperClass: String,

    defaultTime: {
      type: [String, Array],
    },
    popperOptions: Object,
    type: {
      type: String as PropType<DatePickerType>,
      validator: (value: string) => {
        return (
          [
            'year',
            'yearrange',
            'month',
            'date',
            'daterange',
            'datetime',
            'datetimerange',
            'week',
            'weekrange',
            'monthrange',
            'quarter',
            'quarterrange',
            'halfyear',
            'halfyearrange',
          ].indexOf(value) > -1
        )
      },
      default: 'date',
    },
    showTag: {
      type: Boolean,
      default: true,
    },
    weekStart: {
      type: Number,
      default: 1,
      validator: (v: number) => {
        return v >= 0 && v <= 6
      },
    },
  },

  emits: [
    'update:open',
    'clickoutside',
    'input',
    'change',
    'update:value',
    'focus',
    'blur',
    'cancel',
    'pick-range',
    'update:modelValue',
    'clear',
    'confirm',
  ],

  setup(props, ctx) {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('date-picker'))
    const resetAttrs = useResetAttrs(ctx as any, true)
    const panelOption = useResetAttrs(props.options)

    const internalValue: Dayjs[] = parseDate(props.modelValue)
    const [open, setOpen] = useControlled<boolean>('open', props, ctx)
    const focusSide = ref('')

    const state = reactive({
      internalValue: internalValue,
      cacheValue: [...internalValue],
      inputValue: formatDate(internalValue),
      isFocused: false,
      focusedDate:
        internalValue[0] ||
        (props.startDate ? dayjs(props.startDate) || dayjs() : dayjs()),
      selectionMode: 'date' as DatePickerMode,
      selecting: false,
      emitter: markRaw(mitt()),
      holdOpen: false,
    })

    const inputValueOptions = computed(() => {
      if (props.multiple && state.inputValue) {
        const inputArr = state.inputValue.toString().split(',')
        const result = state.internalValue.map((day, index) => {
          return {
            label: inputArr[index],
            value: day,
          }
        })
        return result
      } else {
        return undefined
      }
    })

    const canParsed = computed(() => {
      // 现在所有的类型都可以被 value-format 解析
      return true
      /* return !(props.type.indexOf('quarter') > -1
        || props.type.indexOf('halfyear') > -1
        || props.type.indexOf('week') > -1) */
    })

    /* Created */
    state.selectionMode = onSelectionModeChange(props.type)
    provide(ProvideKey, {
      setHoldOpen,
      appendToContainer: props.appendToContainer,
      getPopupContainer: props.getPopupContainer,
    })

    function formatDate(
      val: Dayjs | Dayjs[] | undefined,
      format?: string | undefined,
      options?: any,
    ): string | number | undefined {
      const defaultFormat = DEFAULT_FORMATS[props.type]
      const defaultOption = { weekStart: props.weekStart }
      const formatter = (
        (props.multiple
          ? TYPE_VALUE_RESOLVER_MAP['multiple']
          : TYPE_VALUE_RESOLVER_MAP[props.type]) ||
        TYPE_VALUE_RESOLVER_MAP['default']
      ).formatter
      return formatter(val as any, format || defaultFormat, options || defaultOption)
    }

    function formatToModelValue(date: Dayjs | Dayjs[] | undefined) {
      const isRange = (props.type.indexOf('range') > -1)
      if (isRange && isArray(date)) {
        // 此处是范围选
        if (canParsed.value && props.valueFormat) {
          return date.map((d) => formatSingleValue(d))
        } else {
          return date?.map(d => d.toDate())
        }
      } else if (props.multiple && isArray(date)) {
        if (canParsed.value && props.valueFormat) {
          return (formatDate(date, props.valueFormat) as string).split(',')
        } else {
          return date?.map(d => d.toDate())
        }
      } else {
        // 此处是单选
        if (isArray(date)) {
          return formatSingleValue(date[0])
        }
        return formatSingleValue(date as Dayjs)
      }

    }
    function formatSingleValue(date: Dayjs | undefined) {

      if (props.valueFormat === 'timestamp') {
        return date ? date.valueOf() : undefined
      } else if (props.valueFormat) {
        return formatDate(date, props.valueFormat || props.format)
      } else {
        return date?.toDate() || undefined
      }
    }

    function onSelectionModeChange(type: DatePickerType): DatePickerMode {
      if (type.match(/^month/)) {
        type = 'month'
      } else if (type.match(/^year/)) {
        type = 'year'
      } else if (type.match(/^quarter/)) {
        type = 'quarter'
      } else if (type.match(/^halfyear/)) {
        type = 'halfyear'
      } else {
        type = 'date'
      }
      state.selectionMode = type
      return state.selectionMode
    }

    function parseDate(val: any | any[], format?: string): Dayjs[] {
      const range = isRange(props)
      const parser = (
        (props.multiple
          ? TYPE_VALUE_RESOLVER_MAP['multiple']
          : TYPE_VALUE_RESOLVER_MAP[props.type]) ||
        TYPE_VALUE_RESOLVER_MAP['default']
      ).parser
      const dates = parser(val, format || props.valueFormat || DEFAULT_FORMATS[props.type])
      if (range) {
        return fill<Dayjs>(dates as Dayjs[], 2, undefined)
      } else if (props.multiple) {
        return dates as Dayjs[]
      }
      return dates ? ([dates] as Dayjs[]) : []
    }

    function setHoldOpen(val: boolean) {
      state.holdOpen = val
    }

    const formItemHook = useFormItem(props, ctx)

    return {
      prefixCls: prefix, panelOption, onSelectionModeChange, inputValueOptions, formatToModelValue,
      ...toRefs(state), canParsed,
      resetAttrs,
      m_open: open,
      setOpen,
      focusSide,
      formatDate, parseDate,
      m_disabled: formItemHook.disabled,
      m_handleChange: formItemHook.m_handleChange,
      m_handleBlur: formItemHook.m_handleBlur,
    }
  },

  computed: {
    wrapperClasses(): Array<any> {
      const { prefixCls } = this
      return [
        prefixCls,
        {
          [prefixCls + '-focused']: this.isFocused,
          [prefixCls + '-selected']: (isArray(this.modelValue) && this.modelValue.length),
        },
      ]
    },
    needConfirm(): boolean {
      return (
        this.confirm ||
        ['datetime'].indexOf(this.type) > -1 ||
        this.multiple
      )
    },
    panel(): any {
      const range = isRange(this)
      const isWeek = this.type === 'week'
      if (isWeek) {
        return WeekPickerPanel
      }
      return range ? RangeDatePickerPanel : DatePickerPanel
      // return ranged ? RangeDatePickerPanel : (isWeek ? WeekPickerPanel
      //   : DatePickerPanel);
    },
  },
  watch: {
    modelValue(val) {
      this.internalValue = this.parseDate(val)
      this.cacheValue = [...this.internalValue]
    },
    internalValue: {
      immediate: true,
      handler() {
        this.inputValue = this.formatDate(this.internalValue, this.format)
      },
    },
    type(type) {
      this.onSelectionModeChange(type)
    },
    m_open(v: boolean) {
      v ? this.openDrop() : this.closeDrop()
    },
  },

  methods: {

    handleInputFocus() {
      if (this.readonly || this.m_disabled) {
        return
      }
      this.isFocused = true
      this.emitOpen()
    },
    handleInputBlur() {
      this.isFocused = false
    },
    handleInputChange(newValue: string) {
      if (!newValue) {
        // reset
        this.inputValue = this.formatDate(this.internalValue)
        return
      } else if (newValue === this.inputValue) {
        return
      }
      const defaultFormat = DEFAULT_FORMATS[this.type]

      // 判断是否使用default-time进行格式化
      const noDefaultTimeFormat = this.type === 'datetime' || this.type === 'datetimerange' || this.defaultTime

      const defaultTimeFormat = (d: Dayjs, defaultTime: string) => {
        if (!defaultTime) {
          return d
        }

        const defaultTimes = defaultTime.split(':')
        const hours = parseInt(defaultTimes[0]) || 0
        const mins = parseInt(defaultTimes[1]) || 0
        const sec = parseInt(defaultTimes[2]) || 0
        return d.hour(hours).minute(mins).second(sec).millisecond(0)
      }

      const newDays: Dayjs[] = this.parseDate(newValue, this.format || defaultFormat).map((d, index, arr) => {
        return noDefaultTimeFormat
          ? d
          : arr.length > 1 && isArray(this.defaultTime)
            ? defaultTimeFormat(d, this.defaultTime[index] as string)
            : defaultTimeFormat(d, this.defaultTime as string)
      })

      if (newDays.some((d) => !d.isValid())) {
        this.inputValue = this.formatDate(this.internalValue)
        return
      }

      this.setInternalValue(newDays)
      this.submitValue()
      // this.emitClose();
    },
    handleInputClear() {
      this.setInternalValue([])
      this.submitValue()
      this.$emit('clear')
    },
    handleClickoutside() {
      if (this.readonly || this.m_disabled || this.holdOpen) {
        return
      }
      this.handleSubmit()
      this.$emit('clickoutside')
      this.emitClose()
    },
    openDrop() {
      this.isFocused = true
      this.$emit('focus')
    },
    closeDrop() {
      this.m_handleBlur()
      this.isFocused = false
      const pickerPanel = this.$refs.pickerPanel as any
      if (pickerPanel && pickerPanel.resetData) {
        pickerPanel.resetData()
      }
    },
    handlePick(days: Dayjs | Dayjs[]) {
      this.setInternalValue(days)
      if (!this.needConfirm) {
        this.handleConfirm()
      }
    },
    handleClickNow() {
      const range = isRange(this)
      const now = (this.type === 'datetime' || this.type === 'datetimerange') ? dayjs() : clearHours(dayjs())
      this.handlePick(range ? [now, now] : now)
      /*       this.setInternalValue(range ? [now, now] : [now])
      this.submitValue()
      this.emitClose() */
    },
    handleConfirm() {
      this.$emit('confirm')
      this.handleSubmit()
      this.emitClose()
    },
    handleCancel() {
      this.$emit('cancel')
      this.setInternalValue([...this.cacheValue])
      this.emitClose()
    },
    setInternalValue(days: Dayjs | Dayjs[]) {
      // 💣 手动修改input 的值得时候会触发 好多次这个函数
      const { multiple } = this
      if (multiple) {
        if (isArray(days)) {
          this.internalValue = days
          return
        } else {
          const nextValue = this.internalValue.filter((d) => !d.isSame(days))
          if (nextValue.length === this.internalValue.length) {
            nextValue.push(days)
          }
          this.internalValue = nextValue
        }
      } else {
        this.internalValue = isArray(days) ? days : [days]
      }
      const range = isRange(this) || multiple
      const dates = this.internalValue.map((day) => day && day.toDate())
      this.$emit('input', range ? dates : dates[0])
    },
    handleSubmit() {
      const value = (this.$refs.input as HTMLInputElement).value // 实际上是 input 组件
      if (value !== this.inputValue) {
        this.handleInputChange(value)
      } else {
        this.submitValue()
      }
    },
    // 提交最终结果modelValue
    submitValue() {
      const { cacheValue } = this
      if (
        this.internalValue.length !== cacheValue.length ||
        this.internalValue.some((v, i) => v && !v.isSame(cacheValue[i]))
      ) {

        const ranged = isRange(this)
        if (ranged && this.internalValue[0] && this.internalValue[1]) {
          // 排序
          if (this.internalValue[0].isAfter(this.internalValue[1])) {
            this.internalValue.reverse()
          }
        }

        const value = this.formatToModelValue(this.internalValue)

        this.$emit('update:modelValue', value)
        this.m_handleChange(value)
      }
      this.internalValue = [...cacheValue]
    },

    /* setDefaultTime(date: Date) {
  if (this.defaultTime) {
    const defaultTimes = this.defaultTime.split(':')
    hours = parseInt(defaultTimes[0]) || 0
    mins = parseInt(defaultTimes[1]) || 0
    sec = parseInt(defaultTimes[2]) || 0
  }

  date.setHours
}, */

    handlePickRange(rangeState: any) {
      // todo: 确认是否要合并至 input 事件中
      const newRangeState = {
        from: rangeState.from ? rangeState.from.toDate() : undefined,
        to: rangeState.to ? rangeState.to.toDate() : undefined,
        selecting: rangeState.selecting,
      }
      this.$emit(
        'pick-range',newRangeState,
      )
    },
    handleFocusOtherSide() {
      (this.$refs.input as any).focus(this.focusSide === 'left' ? 'right' : 'left')
    },
    emitOpen() {
      !this.m_open && this.setOpen(true, { emit: true })
    },
    emitClose() {
      (this.$refs.input as HTMLInputElement).blur()
      this.m_open && this.setOpen(false, { emit: true })
    },
    focus() {
      (this.$refs.input as HTMLInputElement).focus()
      this.handleInputFocus()
    },
    blur() {
      (this.$refs.input as HTMLInputElement).blur()
      this.emitClose()
    },
    handleInputFocusLeft() {
      this.focusSide = 'left'
    },
    handleInputFocusRight() {
      this.focusSide = 'right'
    },
    hadnleInputEnter() {
      this.emitClose()
    },
    handleRemove(opt: Option) {
      this.handlePick(opt.value)
    },
  },
  render() {
    const {
      resetAttrs, prefixCls, inputValueOptions,
      m_open: open, placement, m_disabled, appendToContainer, getPopupContainer, popperOptions,
      wrapperClasses, inputValue, type, editable, readonly, size, placeholder, name, id,
      clearable, icon, invalid, loading, genre, popperClass, panel, panelOption, multiple,
      focusedDate, selectionMode, format, internalValue, defaultTime, showWeekNumbers, closable,
      needConfirm, showBtnNow, timePickerOptions, splitPanels, focusSide, showTag, weekStart,
    } = this

    const Component = panel
    const $renderCell = getScopedSlotsInRender(this, 'cell')

    const InputComp = (isRange(this) ? RangeInput : DatePickerInput) as any

    const slots = {
      cell: (scope: { cell: IDateCell }) => {
        return $renderCell
          ? $renderCell({
            cell: scope.cell,
          })
          : <span>
            {`${scope.cell.type === 'weekLabel' ? 'w' : ''}${scope.cell.desc}`}
          </span>
      },
      shortcuts: getSlotsInRender(this, 'shortcuts') ? () => getSlotsInRender(this, 'shortcuts') : undefined,
    }

    const renderInput = () => <InputComp
      class={[prefixCls + '-editor']}
      readonly={type === 'week' || !editable || readonly}
      clearable-on-readonly={!readonly}
      disabled={m_disabled}
      size={size}
      closable={closable}
      placeholder={placeholder}
      value={inputValue}
      options={inputValueOptions}
      internalValue={internalValue}
      name={name}
      id={id}
      clearable={clearable}
      ref="input"
      suffix-icon={icon}
      invalid={invalid}
      loading={loading}
      genre={genre}
      multiple={multiple}
      show-tag={showTag}
      onClear={this.handleInputClear}
      onRemove={this.handleRemove}
      onClick={this.handleInputFocus}
      onFocus={this.handleInputFocus}
      onBlur={this.handleInputBlur}
      onChange={this.handleInputChange}
      onFocusLeft={this.handleInputFocusLeft}
      onFocusRight={this.handleInputFocusRight}
      onEnter={this.hadnleInputEnter}
    />

    return <Popper
      visible={open}
      onClickoutside={this.handleClickoutside}
      placement={placement}
      trigger="click"
      popper-disabled={m_disabled}
      toggle-on-reference-click={false}
      append-to-container={appendToContainer}
      get-popup-container={getPopupContainer}
      popper-options={popperOptions}

      {...resetAttrs}
      wrapperTag="div"
      class={[...wrapperClasses]}
    >
      <reference>
        {renderInput()}
      </reference>
      <drop classProp={popperClass}>
        {getSlotsInRender(this, 'header')}
        <Component
          {...panelOption}
          week-start={weekStart}
          focusSide={focusSide}
          type={type}
          multiple={multiple}
          focused-date={focusedDate}
          selection-mode={selectionMode}
          format={format}
          value={internalValue}
          default-time={defaultTime}
          show-week-numbers={showWeekNumbers}
          confirm={needConfirm}
          show-btn-now={showBtnNow}
          time-picker-options={timePickerOptions}
          splitPanels={splitPanels}
          ref="pickerPanel"
          onConfirm={this.handleConfirm}
          onCancel={this.handleCancel}
          onChange={this.handlePick}
          onClick-now={this.handleClickNow}
          onPick-range={this.handlePickRange}
          onFocusOtherSide={this.handleFocusOtherSide}
          v-slots={slots}
          {...vSlots(slots)}
        >
        </Component>
        {getSlotsInRender(this, 'footer')}
      </drop>
    </Popper >
  },
})
