import { ExtractPropTypes, PropType } from '@ss/mtd-adapter'

export interface VirtualOptions {
  rowHeight?: number
}

const tableProps = () => ({
  data: {
    type: Array,
    default: () => {
      return []
    },
  },

  size: String,

  width: Number,

  height: [Number, String],

  maxHeight: [Number, String],

  fit: {
    type: Boolean,
    default: true,
  },

  striped: Boolean,

  bordered: Boolean,

  rowKey: [String, Function],

  context: Object,

  showHeader: {
    type: Boolean,
    default: true,
  },

  showSummary: Boolean,

  sumText: {
    type: String,
    default: '合计',
  },

  summaryMethod: Function,

  rowClass: [String, Function],

  rowStyle: [Object, Function],

  cellClass: [String, Function],

  cellStyle: [Object, Function],

  headerRowClass: [String, Function],

  headerRowStyle: [Object, Function],

  headerCellClass: [String, Function],

  headerCellStyle: [Object, Function],

  highlightCurrentRow: Boolean,
  currentRowKey: [String, Number],

  loading: Boolean,
  loadingMessage: String,

  emptyText: {
    type: String,
    default: '暂无数据',
  },

  expandable: {
    type: Function as PropType<(row: any, $index: number) => boolean>,
  },
  expandRowKeys: {
    type: Array as PropType<any[]>,
    default: () => {
      return []
    },
  },
  checkboxable: Function,
  selection: {
    type: Array,
    default: () => {
      return []
    },
  },
  reserveSelection: Boolean,
  indexOfSelection: {
    // required when has selection column
    type: Function,
    default: (row: any, selection: any[]) => {
      return selection.indexOf(row)
    },
  },

  sortOrder: Object,

  rowColSpan: Function,
  showOverflowTooltip: Boolean,
  overflowSelector: String,
  tooltipProps: Object,
  tooltipClass: String,
  disableMouseEvent: Boolean,

  horizontalVirtual: Boolean,
  verticalVirtual: Boolean,
  virtualOptions: {
    type: Object as PropType<VirtualOptions>,
  },

  // tree
  tree: Boolean,
  treeFieldNames: Object,
  indent: {
    type: Number,
    default: 24,
  },
  loadData: {
    type: Function,
  },
  loadedKeys: {
    type: Array as PropType<any[]>,
    default: () => {
      return []
    },
  },
  findTreeColumnIndex: {
    type: Function,
  },
  expandOnClickTr: Boolean,
  resizeImmediate: {
    // 暂时保留，后期去除
    type: Boolean,
    default: true,
  },
  defaultExpandAll: {
    type: Boolean,
    default: false,
  },
})

export type TableProps = Partial<ExtractPropTypes<ReturnType<typeof tableProps>>>;

export default tableProps
