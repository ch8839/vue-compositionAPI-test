
import {
  computed, defineComponent, reactive,
  ref, toRefs, classNames, styles,
  useResetAttrs, getScopedSlotsInRender, getSlotsInRender, vSlots,
} from '@ss/mtd-adapter'

import WeekTable from '../base/week-table'

import Confirm from '../base/confirm'
import datePanelLabel from './date-panel-label'

import { withProps, withEmits, usePanelMixin, PanelMixinProps, PanelMixinCtx } from './usePanelMixin'
import DateProps from './date-panel-props'
import {
  formatDateLabels,
  siblingMonth,
  getFirstDayOfWeek,
  getLastDayOfWeek,
} from '@utils/date'
import locale from '@components/time-picker/locale'
import dayjs, { Dayjs } from 'dayjs'
import { DatePickerMode, ICell } from '../types'
import { useConfig } from '@components/config-provider'
import MtdIcon from '@components/icon'

export default defineComponent({
  name: 'DatePickerWeekPanel',
  components: {
    WeekTable,
    datePanelLabel,
    Confirm, MtdIcon,
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

    const valueIndex = computed(() => {
      return props.range && props.rangeSide === 'right' ? 1 : 0
    })

    const dateTableAttrs = useResetAttrs(ctx.attrs)

    const state = reactive({
      pickerTable: getTableType(props.selectionMode),
      panelDate: props.focusedDate || props.startDate || props.value[valueIndex.value] || dayjs(),
      t: locale.t,
      weekRangeState: toRangeState(props.value && props.value[valueIndex.value]) as {
        from?: Dayjs;
        to?: Dayjs;
      },
    })
    const dates = ref<Dayjs[]>(getDatesFromDate(props.value && props.value[valueIndex.value]))
    function getTableType(view: string) {
      return `${view}-table`
    }
    function toRangeState(day?: Dayjs) {
      if (day) {
        const from = day.weekday(0)
        return {
          from: from,
          to: from.add(6, 'd'),
        }
      }
      return {}
    }
    function getDatesFromDate(val: Dayjs) {
      if (!val) {
        return []
      }
      const dates: Dayjs[] = []
      for (let n = 1; n < 8; n++) {
        dates.push(val.day(n))
      }
      return dates
    }
    return {
      prefixCls, datePrefixCls,
      timePickerAttrs, dates, valueIndex,
      getTableType, toRangeState, getDatesFromDate,
      ...toRefs(state), dateTableAttrs,
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
        return () => {
          this.pickerTable = this.getTableType(type); // eslint-disable-line
          return this.pickerTable
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
  },
  watch: {
    value(newVal) {
      this.panelDate = this.startDate || this.value[this.valueIndex] || dayjs()
      const day = newVal[0]
      this.weekRangeState = this.toRangeState(day)
    },
    selectionMode(type: DatePickerMode) {
      this.pickerTable = this.getTableType(type)
    },
    // 优先级大于value
    focusedDate(date: Dayjs) {
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
          .add(dir * 10, 'year')
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
      if (this.type === 'datetime') {
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
      this.dates = this.getDatesFromDate(value)
      this.$emit('change', value)
    },
    handleChangeRange(day: Dayjs) {
      this.handleWeekChangeRange(day)
      this.$emit('range', day)
    },
    handleWeekChangeRange(day: Dayjs, isLeave?: boolean) {
      // isLeave 表示离开cell
      if (isLeave) {
        this.weekRangeState = {}
      } else if (day) {
        const [from, to] = [getFirstDayOfWeek(day, this.weekStart), getLastDayOfWeek(day, this.weekStart)]
        this.weekRangeState = {
          from,
          to,
        }
      }
    },
    handleClose() {
      this.$emit('cancel')
    },
  },
  render() {
    const {
      classes, shortcuts, pickerTable, selectionMode, datePanelLabel, panelDate, value,
      disabledDate, weekRangeState, confirm, showBtnNow, dateTableAttrs, range, type,
      prefixCls, datePrefixCls, weekStart,
    } = this

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
          {pickerTable === 'date-table' && <span
            class={this.iconBtnCls('prev')}
            onClick={() => this.changeMonth(-1)}
            v-show={selectionMode === 'date'}
          >
            <mtd-icon name={'left'} />
          </span>}
          <date-panel-label
            date-panel-label={datePanelLabel}
            current-view={pickerTable.split('-').shift()}
            date-prefix-cls={datePrefixCls}
            type={type}
          />
          {pickerTable === 'date-table' && <span
            class={this.iconBtnCls('next')}
            onClick={() => this.changeMonth(+1)}
            v-show={selectionMode === 'date'}
          >
            <mtd-icon name={'right'} />
          </span>}
        </div>

        <div class={[prefixCls + '-content']}>
          <week-table
            {...dateTableAttrs}
            week-start={weekStart}
            ref="pickerTableRef"
            value={value}
            range={range}
            type="week"
            table-date={panelDate}
            week-range-state={weekRangeState}
            show-week-numbers={true}
            selection-mode={range ? 'range' : selectionMode}
            disabled-date={disabledDate}
            onChange={this.panelPickerHandlers}
            onRange={this.handleChangeRange}
            onWeek-range={this.handleWeekChangeRange}
            v-slots={slots}
            {...vSlots(slots)}
          />
        </div>

        {confirm &&
          <Confirm
            show-btn-now={showBtnNow}
            onClick-now={this.handlePickClickNow}
            onConfirm={this.handleConfirm}
            onClose={this.handleClose}
            v-slots={confirmSlots}
            {...vSlots(confirmSlots)}
          >
          </Confirm>
        }

      </div>
    </div >
  },
})
