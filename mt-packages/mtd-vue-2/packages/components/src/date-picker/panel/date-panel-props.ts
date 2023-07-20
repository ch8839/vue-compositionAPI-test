import { PropType } from '@ss/mtd-adapter'
import { initTimeDate } from '@utils/date'
import {
  DatePickerShort,
  DatePickerMode,
  DatePickerType,
} from '../types'
import { Dayjs } from 'dayjs'

export const datepanelProps = {
  format: {
    type: String,
    default: 'yyyy-MM-dd',
  },
  selectionMode: {
    type: String as PropType<DatePickerMode>,
    validator(value: string) {
      return ['year', 'month', 'date', 'time', 'quarter', 'halfyear'].indexOf(value) > -1
    },
    default: 'date',
  },
  shortcuts: {
    type: Array as PropType<DatePickerShort[]>,
    default: () => [],
  },
  disabledDate: {
    type: Function,
    default: () => false,
  },
  value: {
    type: Array as PropType<Dayjs[]>,
    default: () => [initTimeDate(), initTimeDate()],
  },
  timePickerOptions: {
    default: () => ({}),
    type: Object,
  },
  showWeekNumbers: {
    type: Boolean,
    default: false,
  },
  startDate: {
    type: Object as PropType<Dayjs>,
  },
  type: {
    type: String as PropType<DatePickerType>,
    required: true,
  },
  focusedDate: {
    type: Object as PropType<Dayjs>,
    //required: true,
  },
}

export default datepanelProps
