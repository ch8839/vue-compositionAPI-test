import { CPI } from '@components/types/component'
import { TableRender, TableHeaderRender } from '@components/table/types'
import { VNode } from 'vue'
import { App } from '@ss/mtd-adapter'
import { ExpandProps } from '../table/types/table-store'

export type TableType = 'selection' | 'index' | 'expand' | 'default';
export type TableAlign = 'left' | 'center' | 'right';

export interface ITableFilter<T = any> {
  text: string;
  value: T;
}

export interface ITableColumnSlots<Row = any> {
  [key: string]: any;
  index?: (scope: { row: Row; index: number; $index: number }) => VNode[];
  default: TableRender;
  header?: TableHeaderRender;
  selection?: (scope: { props: any; row: Row; $index: number, on: any }) => VNode[];
  expand?: (
    scope: any | ExpandProps & { row: Row; $index: number; toggle: Function }
  ) => VNode[];
}
export interface IColumn<Row = any, PropValue = any, FilterValue = any> extends CPI {
  isStickySide?: boolean
  stickyOffset?: number
  visible: boolean
  columnId: String,

  level?: number;
  id: string;
  columnKey?: string;
  label?: string;
  className?: string;
  labelClass?: string;
  prop?: string;
  type: TableType;
  width?: number;
  minWidth?: number;
  realWidth?: number;

  alignClass?: string;
  headerAlignClass?: string;

  renderHeader: TableHeaderRender;
  renderCell: TableRender;
  formatter: (
    row: Row,
    column: IColumn<Row, PropValue, FilterValue>,
    cellValue: PropValue,
    index: number
  ) => string;

  fixed: string | boolean;

  sortable: string | boolean;
  sortMethod: (row1: Row, row2: Row) => number;
  sortOrders: string[];
  sortBy?: string | string[];
  showOverflowTooltip: boolean;
  overflowSelector: string;
  filterable: boolean;
  filters: ITableFilter<FilterValue>[];

  filterDropdownVisible: boolean;
  filteredValue: FilterValue | FilterValue[];
  filterMethod: (
    value: FilterValue,
    row: Row,
    column: IColumn<Row, PropValue, FilterValue>
  ) => boolean;
  filterMultiple: boolean;
  showFilterActions: boolean;

  updateFilteredValue: (value: FilterValue) => void;
  updateFilterDropdownVisible: (visible: boolean) => void;
  resizable: boolean;

  $slots: ITableColumnSlots<Row>;
  children?: IColumn<Row, PropValue, FilterValue>[];

  // computed in table-header
  colSpan?: number;
  rowSpan?: number;
}
export declare interface ITableColumn<Row = any, PropValue = any, F = any>
  extends CPI {
  column: IColumn<Row, PropValue, F>;
  columnId: string
}

declare const TableColumn: IColumn & {
  name: string;
  install(app: App): void;
}
export default TableColumn
