import { defineComponent } from '@ss/mtd-adapter'
import { clearHours, isInRange } from '@utils/date'
import { withProps, withName, withEmits, useDateMixin, DatePickerTableProps } from './useDateMixin'
import usePrefixCls from './usePrefixCls'
import { IHalfYearCell } from '../types'
import dayjs, { Dayjs } from 'dayjs'
import { isFunction } from '@utils/type'

import quarterOfYear from 'dayjs/plugin/quarterOfYear'
dayjs.extend(quarterOfYear)

export default defineComponent({
  name: withName,
  props: withProps,
  emits: withEmits,
  setup(props, ctx) {
    const dateMixinHook = useDateMixin(props as DatePickerTableProps, ctx)
    const prefixClsHook = usePrefixCls()
    return {
      ...dateMixinHook,
      ...prefixClsHook,
    }
  },
  computed: {
    classes(): any[] {
      const { prefixClsCells } = this
      return [`${prefixClsCells}`, `${prefixClsCells}-halfyear`]
    },
    cells(): IHalfYearCell[] {
      const cells: IHalfYearCell[] = []
      const tableYear = this.tableDate!.year()
      const selectedDays: Dayjs[] = this.dates
      /* const selectedDays: number[] = this.dates
        .filter(Boolean)
        .map((d: Dayjs) => clearHours(d).date(1).toDate().getTime()) */

      // const focusedDate = clearHours(
      //   new Date(
      //     this.focusedDate.getFullYear(),
      //     this.focusedDate.getMonth(),
      //     1,
      //   ),
      // );
      const isRange =
        this.selectionMode === 'range' && this.type === 'halfyearrange'

      const { from, to } = this.rangeState
      for (let i = 0; i < 2; i++) {
        const cell: IHalfYearCell = {
          desc: `H${i + 1}`,
          date: clearHours(dayjs(new Date(tableYear, i * 6, 1))),
          selected: false,
          disabled: false,
          range: false,
        }
        cell.today = this.isSameHalfYear(cell.date, dayjs())

        cell.disabled =
          (this.selectionMode === 'halfyear' || this.type === 'halfyearrange') &&
          isFunction(this.disabledDate) &&
          (this.disabledDate as any)(cell.date.toDate())

        cell.selected = selectedDays.some(selectedDate => {
          return selectedDate && this.isSameHalfYear(cell.date, selectedDate)
        })

        if (from && to && cell.selected && !this.isSameHalfYear(from, to)) {
          if (cell.date.isSame(from)) {
            if (from.isBefore(to)) {
              cell.isRangeHead = true
            } else {
              cell.isRangeTail = true
            }
          } else if (cell.date.isSame(to)) {
            if (from.isBefore(to)) {
              cell.isRangeTail = true
            } else {
              cell.isRangeHead = true
            }
          }
        }

        if (isRange && !cell.selected) {
          cell.range = isInRange(cell.date, from, to)
        }
        cells.push(cell)
      }

      return cells
    },
  },
  methods: {
    getCellCls(cell: IHalfYearCell) {
      const { prefixClsCells } = this
      return [
        `${prefixClsCells}-cell`,
        {
          [`${prefixClsCells}-cell-selected`]: cell.selected,
          [`${prefixClsCells}-cell-disabled`]: cell.disabled,
          // [`${prefixClsCells}-cell-focused`]: cell.focused,
          [`${prefixClsCells}-cell-range`]: cell.range,
          [`${prefixClsCells}-cell-range-head`]: cell.isRangeHead,
          [`${prefixClsCells}-cell-range-tail`]: cell.isRangeTail,
          [`${prefixClsCells}-cell-today`]: cell.today,
        },
      ]
    },
    isSameHalfYear(date1: Dayjs, date2: Dayjs) {
      const isSameHalf = (date1.month() < 5) === (date2.month() < 5)
      return date1.isSame(date2, 'year') && isSameHalf
    },
  },
  render() {
    const { classes, cells } = this
    return <div class={classes}>
      {cells.map((cell, i) => <span
        class={this.getCellCls(cell)}
        key={i}
        onClick={() => this.handleClick(cell)}
        onMouseenter={() => this.handleMouseMove(cell)}
      ><em><span>{cell.desc}</span></em>
      </span>)}
    </div>
  },
})
