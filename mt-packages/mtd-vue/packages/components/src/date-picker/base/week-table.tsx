
import { computed, defineComponent, PropType } from '@ss/mtd-adapter'
import jsCalendar from 'js-calendar'

import usePrefixCls from './usePrefixCls'
import locale from '@components/time-picker/locale'
import { IDateCell } from '../types'
import dayjs, { Dayjs } from 'dayjs'
import { clearHours, getFirstDayOfWeek, getLastDayOfWeek, isInRange } from '@utils/date'
import { isFunction } from '@utils/type'
import { withProps, withName, withEmits, useDateMixin, DatePickerTableProps } from './useDateMixin'
import { useConfig } from '@components/config-provider'


export default defineComponent({
  name: withName,
  props: {
    ...withProps,
    showWeekNumbers: {
      type: Boolean,
      default: false,
    },
    tableDate: {
      type: Object as PropType<Dayjs>,
      required: true,
    },
    // focusedDate: {
    //   type: Object as PropType<Dayjs>,
    //   required: true,
    // },
    disabledDate: {
      type: Function,
    },
    range: Boolean,
    weekRangeState: {
      type: Object as PropType<{
        from?: Dayjs,
        to?: Dayjs,
      }>,
      default: () => { },
    },
    weekStart: {
      type: Number,
      default: 1,
      validator: (v: number) => {
        return v >= 0 && v <= 6
      },
    },
  },
  emits: [...withEmits, 'week-range'],
  setup(props, ctx) {
    const config = useConfig()
    const prefixMTD = computed(() => config.getPrefix())

    const t = locale.t
    const dateMixinHook = useDateMixin(props as DatePickerTableProps, ctx)
    const prefixClsHook = usePrefixCls()
    const datesMap = new Map()
    return {
      t, ...dateMixinHook, datesMap,
      ...prefixClsHook, prefixMTD,
    }
  },
  computed: {
    calendar(): any {
      //const weekStartDay = Number(this.t('el.datepicker.weekStartDay'))
      return new jsCalendar.Generator({
        onlyDays: !this.showWeekNumbers,
        weekStart: this.weekStart,
      })
    },
    headerDays(): string[] {
      //const weekStartDay = Number(this.t('el.datepicker.weekStartDay'))
      const translatedDays = [
        'sun',
        'mon',
        'tue',
        'wed',
        'thu',
        'fri',
        'sat',
      ].map((item) => {
        return this.t('el.datepicker.weeks.' + item)
      })
      const weekDays = translatedDays
        .splice(this.weekStart, 7 - this.weekStart)
        .concat(translatedDays.splice(0, this.weekStart))
      return this.showWeekNumbers ? [''].concat(weekDays) : weekDays
    },
    cells(): IDateCell[] {

      const tableYear = this.tableDate.year()
      const tableMonth = this.tableDate.month()

      // timestamp of today
      const today = clearHours(dayjs()).toDate().getTime()
      // timestamp of selected days
      const selectedDays: Dayjs[] = this.dates
      this.datesMap.clear()
      selectedDays.forEach(selectedDate => {
        this.datesMap.set(selectedDate, [])
      })
      /* const selectedDays: Number[] = (this.dates as Dayjs[])
        .filter(Boolean)
        .map((d: Dayjs) => clearHours(d).toDate().getTime()) */
      const { from: rangeStateFrom, to: rangeStateTo } = this.rangeState

      let from: Dayjs | undefined
      let to: Dayjs | undefined

      if (rangeStateTo && rangeStateFrom?.isBefore(rangeStateTo)) {
        from = rangeStateFrom && getFirstDayOfWeek(rangeStateFrom, this.weekStart)
        to = rangeStateTo && getLastDayOfWeek(rangeStateTo, this.weekStart)
      } else {
        from = rangeStateFrom && getLastDayOfWeek(rangeStateFrom, this.weekStart)
        to = rangeStateTo && getFirstDayOfWeek(rangeStateTo, this.weekStart)
      }


      const { range: isRange } = this
      const disabledTestFn = isFunction(this.disabledDate) && this.disabledDate

      return this.calendar(tableYear, tableMonth, (cell: IDateCell) => {
        cell.date = cell.date ? clearHours(dayjs(cell.date)) : cell.date

        const time = cell.date && cell.date.toDate().getTime()
        const selected = selectedDays.some(selectedDate => {
          const result = cell.date && selectedDate && cell.date.isSame(selectedDate, 'week')
          if (result) {
            const arr = this.datesMap.get(selectedDate)
            if (arr.length === 0) {
              cell.isValueHead = true
            } else if (arr.length === 6) {
              cell.isValueTail = true
            }
            arr.push(cell)
          }
          return result
        })

        /* if (selected && this.value) {
          cell.isValueHead = cell.date?.isSame(this.value[0], 'week')
          cell.isValueTail = cell.date?.isSame(this.value[this.value.length - 1], 'week')
        } */

        if (from && to && selected && !from.isSame(to, 'week')) {
          if (cell.date!.isSame(from, 'week')) {
            if (from.isBefore(to)) {
              cell.isRangeHead = true
            } else {
              cell.isRangeTail = true
            }
          } else if (cell.date!.isSame(to, 'week')) {
            if (from.isBefore(to)) {
              cell.isRangeTail = true
            } else {
              cell.isRangeHead = true
            }
          }
        }

        // 样式优先级 selected > hover > range
        const range = (!selected && cell.date) &&
          (isRange && isInRange(cell.date!, from, to)
            || isInRange(cell.date!, this.weekRangeState.from, this.weekRangeState.to))


        return {
          ...cell,
          type: time === today ? 'today' : cell.type,
          today: time === today,
          selected,
          disabled:
            cell.date && disabledTestFn && (disabledTestFn as Function)(cell.date.toDate()),
          range,
        }
      }).cells.slice(this.showWeekNumbers ? 8 : 0)
    },
  },
  methods: {
    getCellCls(cell: IDateCell) {
      const { prefixClsCells } = this
      return [
        {
          [`${prefixClsCells}-cell-selected`]: cell.selected,
          [`${prefixClsCells}-cell-disabled`]: cell.disabled,
          [`${prefixClsCells}-cell-today`]: cell.today,
          [`${prefixClsCells}-cell-prev-month`]: cell.type === 'prevMonth',
          [`${prefixClsCells}-cell-next-month`]: cell.type === 'nextMonth',
          [`${prefixClsCells}-cell-week-label`]: cell.type === 'weekLabel',
          [`${prefixClsCells}-cell-range`]: cell.range,
          [`${prefixClsCells}-cell-value-head`]: cell.isValueHead,
          [`${prefixClsCells}-cell-value-tail`]: cell.isValueTail,
          [`${prefixClsCells}-cell-range-head`]: cell.isRangeHead,
          [`${prefixClsCells}-cell-range-tail`]: cell.isRangeTail,
          // [`${prefixClsCells}-focused`]: cell.date && clearHours(cell.date) ===
          // clearHours(this.focusedDate),
        },
      ]
    },

    handleMouseMoveInWeekTable(cell: IDateCell, isLeave?: boolean) {
      this.$emit('week-range', cell.date, isLeave)
      this.handleMouseMove(cell)
    },
  },
  render() {
    const {
      showWeekNumbers, headerDays, cells, prefixClsCells, prefixMTD,
    } = this
    const $renderCell = this.$scopedSlots.cell
    return <div
      class={{
        [`${prefixMTD}-date-picker-cells`]: true,
        [`${prefixMTD}-date-picker-cells-show-week-numbers`]: showWeekNumbers,
        [`${prefixMTD}-date-picker-week-cells`]: true,
      }}
    >
      <div class={[prefixClsCells + '-header']}>
        {headerDays.map(day => <span key={day}>
          <em>{day}</em>
        </span>)}
      </div >
      {cells.map((cell, i) => <span
        class={[`${prefixMTD}-date-picker-cells-cell`, this.getCellCls(cell)]}
        key={String(cell.date) + i}
        onClick={() => this.handleClick(cell)}
        onMouseenter={() => this.handleMouseMoveInWeekTable(cell)}
        onMouseleave={() => this.handleMouseMoveInWeekTable(cell, true)}
      >
        <em>
          {$renderCell
            ? $renderCell({ cell: cell })
            : <span>{`${cell.type === 'weekLabel' ? 'w' : ''}${cell.desc}`}</span>}
        </em>
      </span >)}
    </div >
  },
})
