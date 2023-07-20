
import {
  computed, defineComponent, reactive,
  ref, toRefs, classNames, styles,
  useResetAttrs, getScopedSlotsInRender,
  getSlotsInRender, vSlots,
} from '@ss/mtd-adapter'

import DateTable from '../base/date-table'
import YearTable from '../base/year-table'
import MonthTable from '../base/month-table'
import QuarterTable from '../base/quarter-table'
import HalfyearTable from '../base/halfyear-table'


import TimePicker from '@components/time-picker'
import Confirm from '../base/confirm'
import MtdButton from '@components/button'
import datePanelLabel from './date-panel-label'
import PickerInput from '@components/time-picker/time-picker-input'
import TimePanel from '@components/time-picker/panel/time'
import { withProps, withEmits, usePanelMixin, PanelMixinProps, PanelMixinCtx } from './usePanelMixin'
import DateProps from './date-panel-props'
import locale from '@components/time-picker/locale'
import {
  DEFAULT_FORMATS,
  TYPE_VALUE_RESOLVER_MAP,
  formatDateLabels,
  siblingMonth,
} from '@utils/date'
import dayjs, { Dayjs } from 'dayjs'
import { DatePickerMode, DatePickerType, ICell } from '../types'
import { useConfig } from '@components/config-provider'

const DateTableCompMap = {
  'date-table': DateTable,
  'year-table': YearTable,
  'month-table': MonthTable,
  'quarter-table': QuarterTable,
  'halfyear-table': HalfyearTable,
} as any

export default defineComponent({
  name: 'DatePickerPanel',
  components: {
    DateTable,
    YearTable,
    MonthTable,
    TimePicker,
    QuarterTable,
    HalfyearTable,
    datePanelLabel,
    Confirm,
    PickerInput,
    TimePanel,
    MtdButton,
  },
  inheritAttrs: false,
  props: {
    ...withProps,
    ...DateProps,
    multiple: {
      type: Boolean,
      default: false,
    },
    defaultTime: {
      type: String,
    },
    range: Boolean,
    rangeSide: {
      type: String,
    },
    weekStart: {
      type: Number,
      default: 1,
      validator: (v: number) => {
        return v >= 0 && v <= 6
      },
    },
  },
  emits: [...withEmits, 'change'],
  setup(props, ctx) {
    const config = useConfig()
    const prefixCls = computed(() => config.getPrefixCls('picker-panel'))
    const datePrefixCls = computed(() => config.getPrefixCls('date-picker'))

    const timePickerAttrs = useResetAttrs(props.timePickerOptions)
    const dateTableAttrs = useResetAttrs(ctx.attrs)

    const valueIndex = computed(() => {
      return props.range && props.rangeSide === 'right' ? 1 : 0
    })

    const state = reactive({
      pickerTable: getTableType(props.selectionMode),
      // dates: value,
      panelDate: props.focusedDate || props.startDate || props.value[valueIndex.value] || dayjs(),
      // openTime: false,
      t: locale.t,
      inputValue: formatDate(props.value, props.format),
      time: undefined as (Dayjs | undefined),
    })
    const tempDate = ref<Dayjs>(props.value[valueIndex.value])

    function getTableType(view: string) {
      return `${view}-table`
    }
    function formatDate(
      val: Dayjs[] | undefined,
      format?: string,
      options?: any,
    ): string | number | undefined {
      const defaultFormat = DEFAULT_FORMATS[props.type as DatePickerType]
      const f = (format || defaultFormat).split(' ')[0]
      const defaultOption = { weekStart: props.weekStart }
      const formatter = (
        TYPE_VALUE_RESOLVER_MAP[props.type as DatePickerType] || TYPE_VALUE_RESOLVER_MAP['default']
      ).formatter
      return formatter(val, f, options || defaultOption)
    }

    // use in type datetimerange

    return {
      prefixCls,
      datePrefixCls,
      timePickerAttrs,
      dateTableAttrs,
      getTableType, formatDate, tempDate,
      valueIndex,
      ...toRefs(state),
      ...usePanelMixin(props as PanelMixinProps, ctx as PanelMixinCtx),
    }
  },
  computed: {
    classes(): any[] {
      const { prefixCls } = this
      return [
        `${prefixCls}-body-wrapper`,
        {
          [`${prefixCls}-with-sidebar`]: this.shortcuts.length,
        },
      ]
    },
    panelPickerHandlers(): Function {
      return this.pickerTable === `${this.selectionMode}-table`
        ? this.handlePick
        : this.handlePreSelection
    },
    datePanelLabel() {
      const locale = this.t('el.locale')
      const datePanelLabel = this.t('el.datepicker.datePanelLabel')
      const day = this.panelDate
      const { labels, separator } = formatDateLabels(
        locale,
        datePanelLabel,
        day,
      )

      const handler = (type: string) => {
        return (val: number) => {
          if (type === 'year') {
            this.panelDate = (this.panelDate.year(val))
          } else {
            this.panelDate = (this.panelDate.month(val))
          }
        }
      }

      return {
        separator: separator,
        labels: labels.map((obj: any) => {
          obj.handler = handler(obj.type)
          return obj
        }),
      }
    },
    timeDisabled(): boolean {
      return !this.value[this.valueIndex]
    },
    timeValue(): Dayjs | undefined {
      return this.value[this.valueIndex]
    },

  },
  watch: {
    value() {
      // this.dates = newVal;
      this.panelDate =
        this.startDate ||
        (this.multiple
          ? this.value[this.value.length - 1]
          : this.value[this.valueIndex]) ||
        dayjs()
      this.inputValue = this.formatDate(this.value, this.format)
      this.tempDate = this.value[this.valueIndex]
    },
    selectionMode(type: DatePickerMode) {
      this.pickerTable = this.getTableType(type)
    },

    // 优先级大于value
    focusedDate(date: Dayjs) {
      if (!date) {
        return
      }
      const isDifferentYear = date.year() !== this.panelDate.year()
      const isDifferentMonth = isDifferentYear || date.month() !== this.panelDate.month()
      if (isDifferentYear || isDifferentMonth) {
        this.panelDate = date
      }
    },
  },
  methods: {
    reset() {
      this.pickerTable = this.getTableType(this.selectionMode)
    },
    changeYear(dir: number) {
      if (this.selectionMode === 'year' || this.pickerTable === 'year-table') {
        this.panelDate = this.panelDate
          .add(dir * 12, 'year')
          .month(0)
          .date(1)
      } else {
        this.panelDate = siblingMonth(this.panelDate, dir * 12)
      }
    },

    changeMonth(dir: number) {
      this.panelDate = siblingMonth(this.panelDate, dir)
    },
    handlePreSelection(value: Dayjs) {
      this.panelDate = value
      if (this.pickerTable === 'year-table') this.pickerTable = 'month-table'
      else this.pickerTable = this.getTableType(this.selectionMode)
    },
    handlePick(value: Dayjs) {
      const { defaultTime } = this
      let hours = 0
      let mins = 0
      let sec = 0

      if (this.tempDate) {
        const v = this.tempDate
        this.tempDate = v
          .year(value.year())
          .month(value.month())
          .date(value.date())
      } else {
        this.tempDate = value
      }

      if (this.type === 'datetimerange') {
        this.$emit('change', this.tempDate)
        return
      } if (this.type === 'datetime') {
        const current = this.value[this.valueIndex]
        const defaultTimes = (defaultTime || '0:0:0').split(':')
        hours = current ? current.hour() : parseInt(defaultTimes[0])
        mins = current ? current.minute() : parseInt(defaultTimes[1])
        sec = current ? current.second() : parseInt(defaultTimes[2])
      } else if (defaultTime) {
        const defaultTimes = defaultTime.split(':')
        hours = parseInt(defaultTimes[0]) || 0
        mins = parseInt(defaultTimes[1]) || 0
        sec = parseInt(defaultTimes[2]) || 0
      }
      value = value.hour(hours).minute(mins).second(sec).millisecond(0)

      // this.dates = [value];
      this.$emit('change', value)
    },

    hanldeTimeChange(time: Dayjs) {

      if (this.tempDate) {
        const v = this.tempDate
        this.tempDate = v
          .hour(time.hour())
          .minute(time.minute())
          .second(time.second())
      } else {
        this.tempDate = time
      }

      if (this.type === 'datetimerange') {
        this.$emit('change', this.tempDate)
        return
      }

      const value = this.value[this.valueIndex]
      if (!value) {
        return
      }
      const v = time
        .year(value.year())
        .month(value.month())
        .date(value.date())

      this.$emit('change', v)
    },

    handleChangeRange(val: Dayjs) {
      this.$emit('range', val)
    },

    handleConfirmInDate() {
      this.$emit('confirm', this.tempDate)
      this.resetView()
    },

    handleClose() {
      this.$emit('cancel')
    },

  },
  render() {
    const {
      classes, shortcuts, showTime, timePickerAttrs,
      pickerTable, selectionMode, datePanelLabel, panelDate, showWeekNumbers, value, tempDate,
      disabledDate, confirm, showBtnNow, dateTableAttrs, range, type, prefixCls, datePrefixCls,
      weekStart, rangeSide,
    } = this
    const Component = DateTableCompMap[pickerTable] || DateTable
    const $renderCell = getScopedSlotsInRender(this, 'cell')

    const slots = {
      cell: (scope: { cell: ICell }) => {
        return $renderCell && $renderCell({
          cell: scope.cell,
        })
      },
    }

    const confirmSlots = {
      default: getSlotsInRender(this, 'footer') ? () => getSlotsInRender(this, 'footer') : undefined,
    }

    return <div
      class={classNames(this, classes)}
      style={styles(this)}
      onMousedown={(e: Event) => e.preventDefault()}>
      {(shortcuts.length || getSlotsInRender(this, 'shortcuts')) && <div
        class={[prefixCls + '-sidebar']}
      >
        {getSlotsInRender(this, 'shortcuts') || shortcuts.map((shortcut) => <div
          class={[prefixCls + '-shortcut']}
          key={shortcut.text}
          onClick={() => this.handleShortcutClick(shortcut)}
        >
          {shortcut.text}
        </div>)}
      </div>}

      <div class={[prefixCls + '-body']}>

        <div class={[datePrefixCls + '-header']}>
          <div>
            {(pickerTable === 'year-table' || pickerTable === 'month-table') && <mtd-button
              onClick={() => this.changeYear(-1)}
              type="text"
              icon={pickerTable === 'month-table' ? 'left' : 'fast-backward'}
              size="small"
              style={{ padding: '0px' }}
            />}
            {pickerTable === 'date-table' && <mtd-button
              v-show={selectionMode === 'date'}
              onClick={() => this.changeMonth(-1)}
              type="text"
              icon="left"
              size="small"
              style={{ padding: '0px' }}
            />}
          </div>

          <date-panel-label
            date-panel-label={datePanelLabel}
            current-view={pickerTable.split('-').shift()}
            date-prefix-cls={datePrefixCls}
            type={type}
          />

          <div>
            {pickerTable === 'date-table' && <mtd-button
              v-show={selectionMode === 'date'}
              onClick={() => this.changeMonth(+1)}
              type="text"
              icon="right"
              size="small"
              style={{ padding: '0px' }}
            />}
            {(pickerTable === 'year-table' || pickerTable === 'month-table') && <mtd-button
              onClick={() => this.changeYear(+1)}
              type="text"
              icon={pickerTable === 'month-table' ? 'right' : 'fast-forward'}
              size="small"
              style={{ padding: '0px' }}
            />}
          </div>
        </div>

        <div class={[prefixCls + '-content']}>
          <Component
            {...dateTableAttrs}
            week-start={weekStart}
            type={type}
            range={range}
            rangeSide={rangeSide}
            ref="pickerTableRef"
            table-date={panelDate}
            show-week-numbers={showWeekNumbers}
            value={value}
            selection-mode={range ? 'range' : selectionMode}
            disabled-date={disabledDate}
            onChange={this.panelPickerHandlers}
            onRange={this.handleChangeRange}
            v-slots={slots}
            {...vSlots(slots)}
          />
          {showTime && <div class={[prefixCls + '-time']}>
            <time-panel
              {...timePickerAttrs}
              value={tempDate}
              onChange={this.hanldeTimeChange}
              append-to-container={false}
            />
          </div>}
        </div>

        {(confirm || type === 'datetimerange') &&
          <Confirm
            show-btn-now={showBtnNow}
            onClick-now={this.handlePickClickNow}
            onConfirm={this.handleConfirmInDate}
            onClose={this.handleClose}
            v-slots={confirmSlots}
            {...vSlots(confirmSlots)}
          />
        }
      </div>
    </div >
  },
})
