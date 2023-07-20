import { getRowIdentity } from '../utils'
import {
  ITableSelectionState,
  ITableStore,
  ITableState,
  Dispatch,
} from '../types/table-store'
function getInitState(): ITableSelectionState {
  return {
    hasSelection: false,
    hasAnySelected: false,
    isAllSelected: false,
    selection: [],

    reserveSelection: false,
    CheckboxPropsCache: {},

    // fn
    selectable: undefined,
    // fn
    indexOfSelection: undefined,
  }
}

function updateSelectionColumn(states: ITableState): ITableState {
  const old = states.hasSelection
  const columns = states.columns
  states.hasSelection = !!columns.find((column) => {
    return column.type === 'selection'
  })
  if (old !== states.hasSelection) {
    computedSelection(states)
  }
  return states
}

function isSelected(states: ITableState, row: any): boolean {
  const indexOfSelection = states.indexOfSelection
  const selection = states.selection
  return indexOfSelection!(row, selection) > -1
}

function getCheckboxPropsByItem(states: ITableState, row: any, $index: number) {
  const selectable = states.selectable
  const rowKey = states.rowKey
  const CheckboxPropsCache = states.CheckboxPropsCache
  const id = getRowIdentity(row, rowKey!, $index)!
  if (!CheckboxPropsCache[id]) {
    CheckboxPropsCache[id] = {
      disabled: selectable ? !selectable(row, $index) : false,
    }
  }
  const value = isSelected(states, row)
  return {
    ...CheckboxPropsCache[id],
    value,
  }
}

function computedSelection(state: ITableState) {
  let hasAnySelected = false
  let isAllSelected = false
  const hasSelection = state.hasSelection
  const data = state.data

  if (hasSelection && data.length) {
    const enabledCheckbox = data
      .map((item, index) => {
        return getCheckboxPropsByItem(state, item, index)
      })
      .filter((item) => {
        return !item.disabled
      })
    if (enabledCheckbox.length) {
      hasAnySelected = enabledCheckbox.some((item) => {
        return item.value
      })
      isAllSelected = enabledCheckbox.every((item) => {
        return item.value
      })
    }
  }
  state.hasAnySelected = hasAnySelected
  state.isAllSelected = isAllSelected
  return state
}

const actions = {
  setSelection(dispatch: Dispatch, selection: any[]) {
    dispatch({ type: 'updateSelection', payload: selection })
  },
  setSelectable(dispatch: Dispatch, selectable: Function) {
    dispatch({ type: 'updateSelectable', payload: selectable })
  },
  setIndexOfSelection(dispatch: Dispatch, indexOfSelection: Function) {
    dispatch({ type: 'updateIndexOfSelection', payload: indexOfSelection })
  },
  setReserveSelection(dispatch: Dispatch, reserveSelection: boolean) {
    dispatch({ type: 'updateReserveSelection', payload: reserveSelection })
  },
  resetSelectable(dispatch: Dispatch) {
    dispatch({ type: 'resetSelectable' })
  },
}

const mutations = {
  updateData(state: ITableState) {
    state.CheckboxPropsCache = {}
    return computedSelection(state)
  },
  updateColumns(state: ITableState) {
    return updateSelectionColumn(state)
  },
  updateSelectable(
    state: ITableState,
    { payload: selectable }: { payload: any },
  ) {
    state.selectable = selectable
    state.CheckboxPropsCache = {}
    return state
  },
  resetSelectable(state: ITableState) {
    state.CheckboxPropsCache = {}
    return state
  },
  updateSelection(
    state: ITableState,
    { payload: selection }: { payload: any[] },
  ) {
    state.selection = selection
    return computedSelection(state)
  },
  updateIndexOfSelection(
    state: ITableState,
    { payload: indexOfSelection }: { payload: Function },
  ) {
    state.indexOfSelection = indexOfSelection as any
    return state
  },
  updateReserveSelection(
    state: ITableState,
    { payload: reserveSelection }: { payload: boolean },
  ) {
    state.reserveSelection = reserveSelection
    return state
  },
}

function bootstrap(store: ITableStore) {
  store.getCheckboxPropsByItem = function (row, $index) {
    return getCheckboxPropsByItem(store.states, row, $index)
  }
  store.isSelected = function (row) {
    return isSelected(store.states, row)
  }

  store.toggleRowSelection = function (row, selected) {
    const selection = store.states.selection
    const indexOfSelection = store.states.indexOfSelection
    const index = indexOfSelection!(row, selection)

    const nowSelected = index > -1
    const newSelected = selected === undefined ? !nowSelected : selected
    const changed = nowSelected !== newSelected

    if (changed) {
      if (newSelected) {
        selection.push(row)
      } else {
        selection.splice(index, 1)
      }
    }
    return changed
  }

  store.toggleAllSelection = function (selected) {
    const selection = store.states.selection
    const data = store.states.data
    const isAllSelected = store.states.isAllSelected
    const reserveSelection = store.states.reserveSelection

    const nextSelected = selected === undefined ? !isAllSelected : selected
    // todo 1.0 时需要更改为受控属性，不能直接操作
    if (!reserveSelection) {
      if (nextSelected) {
        data.forEach((item, index) => {
          const { disabled } = store.getCheckboxPropsByItem(item, index)
          if (!disabled && selection.indexOf(item) === -1) {
            selection.push(item)
          }
        })
      } else {
        selection.splice(0, selection.length)
      }
    } else {
      // 待处理的数据数组
      const shouldUpdateData = data.filter((item, index) => {
        const { disabled, value } = store.getCheckboxPropsByItem(item, index)
        return !disabled && value !== nextSelected
      })
      if (nextSelected) {
        selection.push(...shouldUpdateData)
      } else {
        const { indexOfSelection } = store.states
        shouldUpdateData.forEach((data) => {
          const index = indexOfSelection!(data, selection)
          if (index > -1) {
            selection.splice(index, 1)
          }
        })
      }
    }
    // computedSelection(store.states);
    store.$emit('select-all', selection)
    store.$emit('update:selection', selection)
    return true
  }

  store.rowSelectedChanged = function (row, selected) {
    const changed = store.toggleRowSelection(row, selected)
    if (changed) {
      store.$emit('select', store.states.selection, row)
      store.$emit('update:selection', store.states.selection)
    }
  }

  store.cleanSelection = function () {
    const { data, rowKey, selection } = store.states
    const keys = data.map((row) => {
      // 如果没有 rowkey 则拿当前 row 作为 key
      return getRowIdentity(row, rowKey!, undefined) || row
    })
    selection.forEach((select) => {
      const inData = keys.find((item) => {
        return item === select
      })
      if (!inData) {
        store.toggleRowSelection(select, false)
      }
    })
  }
  // 兼容 element
  store.clearSelection = function () {
    const selection = store.states.selection
    selection.splice(0)
    store.$emit('update:selection', selection)
  }
}

export default {
  getInitState,
  mutations,
  actions,
  bootstrap,
}
