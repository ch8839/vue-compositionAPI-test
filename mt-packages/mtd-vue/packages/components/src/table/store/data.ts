import { getRowIdentity } from '../utils'
import {
  ITableState,
  ITableDataState,
  Dispatch,
  ITableStore,
} from '../types/table-store'
import { RowKey } from '@components/table/types'

function getInitState(): ITableDataState {
  return {
    originData: [], // 元数据
    data: [], // 渲染数据
    hoverRow: -1,
    rowKey: '', // string or function
    ready: false,
    currentRow: undefined, // 当前高亮行
    currentRowKey: undefined,
  }
}

const actions = {
  setData(dispatch: Dispatch, data: any) {
    const that: ITableStore = this as any
    const { data: oldData, currentRowKey } = that.states
    dispatch({ type: 'updateData', payload: data })
    if (that.states.selectionColumn && !that.states.reserveSelection) {
      if (oldData === data) {
        that.cleanSelection()
      } else {
        that.clearSelection()
      }
    }
    that.updateExpandRows()
    if (currentRowKey || currentRowKey === 0) {
      dispatch({ type: 'updateCurrentRowByKey', payload: currentRowKey })
    }

    dispatch({ type: 'computedSortedData' })
    dispatch({ type: 'computedFilteredData' })
  },
  setReady(dispatch: Dispatch, options: any) {
    dispatch({ type: 'updateReady', payload: options })
    dispatch({ type: 'updateColumns', payload: options })
    dispatch({ type: 'computedSortedData' })
    dispatch({ type: 'computedFilteredData' })
  },
  setHoverRow(dispatch: Dispatch, hoverRow?: number) {
    dispatch({ type: 'updateHoverRow', payload: hoverRow })
  },
  setRowKey(dispatch: Dispatch, rowKey: RowKey) {
    dispatch({ type: 'updateRowKey', payload: rowKey })
  },
  setCurrentRow(dispatch: Dispatch, row: any) {
    dispatch({ type: 'updateCurrentRow', payload: row })
  },
  setCurrentRowKey(dispatch: Dispatch, currentRowKey?: string) {
    dispatch({ type: 'updateCurrentRowByKey', payload: currentRowKey })
  },
}

const mutations = {
  updateData(state: ITableState, { payload: data }: { payload: any[] }) {
    state.originData = data || []
    state.data = data || []
    return state
  },
  updateReady(state: ITableState, { payload: ready }: { payload: boolean }) {
    state.ready = ready
    return state
  },
  updateHoverRow(
    state: ITableState,
    { payload: hoverRow }: { payload?: number },
  ) {
    state.hoverRow = hoverRow
    return state
  },
  updateRowKey(state: ITableState, { payload: rowKey }: { payload?: RowKey }) {
    state.rowKey = rowKey
    return state
  },
  updateCurrentRow(state: ITableState, { payload: row }: { payload?: any }) {
    state.currentRow = row
    return state
  },
  updateCurrentRowByKey(
    state: ITableState,
    { payload: currentRowKey }: { payload?: string | number },
  ) {
    const rowKey = state.rowKey
    const data = state.data
    if (rowKey) {
      const currentRow = data.find((item) => {
        const key = getRowIdentity(item, rowKey)
        return key === currentRowKey
      })
      state.currentRow = currentRow
    }
    state.currentRowKey = currentRowKey
    return state
  },
}

export default {
  getInitState,
  actions,
  mutations,
}
