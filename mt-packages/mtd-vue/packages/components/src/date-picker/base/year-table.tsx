import { defineComponent } from '@ss/mtd-adapter'
import { clearHours, isInRange } from '@utils/date'
import { withProps, withName, withEmits, useDateMixin, DatePickerTableProps } from './useDateMixin'
import usePrefixCls from './usePrefixCls'
import { IYearCell } from '../types'
import dayjs from 'dayjs'
import { isFunction } from '@utils/type'

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
      return [`${this.prefixClsCells}`, `${this.prefixClsCells}-year`]
    },
    startYear(): number {
      return Math.floor(this.tableDate!.year() / 10) * 10
    },
    cells(): IYearCell[] {
      const cells = []
      const selectedDays = this.dates/* .filter(Boolean).map((date) => {
        return clearHours(date).month(0).date(1).toDate().getTime()
      }) */
      // const focusedDate = clearHours(
      //   new Date(this.focusedDate.getFullYear(), 0, 1),
      // );
      const isRange =
        this.selectionMode === 'range' && this.type === 'yearrange'

      const { from, to } = this.rangeState

      for (let i = 0; i < 12; i++) {
        const date = clearHours(dayjs(new Date(this.startYear + i, 0, 1)))
        const cell: IYearCell = {
          date,
          desc: `${date.year()}`,
          selected: false,
          disabled: false,
          range: false,
        }
        cell.disabled =
          this.selectionMode === 'year' &&
          isFunction(this.disabledDate) &&
          (this.disabledDate as any)(cell.date)

        cell.selected = selectedDays.some(selectedDate => {
          return selectedDate && cell.date.isSame(selectedDate, 'year')
        })

        cell.today = dayjs().isSame(cell.date, 'year')

        if (from && to && cell.selected && !from.isSame(to, 'year')) {
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
        // cell.focused = day === focusedDate;
        cells.push(cell)
      }

      if (this.type === 'yearrange') {
        // 首尾需要禁用处理
        cells[0].disabled = true
        cells[11].disabled = true
      }

      return cells
    },
  },
  methods: {
    getCellCls(cell: IYearCell) {
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
