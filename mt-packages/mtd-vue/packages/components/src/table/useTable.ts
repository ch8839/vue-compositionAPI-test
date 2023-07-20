import { computed, reactive, watch } from "@ss/mtd-adapter"
import { getRowIdentity } from './utils/index'
import { hasProp } from '@utils/vnode'
import {
  isString,
} from '@utils/type'
import { ITableSortOrder, RowKey } from './types'
import { TableProps } from './tablePropsType'
import vueInstance from "@components/hooks/instance"

const DEFAULT_TREE_FIELDNAME = {
  children: 'children',
  isLeaf: 'isLeaf',
}

function tryToNumber(v?: string | number): string | number | undefined {
  if (isString(v) && /^\d+$/.test(v)) {
    return parseInt(v)
  } else {
    return v
  }
}

export const useTable = (props: TableProps, ctx: any) => {

  const ins = vueInstance()

  const state = reactive({

    sortOrder: {},
    loadedKeys: [] as any[],
    expandRowKeys: [] as any[],

    isSortControlled: hasProp(ins, 'sortOrder'),
    isLoadedKeyControlled: hasProp(ins, 'loadedKeys'),
    isExpandedControlled: hasProp(ins, 'expandRowKeys'),
  })

  // @Computed
  const _sortOrder = computed(() => state.isSortControlled ? props.sortOrder : state.sortOrder)
  const _loadedKeys = computed(() => state.isLoadedKeyControlled ? props.loadedKeys : state.loadedKeys)
  const _expandRowKeys = computed(() => state.isExpandedControlled ? props.expandRowKeys : state.expandRowKeys)

  const table = computed(() => ins)
  const TREE_FIELD_NAMES = computed(() => {
    return {
      ...DEFAULT_TREE_FIELDNAME,
      ...(props.treeFieldNames || {}),
    }
  })

  const w = computed(() => tryToNumber(props.width))
  const h = computed(() => tryToNumber(props.height))
  const mh = computed(() => tryToNumber(props.maxHeight))

  // @Watch
  watch(() => props.data, (value, oldValue) => {
    if (!value) return
    if (!state.isExpandedControlled && props.defaultExpandAll && props.rowKey) {
      if (props.tree) {
        state.expandRowKeys = reduceTreeData(value, [])
      } else {
        state.expandRowKeys = (value as any[]).map(
          (item, index) => {
            return getRowIdentity(item, props.rowKey as RowKey, index)
          },
        )
      }
    }
    if (
      props.tree &&
      props.loadData &&
      !state.isLoadedKeyControlled &&
      value !== oldValue
    ) {
      const cachedRowKeys = reduceTreeData(value, [])
        .reduce(function (map: any, key: string) {
          map[key] = true
          return map
        }, {})
      state.loadedKeys = state.loadedKeys.filter(function (
        key: string,
      ) {
        return cachedRowKeys[key]
      })
    }
  }, { immediate: true })

  // @Methods
  function handleUpdateOrder(v: ITableSortOrder) {

    if (!state.isSortControlled) {
      state.sortOrder = v
    }
    ctx.emit('update:sortOrder', v)
  }
  function handleLoadedKeys(keys: string[]) {
    if (!state.isLoadedKeyControlled) {
      state.loadedKeys = keys
    }
    ctx.emit('update:loadedKeys', keys)
  }
  function handleExpand(keys: string[]) {
    if (!state.isExpandedControlled) {
      state.expandRowKeys = keys
    }
    ctx.emit('update:expandRowKeys', keys)
  }
  function reduceTreeData(data: any[], expandRowKeys: string[]) {
    const { children } = TREE_FIELD_NAMES.value
    return data.reduce((keys, item) => {
      if (item[children] && item[children].length && props.rowKey) {
        const key = getRowIdentity(item, props.rowKey)
        keys.push(key)
        reduceTreeData(item[children], keys)
      }
      return keys
    }, expandRowKeys)
  }
  // public methods
  /* function doReflow() {
    table.value.doReflow()
  }
  function scrollTo(...args: any[]) {
    table.value.scrollTo(...args)
  } */

  // 兼容 element，会触发相关事件，后续拆分到兼容包中
  function clearSelection() {
    table.value.store.clearSelection()
  }
  function toggleRowSelection(row: any, selected: boolean) {
    table.value.store.toggleRowSelection(row, selected)
  }
  function toggleAllSelection(selected: boolean) {
    table.value.store.toggleAllSelection(selected)
  }
  function toggleRowExpansion(row: any, expanded: boolean, $index: number) {
    table.value.store.toggleRowExpansion(row, $index, expanded)
  }
  function setCurrentRow() { }

  return {
    _treeFieldNames: TREE_FIELD_NAMES,

    _expandRowKeys,
    _sortOrder,
    _loadedKeys,

    _width: w,
    _height: h,
    _maxHeight: mh,

    handleUpdateOrder,
    handleLoadedKeys,
    handleExpand,

    // ******
    clearSelection, toggleRowSelection, toggleAllSelection, toggleRowExpansion, setCurrentRow,
  }
}

export default useTable
