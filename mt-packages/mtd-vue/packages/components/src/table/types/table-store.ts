import { IColumn } from '@components/table-column/types'
import { ITableSortOrder, RowKey, LoadDateCallback } from '@components/table/types'

export interface Dispatch {
  (actions: { [key: string]: any; type: string }): void;
}

export interface ITableColumnState<
  Row = any,
  PropValue = any,
  FilterValue = any
  > {
  columnsConfig: IColumn<Row, PropValue, FilterValue>[];

  columns: IColumn<Row, PropValue, FilterValue>[]; // 渲染用实际数据
  originColumns: IColumn<Row, PropValue, FilterValue>[];

  fixedColumns: IColumn<Row, PropValue, FilterValue>[];
  rightFixedColumns: IColumn<Row, PropValue, FilterValue>[];
  notFixedColumns: IColumn<Row, PropValue, FilterValue>[];

  leafColumns: IColumn<Row, PropValue, FilterValue>[];
  fixedLeafColumns: IColumn<Row, PropValue, FilterValue>[];
  rightFixedLeafColumns: IColumn<Row, PropValue, FilterValue>[];

  isComplex: boolean;
  selectionColumn?: IColumn<Row, PropValue, FilterValue>;

  visibleColumns: IColumn<Row, PropValue, FilterValue>[];
}
export interface ITableDataState<Row = any> {
  originData: Row[]; // 元数据
  data: Row[]; // 渲染数据
  hoverRow?: number;
  rowKey?: RowKey<Row>;
  ready: boolean;
  currentRow?: Row; // 当前高亮行
  currentRowKey?: string | number;
}

export interface ITableExpandState {
  expandRowKeys: string[];
  expandedKeysMap: { [key: string]: boolean };
}

export interface ITableFilterState<Row = any, FilterValue = any> {
  filteredData: Row[];
  filters: { [key: string]: FilterValue | FilterValue[] };
}

export interface ITableSelectionState<Row = any> {
  hasSelection: boolean;
  hasAnySelected: boolean;
  isAllSelected: boolean;
  selection: Row[];

  reserveSelection: boolean;
  CheckboxPropsCache: any;

  selectable?: (row: Row, $index: number) => boolean;
  indexOfSelection?: (row: Row, selection: Row[]) => number;
}

export interface ITableSortState<Row = any> {
  sortingColumn?: IColumn<Row>;
  sortOrder: ITableSortOrder;
  sortedData: Row[];
}

export interface ITableTreeState<Row = any> {
  treeEnabled: boolean;
  treeData: Row[];
  loadedKeys: string[];
  loadedKeysMap: { [key: string]: boolean };
  loadData?: Function;
  treeFieldNames: { [key: string]: string };
}

export interface ITableState<Row = any, PropValue = any, FilterValue = any>
  extends ITableColumnState<Row, PropValue, FilterValue>,
  ITableDataState<Row>,
  ITableExpandState,
  ITableFilterState<Row, FilterValue>,
  ITableSelectionState<Row>,
  ITableSortState<Row>,
  ITableTreeState<Row> { }

export type CheckboxProps = { disabled: boolean; value: boolean };
export type ExpandProps = { expanded: boolean; disabled: boolean };
export type TreeExpandProps = { expanded: boolean; disabled?: boolean };

export interface ITableStore<Row = any> {
  states: ITableState<Row>;
  $emit: (eventName: string, ...args: any[]) => void;
  expandable?: (row: Row, $index: number) => boolean;
  modules: any[];

  dispatch(mutation: { [key: string]: any; type: string }): void;
  // actions
  setExpandRowKeys(expandRowKeys: string[]): void;
  setData(data: Row[]): void;
  setReady(ready: boolean): void;
  updateColumns(): void;
  setHoverRow(hoverRow?: number): void;
  setCurrentRow(row: Row): void;

  // methods
  updateExpandRows(): void;
  toggleRowExpansion(row: Row, $index: number, expanded?: boolean): void;
  isExpanded(row: Row, $index: number): boolean;
  getExpandProps(row: Row, $index: number): ExpandProps;
  getExpandPropsByItem(row: Row, $index: number): ExpandProps | TreeExpandProps;

  getCheckboxPropsByItem(row: Row, $index: number): CheckboxProps;
  isSelected(row: Row): boolean;
  toggleRowSelection(row: Row, selected?: boolean): boolean;
  toggleAllSelection(selected?: boolean): void;
  rowSelectedChanged(row: Row, selected: boolean): void;
  cleanSelection(): void;
  clearSelection(): void;

  getTreeExpandProps(row: Row, $index: number): TreeExpandProps;
  createLoadDataCallback(key: string, row: Row): LoadDateCallback;

  computedFilteredData(): void;
  removeColumn(options: { column: IColumn<Row>; parent?: IColumn<Row> }): void;
  insertColumn(options: {
    column: IColumn<Row>;
    parent?: IColumn<Row>;
    index?: number;
  }): void;
  tailorColumns(arg: [number, number]): void
}
