import { getRowIdentity, orderBy } from '../utils'
import {
  ITableTreeState,
  ITableStore,
  ITableState,
  Dispatch,
} from '../types/table-store'

function getInitState(): ITableTreeState {
  return {
    treeEnabled: false,
    treeData: [],
    loadedKeys: [],
    loadedKeysMap: {},
    loadData: undefined,
    treeFieldNames: {},
  }
}

// function loadTreeData (key, row, state, store) {
//   const { loadData } = state;

//   loadData(row, store.createLoadDataCallback(key, row));
// }
// eslint-disable-next-line
function updateTreeData(state: ITableState, store: ITableStore) {
  const { treeEnabled, ready } = state
  if (!treeEnabled || !ready) {
    return
  }
  const data = state.filteredData
  const rowKey = state.rowKey
  const expandedKeysMap = state.expandedKeysMap
  const treeFieldNames = state.treeFieldNames
  const loadData = state.loadData
  const loadedKeysMap = state.loadedKeysMap
  const sortingColumn = state.sortingColumn

  const { children, isLeaf } = treeFieldNames
  const { sortMethod, sortBy, sortable } = sortingColumn || {}
  const sort = sortable === true
  const {
    sortOrder: { order, prop },
  } = state

  const reduceTreeData = (array: any[], data: any, level: number) => {
    if (sort) {
      data = orderBy(data, prop!, order, sortMethod, sortBy)
    }

    return data.reduce((array: any[], row: any) => {
      array.push(row)
      const key = getRowIdentity(row, rowKey!) as string
      const childs = row[children]
      const length = childs && childs.length
      row.$$mtd = {
        ...row.$$mtd,
        key: key,
        level: level,
        hasChild: length || (loadData && !row[isLeaf]),
        expanded: expandedKeysMap[key],
        loaded: loadedKeysMap[key],
        childCount: length,
      }
      if (length && row.$$mtd.expanded) {
        return reduceTreeData(array, childs || [], level + 1)
      }
      return array
    }, array)
  }

  const nextData = reduceTreeData([], data, 0)

  state.data = nextData
}

const actions = {
  setTreeEnabled(dispatch: Dispatch, treeEnabled: boolean) {
    dispatch({ type: 'updateTreeState', payload: { treeEnabled } })
  },
  setLoadedKeys(dispatch: Dispatch, loadedKeys: string[]) {
    dispatch({ type: 'updateLoadedKeys', payload: loadedKeys })
  },
  setTreeFieldNames(dispatch: Dispatch, treeFieldNames: any) {
    dispatch({ type: 'updateTreeState', payload: { treeFieldNames } })
  },
  setLoadData(dispatch: Dispatch, loadData: Function) {
    dispatch({ type: 'updateTreeState', payload: { loadData } })
  },
}

const mutations = {
  updateTreeState(state: ITableState, { payload }: { payload: any }) {
    const store = (this as any) as ITableStore
    Object.assign(state, payload)
    updateTreeData(state, store)
  },
  // eslint-disable-next-line
  updateData(state: ITableState, { payload: data }: { payload: any }) {
    const store = (this as any) as ITableStore
    updateTreeData(state, store)
  },
  computedFilteredData(state: ITableState) {
    const store = (this as any) as ITableStore
    updateTreeData(state, store)
  },
  updateExpandRowKeys(state: ITableState) {
    const store = (this as any) as ITableStore
    updateTreeData(state, store)
  },
  updateLoadedKeys(
    state: ITableState,
    { payload: loadedKeys }: { payload: string[] },
  ) {
    state.loadedKeys = loadedKeys
    state.loadedKeysMap = loadedKeys.reduce((map, key) => {
      map[key] = true
      return map
    }, {} as any)
  },
  updateLoadData(
    state: ITableState,
    { payload: loadData }: { payload: Function },
  ) {
    state.loadData = loadData
  },
}

function bootstrap(store: ITableStore) {
  store.getTreeExpandProps = function (row, $index) {
    return {
      expanded: store.isExpanded(row, $index),
    }
  }
  store.createLoadDataCallback = function (key, row) {
    // eslint-disable-next-line
    // @ts-ignore
    // eslint-disable-next-line
    const that = this
    return function callbak(data: any[]) {
      row.$$mtd.loading = false
      const {
        $emit,
        states: {
          originData,
          loadedKeys,
          treeFieldNames: { children },
        },
      } = that
      $emit('update:loadedKeys', [...loadedKeys, key])
      row[children] = data
      // force update
      store.setData(originData)
    }
  }
}
export default {
  getInitState,
  actions,
  mutations,
  bootstrap,
}
