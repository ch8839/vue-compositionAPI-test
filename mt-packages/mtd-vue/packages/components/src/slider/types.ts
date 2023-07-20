import { Component } from '@components/types/component'

export interface Marks {
  [key: string]: string;
}

export interface MarkText {
  value: number;
  label: string;
}
export interface Thresholds {
  values: number[];
  colors: string[];
}

export interface Track {
  color: string;
  value: number;
  w: string;
  x: string;
}

export interface FormatTooltip {
  (value: string): string;
}

export declare interface ISlider extends Component {
  min?: number;
  max?: number;
  value?: number;
  size?: string;
  range?: boolean;
  disabled?: boolean;
  steps?: number[];
  thresholds?: Thresholds;
  fixedValue?: number;
  marks?: Marks;
  formatTooltip?: FormatTooltip;
  vertical?: boolean;
}

declare const Slider: ISlider
export default Slider
