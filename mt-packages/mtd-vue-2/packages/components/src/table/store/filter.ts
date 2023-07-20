import {
  ITableState,
  ITableFilterState,
  Dispatch,
} from '../types/table-store'

function getInitState(): ITableFilterState {
  return {
    filteredData: [],
    filters: {
      // [columnKey: string]: string[]
    },
  }
}

const actions = {
  computedFilteredData(dispatch: Dispatch) {
    dispatch({ type: 'computedFilteredData' })
  },
}

const mutations = {
  computedFilteredData(state: ITableState) {
    const columns = state.columns
    const sortedData = state.sortedData
    const filteredColumn = columns.filter((column) => column.filterable)
    const filters: any = {}

    const filteredData = filteredColumn.reduce((data, column) => {
      const {
        filteredValue: values,
        columnKey,
        prop,
        filterMethod: method,
      } = column
      const key = columnKey || prop
      if (values && values.length) {
        filters[key!] = values
        if (method) {
          return data.filter((row) => {
            return values.some((value: any) => method(value, row, column))
          })
        }
      }
      return data
    }, sortedData)
    state.filters = filters
    state.filteredData = filteredData
    state.data = filteredData
  },
}

export default {
  getInitState,
  actions,
  mutations,
}
