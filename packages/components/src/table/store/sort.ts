import { orderBy } from '../utils'
import {
  ITableSortState,
  ITableState,
  Dispatch,
} from '../types/table-store'
import { ITableSortOrder } from '@components/table/types'

function getInitState(): ITableSortState {
  return {
    sortingColumn: undefined,
    sortOrder: {},
    sortedData: [],
  }
}

const actions = {
  setSortOrder(dispatch: Dispatch, sortOrder: ITableSortOrder) {
    dispatch({ type: 'updateSorderOrder', payload: sortOrder })
    dispatch({ type: 'computedSortedData' })
    dispatch({ type: 'computedFilteredData' })
  },
}

function getSortingColumn(state: ITableState) {
  const { columns, sortOrder } = state
  if (sortOrder && sortOrder.prop && sortOrder.order) {
    return columns.find((column) => {
      return column.sortable && column.prop === sortOrder.prop
    })
  }
}

function computedData(state: ITableState) {
  const { treeEnabled, sortingColumn } = state
  if (treeEnabled || !sortingColumn || sortingColumn.sortable !== true) {
    return state.originData
  }

  const { sortMethod, sortBy } = sortingColumn
  const {
    sortOrder: { order, prop },
    originData,
  } = state

  return orderBy(originData, prop!, order, sortMethod, sortBy)
}

const mutations = {
  updateSorderOrder(
    state: ITableState,
    { payload: sortOrder }: { payload: ITableSortOrder },
  ) {
    state.sortOrder = sortOrder
    state.sortingColumn = getSortingColumn(state)
    return state
  },
  updateColumns(state: ITableState) {
    state.sortingColumn = getSortingColumn(state)
  },
  computedSortedData(state: ITableState) {
    state.sortedData = computedData(state)
    state.data = state.sortedData
  },
  updateTreeEnabled(state: ITableState) {
    state.sortedData = computedData(state)
    state.data = state.sortedData
  },
}

export default {
  getInitState,
  actions,
  mutations,
}
