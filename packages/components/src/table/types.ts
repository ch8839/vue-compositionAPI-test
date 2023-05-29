
import { VNode } from 'vue'
import { CPI } from '@components/types/component'
import { Emitter } from '@utils/mitt'
import { IColumn } from '@components/table-column/types'
import { ITableStore } from './types/table-store'
import { VirtualOptions } from './tablePropsType'
import TableLayout from './base/table-layout'

export * from './types/table-store'
export type Size = 'small' | 'large';
export interface ClassName<Row = any> {
  (): string;
}
export interface HeaderCellClass<Row = any> {
  (options: {
    rowIndex: number;
    columnIndex: number;
    row: Row;
    column: IColumn<Row>;
  }): any;
}
export interface HeaderCellStyle<Row = any> {
  (options: {
    rowIndex: number;
    columnIndex: number;
    row: Row;
    column: IColumn<Row>;
  }): any;
}
export interface HeaderRowClass {
  (options: { rowIndex: number }): any;
}
export interface HeaderRowStyle {
  (options: { rowIndex: number }): any;
}
export interface RowClassName<Row = any> {
  (options: { row: Row; rowIndex: number }): any;
}
export interface RowStyle<Row = any> {
  (options: { row: Row; rowIndex: number }): any;
}
export interface RowColSpan<Row = any> {
  (options: {
    row: Row;
    column: IColumn<Row>;
    rowIndex: number;
    columnIndex: number;
  }): { rowspan: number; colspan: number };
}
export interface CellClassName<Row = any> {
  (options: {
    rowIndex: number;
    columnIndex: number;
    row: Row;
    column: IColumn<Row>;
  }): any;
}
export interface CellStyle<Row = any> {
  (options: {
    rowIndex: number;
    columnIndex: number;
    row: Row;
    column: IColumn<Row>;
  }): any;
}
export interface select {
  (): void;
}
export interface selectAll {
  (): void;
}
export interface selectionChange {
  (): void;
}
export interface Click {
  (): void;
}
export interface Mouse {
  (): void;
}
export interface sortChange {
  (): void;
}
export interface filterChange {
  (): void;
}
export interface expandChange {
  (): void;
}

export interface RowKeyFn<Row = any> {
  (row: Row): string;
}

export type RowKey<T = any> = string | RowKeyFn<T>;

export interface ITableSortOrder {
  prop?: string;
  order?: 'ascending' | 'descending';
}

export interface ITableLayout {
  scrollY?: string
  gutterWidth: string

  getFlattenColumns: () => IColumn[]
  addObserver: (ins: CPI) => void
  removeObserver: (ins: CPI) => void
}

export interface TableRender<Row = any> {
  (scope: {
    row: Row;
    column: IColumn;
    $index: number;
    store: ITableStore<Row>;
    fixed?: string | boolean;
  }): any | VNode[] | VNode | string | number | undefined;
}
export interface TableHeaderRender<Row = any> {
  (scope: {
    column: IColumn;
    $index: number;
    store: ITableStore<Row>;
    fixed?: string | boolean;
  }): any | VNode[] | VNode | string | number | undefined;
}

export interface LoadDateCallback<Row = any> {
  (data: Row[]): void;
}

export interface SummaryMethod<Row = any> {
  (options: { columns: IColumn<Row>[]; data: Row[] }): string;
}
export declare interface ITable<Row = any> extends CPI {
  prefixMTD: string
  tableId: String,

  emitter: Emitter;
  ready: boolean;

  data: Row[];
  size?: Size;
  width: string | number;
  height?: string | number;
  maxHeight?: string | number;
  fit: boolean;
  striped?: boolean;
  bordered?: boolean;
  rowKey?: RowKey<Row>;
  showHeader: boolean;
  showSummary?: boolean;
  sumText: string;
  summaryMethod: SummaryMethod<Row>;
  rowClass?: string | RowClassName<Row>;
  rowStyle?: { [key: string]: string } | RowStyle<Row>;
  cellClass?: string | CellClassName<Row>;
  cellStyle?: { [key: string]: string } | CellStyle<Row>;
  headerRowClass?: string | HeaderRowClass;
  headerRowStyle?: { [key: string]: string } | HeaderRowStyle;
  headerCellClass?: string | HeaderCellClass<Row>;
  headerCellStyle?: { [key: string]: string } | HeaderCellStyle<Row>;
  highlightCurrentRow: boolean;
  currentRowKey: string | number;
  loading: boolean;
  loadingMessage: string;
  emptyText?: string;
  expandable?: (row: Row, $index: number) => boolean;
  expandRowKeys?: any[];
  checkboxable?: (row: Row) => boolean;
  selectable: (row: Row) => boolean;
  selection?: Row[];
  reserveSelection?: boolean;
  indexOfSelection?: (row1: Row, row2: Row) => number;
  sortOrder?: object;
  rowColSpan?: RowColSpan;
  showOverflowTooltip: boolean;
  overflowSelector: string;
  tooltipProps?: Object;
  tooltipClass?: string;
  tree: boolean;
  treeFieldNames?: { [key: string]: string };
  indent: number;
  loadData?: (row: Row, callback: LoadDateCallback) => void;
  loadedKeys: string[];
  findTreeColumnIndex: (columns: IColumn[]) => number;
  expandOnClickTr: boolean;
  resizeImmediate: boolean;

  verticalVirtual?: boolean
  horizontalVirtual?: boolean
  virtualOptions?: VirtualOptions

  select?: select;
  selectAll?: selectAll;
  selectionChange?: selectionChange;
  rowClick?: Click;
  cellClick?: Click;
  cellMouseEnter?: Mouse;
  cellMouseLeave?: Mouse;
  headerClick?: Click;
  sortChange?: sortChange;
  filterChange?: filterChange;
  expandChange?: expandChange;
  doReflow(): void;
  scrollTo(px: number): void;

  store: ITableStore<Row>;
  columns: IColumn<Row>[];
  fixedColumns: IColumn<Row>[];
  rightFixedColumns: IColumn<Row>[];
  bodyWrapperRef: HTMLElement;

  resizeState: {
    width?: number;
    height?: number;
  };
  layout: TableLayout;

  isGroup: boolean;
  resizeProxyVisible: boolean;
  scheduleLayout: (updateColumns?: boolean) => void;
  renderExpanded?: (options: {
    row: Row;
    $index: number;
    store: ITableStore<Row>;
  }) => any | VNode[] | VNode | string | number | undefined;
  showTooltip(reference: HTMLElement, content: string): void;
  hideTooltip(): void;

  handleHorizontalScroll(e: Event): void

  //ref
  hiddenColumnsRef: HTMLElement
  headerWrapperRef?: HTMLElement
  appendWrapperRef?: HTMLElement
  footerWrapperRef?: HTMLElement
}
declare const Table: ITable

export default Table
