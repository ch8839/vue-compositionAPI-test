import { Component } from '@components/types/component'
import { PopperPlacement, getPopupContainer } from '@components/popper/types'
import { Option } from '@components/option/types'
import { TreeNode } from '@components/tree/types'

export interface Formatter {
  (labels: string[], values: any[]): string;
}

export interface LoadDataResolve {
  (data: any[]): void;
}

export interface LoadData {
  (item: any, resolve: LoadDataResolve): void;
}

export interface FilterMethod {
  (query: string, item: any): boolean;
}

export interface RemoteMethod {
  (query: string): boolean;
}

export interface Node<T = any, V = any> extends TreeNode {
  $parent?: Node<T, V>;
  $index: number;
  level: number;
  data: T;

  value: V;
  label: string;
  isLeaf: boolean;
  disabled: boolean;
  loading: boolean;

  selected: boolean;
  checked: boolean;
  hasChildrenChecked: boolean;
  indeterminate: boolean;
  children?: Node<T, V>[];
  hasChildren: boolean;

  hover?: boolean;
}

export interface FilteredNode<T = any, V = any> {
  label: string;
  value: V[];
  isLeaf: boolean;
  disabled: boolean;
  checked: boolean;
  m__IS_FILTERED_NODE: true;
  nodes: TreeNode<T, V>[];
}

export type DisplayNode<T = any, V = any> = FilteredNode<T, V> | Node<T, V>;

export interface CascaderFieldName {
  label: string;
  value: string;
  children: string;
  isLeaf: string;
  disabled: string;
  loading: string;
}

export type TCheckedStrategy = 'all' | 'parent' | 'children';

export declare interface ICascader extends Component {
  visible: boolean;
  defaultVisible: boolean;
  value: any[];
  data: any[];

  noDataText: string;
  props: object;

  changeOnSelect: boolean;
  expandTrigger: string;
  separator: string;
  filterable: boolean;

  formatter: Formatter;
  loadData: LoadData;
  debounce: number;

  reserveKeyword: boolean;
  filterMethod: FilterMethod;
  remote: boolean;
  remoteMethod: RemoteMethod;
  noMatchText: string;
  loading: boolean;
  loadingText: string;
  disabled: boolean;
  clearable: boolean;
  size: string;
  placeholder: string;
  popperClass: string;

  placement: PopperPlacement;

  appendToContainer: boolean;
  getPopupContainer: getPopupContainer;
}

export interface CascaderState {
  inputValue: string;
  expandedValue: any;
  focused: boolean;
  previousQuery: string | null;
  filter: string;
  inputWidth: string;
  valueStrs: Array<string>;
  debouncedQuery: Function | null;
  isOnComposition: boolean;

  option?: Option,
}

export type ExpandTrigger = 'click' | 'hover';

export interface ICascaderPanel extends Component {
  showCheckbox: boolean;
  changeOnSelect: boolean;
  expandTrigger: ExpandTrigger;

  getNodesByValues(values: any[]): Node[];
}



declare const Cascader: ICascader
export default Cascader
