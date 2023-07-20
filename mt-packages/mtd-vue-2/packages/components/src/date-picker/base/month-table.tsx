
import { defineComponent } from '@ss/mtd-adapter'
import { clearHours, isInRange } from '@utils/date'
import { isFunction } from '@utils/type'
import Locale from '@components/time-picker/locale'
import usePrefixCls from './usePrefixCls'
import dayjs, { Dayjs } from 'dayjs'
import { IMonthCell } from '../types'
import { withProps, withName, withEmits, useDateMixin, DatePickerTableProps } from './useDateMixin'

export default defineComponent({
  name: withName,
  props: withProps,
  emits: withEmits,
  setup(props, ctx) {
    const t = Locale.t
    const dateMixinHook = useDateMixin(props as DatePickerTableProps, ctx)
    const prefixClsHook = usePrefixCls()
    return {
      t, ...dateMixinHook,
      ...prefixClsHook,
    }
  },
  computed: {
    classes(): any[] {
      const { prefixClsCells } = this
      return [`${prefixClsCells}`, `${prefixClsCells}-month`]
    },
    cells(): IMonthCell[] {
      const cells: IMonthCell[] = []
      const tableYear = this.tableDate!.year()
      const selectedDays: Dayjs[] = this.dates
      /*         .filter(Boolean)
        .map((d: Dayjs) => clearHours(d).date(1).toDate().getTime()) */

      // const focusedDate = clearHours(
      //   new Date(
      //     this.focusedDate.getFullYear(),
      //     this.focusedDate.getMonth(),
      //     1,
      //   ),
      // );
      const isRange =
        this.selectionMode === 'range' && this.type === 'monthrange'

      const { from, to } = this.rangeState
      for (let i = 0; i < 12; i++) {
        const cell: IMonthCell = {
          desc: this.tCell(i + 1),
          date: clearHours(dayjs(new Date(tableYear, i, 1))),
          selected: false,
          disabled: false,
          range: false,
        }

        cell.today = dayjs().isSame(cell.date, 'month')

        cell.disabled =
          (this.selectionMode === 'month' || this.type === 'monthrange') &&
          isFunction(this.disabledDate) &&
          (this.disabledDate as any)(cell.date.toDate())

        cell.selected = selectedDays.some(selectedDate => {
          return selectedDate && cell.date.isSame(selectedDate, 'month')
        })

        if (from && to && cell.selected && !from.isSame(to, 'month')) {
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
    getCellCls(cell: IMonthCell) {
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
    tCell(nr: number) {
      return this.t(`el.datepicker.months.m${nr}`)
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
