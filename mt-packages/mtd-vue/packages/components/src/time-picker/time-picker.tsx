import { computed, defineComponent, markRaw, PropType, ref } from '@ss/mtd-adapter'
import { Popper, Drop, Reference } from '@components/popper'
import {
  DEFAULT_FORMATS,
  TYPE_VALUE_RESOLVER_MAP,
} from '@utils/date'
import { isArray } from '@utils/type'
import { Dayjs } from 'dayjs'
import mitt from '@utils/mitt'
import RangeTimePickerPanel from './panel/time-range'
import TimePickerPanel from './panel/time'
import { useAllAttrs, useClassStyle } from '@components/hooks/pass-through'
import { TimePickerType } from './types'
import useControlled from '@hooks/controlled'

import TimePickerInput from './time-picker-input'
import RangeInput from './range-input'
import { useConfig } from '@components/config-provider'

function getDefaultPopupContainer() {
  return document.body
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
function isRange(t: any) {
  return t.type.indexOf('range') > -1
}

export default defineComponent({
  name: 'MtdTimePicker',
  components: {
    Popper,
    Drop,
    Reference,
    TimePickerInput,
    RangeInput,
  },
  inheritAttrs: false,
  model: {
    prop: 'modelValue',
    event: 'update:modelValue',
  },
  props: {
    format: String,
    valueFormat: String,
    readonly: Boolean,
    editable: {
      type: Boolean,
      default: true,
    },
    disabled: Boolean,
    clearable: {
      type: Boolean,
      default: true,
    },
    open: Boolean,
    size: String,
    placeholder: {
      type: [String, Array],
    },
    placement: String,
    steps: {
      type: Array,
      default: () => [],
    },
    modelValue: [Date, String, Array, Number],
    options: {
      type: Object,
      default: () => ({}),
    },
    icon: {
      type: String,
      default: 'time-o',
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
    popperClass: String,
    popperOptions: Object,
    type: {
      type: String as PropType<TimePickerType>,
      validator: (value: string) => {
        return ['time', 'timerange'].indexOf(value) > -1
      },
      default: 'time',
    },
    name: String,
    id: String,
    disabledHours: {
      type: Array,
      default: () => {
        return []
      },
    },
    disabledMinutes: {
      type: Array,
      default: () => {
        return []
      },
    },
    disabledSeconds: {
      type: Array,
      default: () => {
        return []
      },
    },
    hideDisabledOptions: {
      type: Boolean,
      default: false,
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
    'update:value',
    'input',
    'change',
    'focus',
    'blur',
    'cancel',
    'confirm',
    'clickoutside',
  ],
  setup(props, ctx) {
    const config = useConfig()
    const prefixCls = computed(() => config.getPrefixCls('date-picker'))
    const initInternalValue = parseDate(props.modelValue)
    const allAttrs = useAllAttrs(ctx)

    /* Data */
    const internalValue = ref<Dayjs[]>(initInternalValue)
    const cacheValue = ref<Dayjs[]>([...initInternalValue])
    const inputValue = ref<string | number | undefined>('')
    const isFocused = ref(false)
    const emitter = markRaw(mitt())

    const classStyle = useClassStyle()

    /* Computed */
    const [open, setOpen] = useControlled<boolean>('open', props, ctx)

    /* Methods */
    function setInputValue(val: string | number | undefined) {
      inputValue.value = val
    }
    function parseDate(val: any | any[], format?: string): Dayjs[] {
      const { type, valueFormat } = props
      const range = isRange(props)
      const parser = (
        TYPE_VALUE_RESOLVER_MAP[type as TimePickerType] ||
        TYPE_VALUE_RESOLVER_MAP['default']
      ).parser
      const dates = parser(val, format || valueFormat)

      if (range) {
        return fill<Dayjs>(dates as Dayjs[], 2, null)
      }
      return dates ? ([dates] as Dayjs[]) : []
    }
    return {
      internalValue, cacheValue, inputValue, isFocused, emitter, prefixCls,
      parseDate, allAttrs, _open: open, setOpen, setInputValue, classStyle,
    }
  },
  computed: {
    panel(): any {
      // return TimePickerPanel;
      return isRange(this) ? RangeTimePickerPanel : TimePickerPanel
    },
    wrapperClasses(): any[] {
      const { prefixCls } = this
      return [
        prefixCls,
        {
          [prefixCls + '-focused']: this.isFocused,
        },
      ]
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
    _open(v: boolean) {
      v ? this.openDrop() : this.closeDrop()
    },
  },
  methods: {
    formatDate(
      val: Dayjs | Dayjs[] | undefined,
      format?: string,
      options?: any,
    ): string | number | undefined {
      const defaultFormat = DEFAULT_FORMATS[this.type as TimePickerType]
      const defaultOption = { weekStart: this.weekStart }
      const formatter = (
        TYPE_VALUE_RESOLVER_MAP[this.type as TimePickerType] ||
        TYPE_VALUE_RESOLVER_MAP['default']
      ).formatter
      return formatter(val, format || defaultFormat, options || defaultOption)
    },
    formatToModelValue(date: Dayjs | Dayjs[] | undefined) {
      const isRange = (this.type.indexOf('range') > -1)
      if ((this.multiple || isRange) && isArray(date)) {
        return (date || []).map((d) => this.formatSingleValue(d))
          .filter((d) => this.valueFormat ? !!d : d !== undefined)
      } else {
        // 此处是单选
        if (isArray(date)) {
          return this.formatSingleValue(date[0])
        }
        return this.formatSingleValue(date as Dayjs)
      }

    },
    formatSingleValue(date: Dayjs | undefined) {
      if (this.valueFormat === 'timestamp') {
        return date ? date.unix() : undefined
      } else if (this.valueFormat || this.shouldFormatValue) {
        return this.formatDate(date, this.valueFormat || this.format)
      } else {
        return date?.toDate() || undefined
      }
    },

    handleInputFocus() {
      if (this.readonly || this.disabled) {
        return
      }
      this.emitOpen()
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
      const newDays = this.parseDate(newValue, this.format || defaultFormat)
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
    },
    handleClickoutside() {
      if (this.readonly || this.disabled) {
        return
      }
      this.handleSubmit()
      this.$emit('clickoutside')
      this.emitClose()
    },
    openDrop() {
      this.$emit('focus')
    },
    closeDrop() {
      this.$emit('blur')
    },
    handlePick(days: Dayjs | Dayjs[]) {
      this.setInternalValue(days)
    },
    handleConfirm() {
      this.handleSubmit()
      this.emitClose()
    },
    handleCanel() {
      this.$emit('cancel')
      this.setInternalValue([...this.cacheValue])
      this.emitClose()
    },
    setInternalValue(days: Dayjs | Dayjs[]) {
      this.internalValue = isArray(days) ? days : [days]
      const range = isRange(this)
      const dates = this.internalValue.map((day) => day.toDate())
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
        this.$emit('change', value)
      }
      this.internalValue = [...cacheValue]
    },

    emitOpen() {
      !this._open && this.setOpen(true)
    },
    emitClose() {
      this._open && this.setOpen(false)
    },

    focus() {
      (this.$refs.input as HTMLInputElement).focus()
      this.handleInputFocus()
    },
    blur() {
      (this.$refs.input as HTMLInputElement).blur()
      this.emitClose()
    },
  },
  render() {
    const {
      _open, placement, disabled, appendToContainer, getPopupContainer, popperOptions, wrapperClasses,
      editable, readonly, size, placeholder, inputValue, name, id, clearable, icon, invalid, loading, genre,
      popperClass, panel, steps, internalValue, format, disabledHours, disabledMinutes, disabledSeconds,
      hideDisabledOptions, allAttrs, type, prefixCls, classStyle,
    } = this
    const Component = panel
    const InputComp = type === 'timerange' ? 'range-input' : 'time-picker-input'
    const pickerPanelValue = isRange(this) ? internalValue : internalValue[0]
    return <popper
      visible={_open}
      onClickoutside={this.handleClickoutside}
      placement={placement}
      trigger="click"
      popper-disabled={disabled}
      toggle-on-reference-click={false}
      append-to-container={appendToContainer}
      get-popup-container={getPopupContainer}
      popper-options={popperOptions}
    >
      <reference>
        <div class={[wrapperClasses, classStyle.class]} {...allAttrs} style={classStyle.style}>
          <InputComp
            class={[prefixCls + '-editor']}
            readonly={!editable || readonly}
            clearable-on-readonly={!readonly}
            disabled={disabled}
            size={size}
            placeholder={placeholder}
            value={inputValue}
            //onInput={this.setInputValue}
            name={name}
            id={id}
            clearable={clearable}
            ref="input"
            suffix-icon={icon}
            invalid={invalid}
            loading={loading}
            genre={genre}
            onClear={this.handleInputClear}
            onClick={this.handleInputFocus}
            onFocus={this.handleInputFocus}
            onChange={this.handleInputChange}
          />
        </div>
      </reference>
      <drop classProp={popperClass}>
        <Component
          ref="pickerPanel"
          steps={steps}
          value={pickerPanelValue}
          visible={_open}
          format={format}
          disabledHours={disabledHours}
          disabledMinutes={disabledMinutes}
          disabledSeconds={disabledSeconds}
          hideDisabledOptions={hideDisabledOptions}
          onConfirm={this.handleConfirm}
          onCanel={this.handleCanel}
          onChange={this.handlePick}
        >
        </Component>
      </drop>
    </popper>
  },
})
