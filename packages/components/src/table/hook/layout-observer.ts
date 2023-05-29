import {
  computed, ref, onMounted, onUpdated, onUnmounted, getParentIns,
} from '@ss/mtd-adapter'
import { ITable, ITableLayout } from '@components/table/types'
import { IColumn } from '@components/table-column/types'
import getElement from '@components/hooks/getElement'
import vueInstance from '@components/hooks/instance'

export const useLayoutObserver = () => {
  const ins = vueInstance()
  const el = getElement()

  const m__updated__ = ref(false)

  const table = computed<ITable>(() => {
    return getParentIns(ins) as ITable
  })
  const tableLayout = computed<ITableLayout>(() => {
    // let layout = (this as any).layout // 🔥一般不是空的吗 这里的类型正确吗
    let layout: any
    if (table.value) {
      layout = table.value.layout
    }
    if (!layout) {
      throw new Error('Can not find table layout.')
    }
    return layout
  })

  function onColumnsChange() {
    const cols = el.value!.querySelectorAll('colgroup > col')
    if (!cols.length) return
    const flattenColumns: IColumn[] = tableLayout.value.getFlattenColumns()
    const columnsMap: { [key: string]: IColumn } = {}
    flattenColumns.forEach((column) => {
      columnsMap[column.id] = column
    })
    for (let i = 0, j = cols.length; i < j; i++) {
      const col = cols[i]
      const name = col.getAttribute('name')
      const column = name && columnsMap[name]
      if (column) {
        col.setAttribute('width', String(column.realWidth || column.width))
      }
    }
  }

  function onScrollableChange(layout: ITableLayout) {
    const cols = el.value!.querySelectorAll('colgroup > col[name=gutter]')
    for (let i = 0, j = cols.length; i < j; i++) {
      const col = cols[i]
      col.setAttribute('width', layout.scrollY ? layout.gutterWidth : '0')
    }
    const ths = el.value!.querySelectorAll('th.gutter')
    for (let i = 0, j = ths.length; i < j; i++) {
      const th = ths[i] as HTMLElement // 🔥 这个类型对吗
      th.style.width = layout.scrollY ? layout.gutterWidth + 'px' : '0'
      th.style.display = layout.scrollY ? '' : 'none'
    }
  }

  tableLayout.value.addObserver(ins)
  onMounted(() => {
    onColumnsChange()
    onScrollableChange(tableLayout.value)
  })
  onUpdated(() => {
    if (m__updated__.value) return
    onColumnsChange()
    onScrollableChange(tableLayout.value)
    m__updated__.value = true
  })
  onUnmounted(() => {
    tableLayout.value.removeObserver(ins)
  })

  return {
    table,
    tableLayout,
    onColumnsChange,
    onScrollableChange,
  }

}

export default useLayoutObserver
