import { computed, PropType } from '@ss/mtd-adapter'
import {
  ICell,
  IDateCell,
  DatePickerType,
  DatePickerMode,
} from '../types'
import { Dayjs } from 'dayjs'
import { clearHours } from '@utils/date'
import { isArray } from '@utils/type'

export const withProps = {
  tableDate: {
    type: Object as PropType<Dayjs>,
    required: true,
  },
  disabledDate: {
    type: Function,
  },
  selectionMode: {
    type: String as PropType<DatePickerMode>,
    required: true,
  },
  value: {
    type: Array as PropType<Dayjs[]>,
    required: true,
  },
  rangeState: {
    type: Object as PropType<{
      from?: Dayjs;
      to?: Dayjs;
      selecting: boolean;
    }>,
    default: () => ({
      from: undefined,
      to: undefined,
      selecting: false,
    }),
  },
  // focusedDate: {
  //   type: Object as PropType<Dayjs>,
  //   required: true,
  // },
  type: String as PropType<DatePickerType>,
  multiple: Boolean,
}

export interface DatePickerTableProps {
  tableDate: Dayjs
  disabledDate?: Function
  selectionMode: DatePickerMode
  value: Dayjs[]
  rangeState: {
    from?: Dayjs;
    to?: Dayjs;
    selecting: boolean;
  }
  type?: DatePickerType,
}

// name: 'PanelTable',
// emits: ['change', 'range'],
export const withName = 'PanelTable'
export const withEmits = ['change', 'range']

export const useDateMixin = (props: DatePickerTableProps, ctx: any) => {

  const hasValue = computed(() => isArray(props.value) && props.value[0] && props.value[1])

  const dates = computed((): Dayjs[] => {
    const { selectionMode, value, rangeState } = props
    const rangeSelecting = selectionMode === 'range' && rangeState.selecting

    // 特殊处理datetimerange
    if (props.type === 'datetimerange') {
      const result: Dayjs[] = []
      if (rangeState.from) result.push(rangeState.from)
      if (rangeState.to) result.push(rangeState.to)
      return result
    }
    return rangeSelecting ? [rangeState.from!] : value
  })
  const isWeek = computed(() => {
    return props.type === 'week' || props.type === 'weekrange'
  })

  function handleClick(cell: ICell) {
    if (cell.disabled || (cell as IDateCell).type === 'weekLabel') return
    let cellDate = cell.date!
    if (props.type === 'week') {
      cellDate = cellDate.startOf('week')
    }
    const newDay = clearHours(cellDate)

    ctx.emit('change', newDay)
  }
  function handleMouseMove(cell: ICell) {
    if (!props.rangeState.selecting) return
    if (cell.disabled) return
    const newDate = cell.date
    ctx.emit('range', newDate)
  }

  return {
    dates, isWeek, hasValue,
    handleClick, handleMouseMove,
  }
}
