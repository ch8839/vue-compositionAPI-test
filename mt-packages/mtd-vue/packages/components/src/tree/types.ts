import { Component, CPI } from 'src/types/component'
import { Emitter } from '@utils/mitt'
import TreeNodeInterface from '@components/tree-node/types'

export interface TreeData {
  [key: string]: any;
  title?: string
  children?: TreeData[]
  icon?: string
  isLeaf?: boolean
  id?: string
  disabled?: boolean
  disableCheckbox?: boolean
  checkable?: boolean
}
export interface TreeNode<T = any, V = any> {
  key: string
  $parent?: TreeNode<T>
  $index: number
  value: V
  loading: boolean
  children?: TreeNode<T>[]
  disabled: boolean
  disableCheckbox?: boolean
  checked: boolean
  expanded?: boolean
  selected: boolean
  checkable?: boolean
  selectable?: boolean
  indeterminate: boolean
  level: number
  data: T
  isLeaf: boolean
  label: string
  icon?: string
  loaded?: boolean

  hasChildrenChecked: boolean
  hasChildren: boolean

  visible?: boolean
  isRender?: boolean
}
export type TreeDropType = 'before' | 'after' | 'inner' | 'none';
export type checkedStrategy = 'all' | 'parent' | 'children';

interface LoadDataCallback {
  (children: TreeData[]): void;
}
export declare interface loadData {
  (node: TreeNode, callback: LoadDataCallback): void;
}
export interface TreeDragState {
  showDropIndicator: boolean;
  draggingNode?: TreeNodeInterface;
  dropNode?: TreeNodeInterface;
  allowDrop: boolean;
  dropType?: TreeDropType;
}
export interface TreeState {
  forceNumber: number;
  dragState: TreeDragState;
  emitter: Emitter;
  //autoExpandParent: boolean;
  /// flatNodes: { [key: string]: TreeNode };
}
export interface TreeProvider {
  emitter: Emitter;
}
export interface TreeFieldName {
  label: string;
  icon: string;
  children: string;
  isLeaf: string;
  disabled: string;
  checkable: string;
  disableCheckbox: string;
  value: string
  loading: string
}
export const DEFAULT_FIELD_NAMES: TreeFieldName = {
  label: 'label',
  icon: 'icon',
  children: 'children',
  isLeaf: 'isLeaf',
  disabled: 'disabled',
  checkable: 'checkable',
  disableCheckbox: 'disableCheckbox',
  value: 'value',
  loading: 'loading',
}
export declare interface ITree extends CPI {
  data: TreeData[];
  expandIcon: string;
  checkable?: boolean;
  checkedKeys: string[];
  checkStrictly: boolean;
  checkedStrategy: checkedStrategy;
  selectedKeys: string[];
  expandedKeys: string[];
  defaultExpandAll: boolean;
  loadedKeys: string[];
  expandOnClickNode: boolean;
  checkOnClickNode: boolean;
  nodeKey: string;
  indent: number;
  disabled: boolean;
  disabledStrictly?: boolean;
  emptyText: string;

  baseIndent: number
  loadData?: Function
  emitter: Emitter

  selectable: boolean
  nodeClass: any
  draggable: boolean

  handleDragStart: Function
  handleDragOver: Function
  handleDragEnd: Function
}
export declare function makeTreeNode(
  name: string,
  component: Component
): Component;

export type TCheckedStrategy = 'all' | 'parent' | 'children';

declare const Tree: ITree
export default Tree
