import { getValueByPath } from '@utils/util'
import { isObject, isString, isFunction } from '@utils/type'
import { ITable, RowKey } from '../types'
import { IColumn } from '@components/table-column/types'

export const getCell = function (event: Event) {
  let cell = event.target! as HTMLElement

  while (cell && cell.tagName.toUpperCase() !== 'HTML') {
    if (cell.tagName.toUpperCase() === 'TD') {
      return cell
    }
    cell = cell.parentNode as HTMLElement
  }

  return null
}

export const orderBy = function (
  array: any[],
  sortKey: string,
  reverse: string | number | undefined,
  sortMethod: Function | undefined,
  sortBy?: string | string[] | Function[],
) {
  const sortByBoolean = !sortBy || Array.isArray(sortBy)
  if (!sortKey && !sortMethod && sortByBoolean && !sortBy!.length) {
    return array
  }
  if (isString(reverse)) {
    reverse = reverse === 'descending' ? -1 : 1
  } else {
    reverse = reverse && reverse < 0 ? -1 : 1
  }
  const getKey = sortMethod
    ? null
    : function (value: any, index: number) {
      if (sortBy) {
        if (!Array.isArray(sortBy)) {
          sortBy = [sortBy]
        }
        return (sortBy as any[]).map(function (by: string | Function) {
          if (isString(by)) {
            return getValueByPath(value, by)
          } else {
            return (by as Function)(value, index, array)
          }
        })
      }
      if (sortKey !== '$key') {
        if (isObject(value) && '$value' in value) value = value.$value
      }
      return [isObject(value) ? getValueByPath(value, sortKey) : value]
    }
  const compare = function (a: any, b: any) {
    if (sortMethod) {
      return sortMethod(a.value, b.value)
    }
    for (let i = 0, len = a.key.length; i < len; i++) {
      if (a.key[i] < b.key[i]) {
        return -1
      }
      if (a.key[i] > b.key[i]) {
        return 1
      }
    }
    return 0
  }
  return array
    .map(function (value, index) {
      return {
        value: value,
        index: index,
        key: getKey ? getKey(value, index) : null,
      }
    })
    .sort(function (a, b) {
      let order = compare(a, b)
      if (!order) {
        // make stable https://en.wikipedia.org/wiki/Sorting_algorithm#Stability
        order = a.index - b.index
      }
      return order * (reverse as number)
    })
    .map((item) => item.value)
}

export const getColumnById = function (table: ITable, columnId: string) {
  return table.columns.find(function (item) {
    return item.id === columnId
  })
}

export const getColumnByCell = function (table: ITable, cell: any) {
  const regular = eval('/' + table.prefixMTD + `-table_[^\\s]+/gm`)
  const matches = (cell.className || '').match(regular)
  if (matches) {
    return getColumnById(table, matches[0])
  }
  return null
}

export const getRowIdentity = (
  row: any,
  rowKey: RowKey,
  index?: number,
): string | number | undefined => {
  if (!row) throw new Error('row is required when get row identity')
  if (isString(rowKey)) {
    if (rowKey.indexOf('.') < 0) {
      return row[rowKey]
    }
    const key = rowKey.split('.')
    let current = row
    for (let i = 0; i < key.length; i++) {
      current = current[key[i]]
    }
    return current
  } else if (isFunction(rowKey)) {
    return rowKey(row)
  }
  return index
}

export const doFlattenColumns = (columns: IColumn[]) => {
  const result: IColumn[] = []
  columns.forEach((column) => {
    if (column.children) {
      result.push(...doFlattenColumns(column.children))
    } else {
      result.push(column)
    }
  })
  return result
}
