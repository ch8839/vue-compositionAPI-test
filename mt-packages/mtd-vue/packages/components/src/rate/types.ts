import { CPI } from '@components/types/component'
export declare interface IRate extends CPI {
  modelValue: number;
  count: number;
  color: string | { [value: number]: string };
  disabled: boolean;
  voidColor?: string;
  disabledVoidColor?: string;

  icon: string | { [value: number]: string };
  voidIcon?: string;
  disabledVoidIcon?: string;
  allowHalf?: boolean;
  allowClear?: boolean;
  texts?: string[];
  tooltipProps?: object;
}

export type RateTextPosition = 'right' | 'top' | 'bottom'
declare const Rate: IRate
export default Rate
