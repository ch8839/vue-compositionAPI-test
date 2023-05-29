import { Component } from '@components/types/component'
import { PopperPlacement, PopperTrigger, getPopupContainer } from '@components/popper/types'
import { Dayjs } from 'dayjs'

export type DatePickerMode = 'date' | 'month' | 'year' | 'quarter' | 'halfyear' | 'range' | 'week';

export type DatePickerType =
  | 'date'
  | 'daterange'

  | 'datetime'
  | 'datetimerange'

  | 'year'
  | 'yearrange'

  | 'month'
  | 'monthrange'

  | 'week'
  | 'weekrange'

  | 'quarter'
  | 'quarterrange'

  | 'halfyear'
  | 'halfyearrange';

export interface DatePickerShort<T = any> {
  text: string;
  value: () => T;
  onClick: Function;
}

export interface ICell {
  desc: string;
  selected: boolean;
  range?: boolean;
  disabled?: boolean;
  date?: Dayjs;

  isValueTail?: boolean;
  isValueHead?: boolean;
  isRangeHead?: boolean;
  isRangeTail?: boolean;
  today?: boolean;
}
export interface IDateCell extends ICell {
  type: 'prevMonth' | 'monthDay' | 'nextMonth' | 'today' | 'weekLabel';
}

export interface IMonthCell extends ICell {
  date: Dayjs;
}
export interface IYearCell extends ICell {
  date: Dayjs;
}

export interface IQuarterCell extends ICell {
  date: Dayjs;
}
export interface IHalfYearCell extends ICell {
  date: Dayjs;
}

export interface DatePickerOptions {
  disabledDate?: (d: Date) => boolean;
  shortcuts?: DatePickerShort[];
}
export declare interface IPicker extends Component {
  format?: string;
  readonly?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  confirm?: boolean;
  open?: boolean;
  splitPanels?: boolean;
  startDate?: Date;
  size?: string;
  placeholder?: string;
  placement?: PopperPlacement;
  name?: string;

  value?: Date | Date[] | string | string[];

  options?: DatePickerOptions;

  icon?: string;
  appendToContainer?: boolean;
  getPopupContainer?: getPopupContainer;

  invalid?: boolean;
  loading?: boolean;
  genre?: string;
  popperClass?: string;
}

export declare interface IDatePicker extends IPicker {
  type?: DatePickerType;
  multiple?: boolean;
  showWeekNumbers?: boolean;
}

declare const DatePicker: IDatePicker
export default DatePicker
