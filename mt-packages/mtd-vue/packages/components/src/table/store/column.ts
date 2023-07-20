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

  // 固定列sticky 偏移计算
  const leftFixedColsLen = state.fixedLeafColumns.length
  if (leftFixedColsLen > 0) {
    state.fixedLeafColumns.forEach((col, index, arr) => {
      col.isStickySide = false
      if (index == 0) {
        col.stickyOffset = 0
      } else {
        const preCol = arr[index - 1]
        col.stickyOffset = preCol.stickyOffset as number + (preCol.realWidth || preCol.width || 0)
      }
    })
    state.fixedLeafColumns[leftFixedColsLen - 1].isStickySide = true
  }

  const rightFixedColsLen = state.rightFixedLeafColumns.length
  if (rightFixedColsLen > 0) {
    state.rightFixedLeafColumns[rightFixedColsLen - 1].isStickySide = false
    state.rightFixedLeafColumns[rightFixedColsLen - 1].stickyOffset = 0
    for (let i = rightFixedColsLen - 2; i >= 0; i--) {
      const col = state.rightFixedLeafColumns[i]
      const nextCol = state.rightFixedLeafColumns[i + 1]
      col.isStickySide = false
      col.stickyOffset = nextCol.stickyOffset as number + (nextCol.realWidth || nextCol.width || 0)
    }
    state.rightFixedLeafColumns[0].isStickySide = true
  }

  // const oldColumns = state.columns;
  // oldColumns.push({});
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
