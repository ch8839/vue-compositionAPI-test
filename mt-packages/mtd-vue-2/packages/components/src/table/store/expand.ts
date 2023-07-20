import { getRowIdentity } from '../utils'
import {
  ITableState,
  ITableExpandState,
  Dispatch,
  ITableStore,
} from '../types/table-store'

function getInitState(): ITableExpandState {
  return {
    expandRowKeys: [],
    expandedKeysMap: {},
  }
}

const actions = {
  setExpandRowKeys(dispatch: Dispatch, expandRowKeys: string[]) {
    dispatch({ type: 'updateExpandRowKeys', payload: expandRowKeys })
  },
}

const mutations = {
  updateExpandRowKeys(
    state: ITableState,
    { payload: expandRowKeys }: { payload: string[] },
  ) {
    state.expandRowKeys = expandRowKeys
    state.expandedKeysMap = expandRowKeys.reduce((state, key) => {
      (state as any)[key] = true
      return state
    }, {})

    return state
  },
}

function bootstrap(store: ITableStore) {
  store.updateExpandRows = function () {
    const data = store.states.data
    const rowKey = store.states.rowKey
    const expandRowKeys = store.states.expandRowKeys
    if (rowKey && expandRowKeys.length) {
      const keys = data.reduce((state, row, index) => {
        const key = getRowIdentity(row, rowKey, index);
        (state )[key!] = true
        return state
      }, {});

      [...expandRowKeys].forEach((key) => {
        if (!keys[key]) {
          const index = expandRowKeys.indexOf(key)
          expandRowKeys.splice(index, 1)
        }
      })
    } else {
      expandRowKeys.splice(0, expandRowKeys.length)
    }
    // $emit update 事件会造成异步的重新 set，导致最终结果出错，故不能使用
    // store.table.$emit('update:expand-row-keys', expandRowKeys);
  }

  store.toggleRowExpansion = function (row, $index, expanded) {
    const { expandRowKeys, rowKey } = store.states
    const key = getRowIdentity(row, rowKey!, $index)
    const index = expandRowKeys.indexOf(key as string)

    const nowExpanded = index > -1
    const nextExpanded = expanded === undefined ? !nowExpanded : expanded
    const changed = nextExpanded !== nowExpanded
    if (changed) {
      if (nextExpanded) {
        expandRowKeys.push(key as string)
      } else {
        expandRowKeys.splice(index, 1)
      }
      store.$emit('expand-change', row, expandRowKeys,
        { expanded: nextExpanded })
      store.setExpandRowKeys(expandRowKeys)
      store.$emit('update:expandRowKeys', expandRowKeys)
    }
  }

  store.isExpanded = function (row, $index) {
    const { rowKey, expandedKeysMap } = store.states
    const key = getRowIdentity(row, rowKey!, $index)
    return expandedKeysMap[key!]
  }

  store.getExpandProps = function (row, $index) {
    const { expandable } = store
    return {
      expanded: store.isExpanded(row, $index),
      disabled: expandable ? !expandable(row, $index) : false,
    }
  }

  return store
}

export default {
  getInitState,
  actions,
  mutations,
  bootstrap,
}
