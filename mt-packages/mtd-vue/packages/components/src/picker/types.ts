import { Option, OptionCPI, OptionSelect } from '@components/option/types'

export interface PickerState {
  innerVisible: boolean,
  valueSet: Set<any>,
  cachedSelected: Map<any, any>,
  optionsMap: Map<any, any>,
  _options: Option[],
  renderOptions: Option[],
  optionComponents: OptionCPI[],
  selected?: Option | Option[], // option[]
  unmatchedSelected: Option[], // type: { index: number, value: any }[];
  isSelectAll: boolean,
  query: string,
  previousQuery: string,
  hoverIndex: number,
  hoverOptionIns?: OptionCPI,
  optionIndex: number,
  hasInit: boolean, // 是否初始化过第一次选中的值
}

export interface PickerVirtualState {
  _options: any[],
  innerVisible: boolean,
  valueSet: Set<any>,
  cachedSelected: Map<any, any>,
  optionsMap: Map<any, any>,
  renderOptions: any[],
  selected?: Option | Option[], // option[]
  unmatchedSelected: Option[], // type: { index: number, value: any }[];
  isSelectAll: boolean,
  query: string,
  previousQuery: string,
  hoverIndex: number,
  hoverOption?: OptionCPI,
}