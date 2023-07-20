import { defineComponent } from '@ss/mtd-adapter'
import { clearHours, isInRange } from '@utils/date'
import { withProps, withName, withEmits, useDateMixin, DatePickerTableProps } from './useDateMixin'
import usePrefixCls from './usePrefixCls'
import { IQuarterCell } from '../types'
import dayjs, { Dayjs } from 'dayjs'
import { isFunction } from '@utils/type'

const quarterOfYear = require('dayjs/plugin/quarterOfYear')
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
      return [`${prefixClsCells}`, `${prefixClsCells}-quarter`]
    },
    cells(): IQuarterCell[] {
      const cells: IQuarterCell[] = []
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
        this.selectionMode === 'range' && this.type === 'quarterrange'

      const { from, to } = this.rangeState
      for (let i = 0; i < 4; i++) {
        const cell: IQuarterCell = {
          desc: `Q${i + 1}`,
          date: clearHours(dayjs(new Date(tableYear, 3 * i, 1))),
          selected: false,
          disabled: false,
          range: false,
        }

        cell.today = dayjs().isSame(cell.date, 'quarter' as dayjs.OpUnitType)

        cell.disabled =
          (this.selectionMode === 'quarter' || this.type === 'quarterrange') &&
          isFunction(this.disabledDate) &&
          (this.disabledDate as any)(cell.date.toDate())

        cell.selected = selectedDays.some(selectedDate => {
          return selectedDate && cell.date.isSame(selectedDate, 'quarter' as dayjs.OpUnitType)
        })

        if (from && to && cell.selected && !from.isSame(to, 'quarter' as dayjs.OpUnitType)) {
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
    getCellCls(cell: IQuarterCell) {
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
