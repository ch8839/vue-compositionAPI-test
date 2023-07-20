import { CPI } from '@components/types/component'
import { Emitter } from '@utils/mitt'

export interface Option {
  value: any;
  label: string | number;
  disabled?: boolean;

  index?: number,
  realValue?: any,
  data?: any,
  hidden?: boolean
}

export interface OptionCPI extends CPI {
  visible: boolean;
  value: any,
  label: string | number,
  disabled: boolean,
  option: Option,
  index: number,
  hover: boolean,
  m_selected: boolean,
  indeterminate: boolean, // 是否半选状态，仅用于 全选时

  m_option: Option,
}

export interface OptionSelect {
  hasInit: boolean;
  fieldNames: {
    label?: string;
    disabled?: string;
    value?: string
  }
  optionIndex: number;
  hoverOptionIns: OptionCPI;
  valueKey: string | undefined;
  showCheckbox: boolean;
  hoverIndex: number,
  multiple: boolean,
  emitter: Emitter,
  virtual: boolean,
  handleOptionClick: (ins: OptionCPI) => void,
  getOptionIndex: () => number,
  setOptionComponent: (ins: OptionCPI, index: number, isRemove?: boolean) => void,
  judgeSelectd: (optValue: any) => boolean,
  addOption: (ins: OptionCPI) => boolean,
  addSelectAllOptionIns: (ins: OptionCPI) => void,
  removeOption: (ins: OptionCPI) => boolean,
}

// 特殊的option
export const SELECT_ALL_VALUE = 'm__SELECT_ALL__'

import Index from './index'

export type IOption = InstanceType<typeof Index>