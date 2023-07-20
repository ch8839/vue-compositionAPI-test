import {
  Dispatch,
  ITableColumnState,
  ITableState,
} from '../types/table-store'
import { IColumn } from '@components/table-column/types'

import { doFlattenColumns } from '../utils'

function getInitState(): ITableColumnState {
  return {
    columnsConfig: [], // 元数据

    columns: [], // 渲染用实际数据
    originColumns: [],

    fixedColumns: [],
    rightFixedColumns: [],
    notFixedColumns: [],

    leafColumns: [],
    fixedLeafColumns: [],
    rightFixedLeafColumns: [],

    isComplex: false,
    selectionColumn: undefined,

    visibleColumns: [],// 虚拟滚动实际渲染数据
  }
}

// 计算固定列 左边偏移
function setColumnsFixedOffset_Left(columns: IColumn[], initOffset = 0, isStickySide = true) {
  const tailIndex = columns.length - 1
  columns.forEach((col, index, arr) => {
    col.isStickySide = isStickySide && (tailIndex === index)
    if (index == 0) {
      col.stickyOffset = initOffset
    } else {
      const preCol = arr[index - 1]
      col.stickyOffset = preCol.stickyOffset as number + (preCol.realWidth || preCol.width || 0)
    }

    if (col.children) {
      setColumnsFixedOffset_Left(col.children, col.stickyOffset, col.isStickySide)
    }
  })
}

function setColumnsFixedOffset_Right(columns: IColumn[], initOffset = 0, isStickySide = true) {
  const headIndex = 0
  for (let index = columns.length - 1; index >= 0; index--) {
    const col = columns[index]
    col.isStickySide = isStickySide && (headIndex === index)
    if (index == columns.length - 1) {
      col.stickyOffset = initOffset
    } else {
      const preCol = columns[index + 1]
      col.stickyOffset = preCol.stickyOffset as number + (preCol.realWidth || preCol.width || 0)
    }

    if (col.children) {
      setColumnsFixedOffset_Right(col.children, col.stickyOffset, col.isStickySide)
    }
  }
}

// 计算列 宽度
function computedRealWidth(columns: IColumn[]): number {
  let sumWidth = 0
  columns.forEach((col, index, arr) => {

    let realWidth = col.realWidth || col.width || col.minWidth

    if (!realWidth) {
      if (col.children) {
        realWidth = computedRealWidth(col.children)
      } else {
        realWidth = 80
      }
    }
    col.realWidth = realWidth
    sumWidth = sumWidth + realWidth
  })
  return sumWidth
}

const actions = {
  insertColumn(dispatch: Dispatch, params: any) {
    dispatch({ type: 'insertColumn', payload: params });
    ((this as any).states as ITableState).ready &&
      dispatch({ type: 'updateColumns' })
  },
  removeColumn(dispatch: Dispatch, params: any) {
    dispatch({ type: 'removeColumn', payload: params });
    ((this as any).states as ITableState).ready &&
      dispatch({ type: 'updateColumns' })
  },
  tailorColumns(dispatch: Dispatch, params: [number, number]) {
    dispatch({ type: 'tailorColumns', payload: params });
    ((this as any).states as ITableState).ready &&
      dispatch({ type: 'updateColumns' })
  },
  updateColumns(dispatch: Dispatch) {
    dispatch({ type: 'updateColumns' })
  },
}

function updateColumns(state: ITableColumnState) {
  const columnsConfig = state.columnsConfig
  const fixedColumns = columnsConfig.filter(
    (column) => column.fixed === true || column.fixed === 'left',
  )
  const rightFixedColumns = columnsConfig.filter(
    (column) => column.fixed === 'right',
  )
  const notFixedColumns = columnsConfig.filter((column) => !column.fixed)

  if (
    fixedColumns.length > 0 &&
    columnsConfig[0] &&
    columnsConfig[0].type === 'selection' &&
    !columnsConfig[0].fixed
  ) {
    columnsConfig[0].fixed = true
    fixedColumns.unshift(columnsConfig[0])
  }
  state.fixedColumns = fixedColumns
  state.rightFixedColumns = rightFixedColumns
  state.notFixedColumns = notFixedColumns

  state.originColumns = ([] as IColumn[])
    .concat(state.fixedColumns)
    .concat(state.notFixedColumns)
    .concat(state.rightFixedColumns)
  // computed
  state.isComplex = fixedColumns.length > 0 || rightFixedColumns.length > 0

  state.leafColumns = doFlattenColumns(notFixedColumns)
  state.fixedLeafColumns = doFlattenColumns(fixedColumns)
  state.rightFixedLeafColumns = doFlattenColumns(rightFixedColumns)

  computedRealWidth(columnsConfig)

  // 固定列sticky 偏移计算

  const leftFixedColsLen = fixedColumns.length
  if (leftFixedColsLen > 0) {
    setColumnsFixedOffset_Left(fixedColumns)
  }

  const rightFixedColsLen = rightFixedColumns.length
  if (rightFixedColsLen > 0) {
    setColumnsFixedOffset_Right(rightFixedColumns)
  }


  state.columns = ([] as IColumn[])
    .concat(state.fixedLeafColumns)
    .concat(state.leafColumns)
    .concat(state.rightFixedLeafColumns)

  state.selectionColumn = columnsConfig.find((column) => {
    return column.type === 'selection'
  })
  return state
}

const mutations = {
  insertColumn(
    state: ITableColumnState,
    {
      payload: { column, index, parent },
    }: { payload: { column: IColumn; index: number; parent?: IColumn } },
  ) {
    let array = state.columnsConfig
    if (parent) {
      array = parent.children!
      if (!array) array = parent.children = []
    }

    if (typeof index !== 'undefined') {
      array.splice(index, 0, column)
    } else {
      array.push(column)
    }
    return state
  },

  removeColumn(
    state: ITableColumnState,
    {
      payload: { column, parent },
    }: { payload: { column: IColumn; parent?: IColumn } },
  ) {
    let array = state.columnsConfig
    if (parent) {
      array = parent.children!
      if (!array) array = parent.children = []
    }
    if (array) {
      const index = array.indexOf(column)
      if (index > -1) {
        array.splice(index, 1)
      }
    }
    return state
  },

  // 虚拟滚动所用的裁剪方法
  tailorColumns(
    state: ITableColumnState,
    {
      payload: [start, end],
    }: { payload: [number, number] },
  ) {
    const array = state.columnsConfig
    state.visibleColumns = []
    if (array) {
      array.forEach((col, index) => {
        if (index < start || index > end) {
          col.visible = false
        } else {
          col.visible = true
          state.visibleColumns.push(col)
        }
      })
    }
    return state
  },

  updateColumns(state: ITableColumnState) {
    return updateColumns(state)
  },
}

export default {
  getInitState,
  actions,
  mutations,
}
