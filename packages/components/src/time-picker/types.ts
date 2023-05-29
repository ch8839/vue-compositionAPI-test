// import { IPicker } from './date-picker'

export type TimePickerType = 'time' | 'timerange';

export declare interface ITimePicker /* extends IPicker */ {
  type?: TimePickerType;
  timePickerOptions?: object;
  steps?: number[];
  popperClass?: string;
}

declare const TimePicker: ITimePicker
export default TimePicker
