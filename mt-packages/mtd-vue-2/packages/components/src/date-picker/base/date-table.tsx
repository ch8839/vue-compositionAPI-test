
import { computed, defineComponent, PropType, getScopedSlotsInRender } from '@ss/mtd-adapter'
import jsCalendar from 'js-calendar'

import usePrefixCls from './usePrefixCls'

import locale from '@components/time-picker/locale'
import { IDateCell } from '../types'
import dayjs, { Dayjs } from 'dayjs'
import { clearHours, isInRange } from '@utils/date'
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
    rangeSide: String,
    weekStart: {
      type: Number,
      default: 1,
      validator: (v: number) => {
        return v >= 0 && v <= 6
      },
    },
  },
  emits: withEmits,
  setup(props, ctx) {
    const config = useConfig()
    const prefixMTD = computed(() => config.getPrefix())

    const t = locale.t
    const dateMixinHook = useDateMixin(props as DatePickerTableProps, ctx)
    const prefixClsHook = usePrefixCls()
    const isRange = computed(() => props.range)
    return {
      t, ...dateMixinHook, isRange, ...prefixClsHook, prefixMTD,
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
      /*         .filter(Boolean)
      .map((d: Dayjs) => clearHours(d).toDate().getTime()) */
      const { from, to } = (this.rangeState as any)
      const { isRange, isWeek } = this

      return this.calendar(tableYear, tableMonth, (cell: IDateCell) => {
        cell.date = cell.date ? clearHours(dayjs(cell.date)) : cell.date

        const time = cell.date && cell.date.toDate().getTime()
        const dateIsInCurrentMonth =
          cell.date && (isWeek || tableMonth === cell.date.month())
        const selected =
          !!dateIsInCurrentMonth && selectedDays.some(selectedDate => {
            return selectedDate && cell.date && cell.date.isSame(selectedDate, 'day')
          })

        if (selected && isWeek && this.value) {
          cell.isValueHead = cell.date?.isSame(this.value[0], 'day')
          cell.isValueTail = cell.date?.isSame(this.value[this.value.length - 1], 'day')
        }

        if (isRange && from && to && selected && !from.isSame(to, 'day')) {
          if (cell.date!.isSame(from, 'day')) {
            if (from.isBefore(to)) {
              cell.isRangeHead = true
            } else {
              cell.isRangeTail = true
            }
          } else if (cell.date!.isSame(to, 'day')) {
            if (from.isBefore(to)) {
              cell.isRangeTail = true
            } else {
              cell.isRangeHead = true
            }
          }
        }

        const range =
          !selected &&
          isRange &&
          dateIsInCurrentMonth &&
          (isInRange(cell.date!, from, to))

        return {
          ...cell,
          type: time === today ? 'today' : cell.type,
          today: time === today,
          selected,
          disabled: this.judgeCellDisabled(cell),
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
    judgeCellDisabled(cell: IDateCell) {
      if (this.rangeState.from && this.rangeState.to && this.type === 'datetimerange' && this.rangeSide && cell.date) {
        if (this.rangeSide === 'left' && this.value?.[1]) {
          return cell.date.isAfter(this.rangeState.to, 'day')
        } else if (this.rangeSide === 'right' && this.value?.[0]) {
          return cell.date.isBefore(this.rangeState.from, 'day')
        }
      }
      const disabledTestFn = isFunction(this.disabledDate) ? this.disabledDate as Function : undefined
      return cell.date && disabledTestFn && (disabledTestFn)(cell.date.toDate())
    },
  },
  render() {
    const {
      showWeekNumbers, isWeek, headerDays, cells, prefixClsCells, prefixMTD,
    } = this
    const $renderCell = getScopedSlotsInRender(this, 'cell')
    return <div
      class={{
        [`${prefixMTD}-date-picker-cells`]: true,
        [`${prefixMTD}-date-picker-cells-show-week-numbers`]: showWeekNumbers,
        [`${prefixMTD}-date-picker-week-cells`]: isWeek,
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
        onMouseenter={() => this.handleMouseMove(cell)}
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
