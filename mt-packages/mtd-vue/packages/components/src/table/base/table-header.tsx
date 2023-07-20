import {
  defineComponent,
  PropType,
  computed,
  toRefs,
  reactive,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import {
  ITableStore,
  ITableState,
} from '@components/table/types'
import {
  IColumn,
} from '@components/table-column/types'
import FilterPanel from '../base/filter-panel'
import LayoutObserverHook from '../hook/layout-observer'
import MtdCheckbox from '@components/checkbox'
import MtdPopover from '@components/popover'
import { isFunction, isString } from '@utils/type'
import { isServer } from '@utils/env'
import getElement from '@components/hooks/getElement'
import { hasClass, addClass, removeClass } from '@utils/dom'
import { getScopedSlotsInRender } from '@utils/slots'



const getAllColumns = (columns: IColumn[]) => {
  const result: IColumn[] = []
  columns.forEach((column) => {
    if (column.children) {
      result.push(column)
      result.push(...getAllColumns(column.children))
    } else {
      result.push(column)
    }
  })
  return result
}

interface Column extends IColumn {
  colSpan: number;
  rowSpan: number;
  level: number;
  children?: Column[];
}
const convertToRows = (originColumns: IColumn[]): Column[][] => {
  let maxLevel = 1
  const traverse = (column: Column, parent?: Column) => {
    if (parent) {
      column.level = parent.level + 1
      if (maxLevel < column.level) {
        maxLevel = column.level
      }
    }
    if (column.children) {
      let colSpan = 0
      column.children.forEach((subColumn) => {
        traverse(subColumn, column)
        colSpan += subColumn.colSpan
      })
      column.colSpan = colSpan
    } else {
      column.colSpan = 1
    }
  }

  originColumns.forEach((column) => {
    column.level = 1
    traverse(column as Column)
  })

  const rows: Column[][] = []
  for (let i = 0; i < maxLevel; i++) {
    rows.push([])
  }

  const allColumns = getAllColumns(originColumns)

  allColumns.forEach((column: any) => {
    if (!column.children) {
      column.rowSpan = maxLevel - column.level + 1
    } else {
      column.rowSpan = 1
    }
    rows[column.level - 1].push(column)
  })

  return rows
}

export default defineComponent({
  name: 'MtdTableHeader',
  components: {
    MtdCheckbox,
    MtdPopover,
    FilterPanel,
  },
  props: {
    fixed: [String, Boolean],
    states: {
      type: Object as PropType<ITableState>,
      required: true,
    },
    store: {
      type: Object as PropType<ITableStore>,
      required: true,
    },
    border: Boolean,
  },


  emits: [],
  setup(props) {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('table-header'))
    const prefixTable = computed(() => config.getPrefixCls('table'))
    const el = getElement()
    const LayoutObserver = LayoutObserverHook()

    const state = reactive<{
      draggingColumn?: Column;
      dragging: boolean;
      dragState: {
        startMouseLeft?: number;
        startLeft?: number;
        startColumnLeft?: number;
        tableLeft?: number;
        startColumnWidth?: number;
        left?: number;
      };
      resizeTimer: number;
      draggingDivider?: HTMLElement;
    }>({
      draggingColumn: undefined,
      dragging: false,
      dragState: {},
      resizeTimer: 0,
      draggingDivider: undefined,
    })

    const hasGutter = computed<boolean>(() => !props.fixed && !!LayoutObserver.tableLayout.value.gutterWidth)

    function renderSortIcon(column: Column) {
      const { sortOrder = {} } = props.store.states
      let order
      if (sortOrder.prop && sortOrder.prop === column.prop) {
        order = sortOrder.order
      }

      // 🔥🔥 这里怎么写
      const scoped = {
        order,
        change: ($event: Event) => handleSortClick($event, column),
      }

      const TableScopedSlots = getScopedSlotsInRender(LayoutObserver.table.value, 'sortIcon')
      if (TableScopedSlots) {
        return TableScopedSlots(scoped)
      }
      // todo: 跟设计确认是否此处需要支持点击排序
      return (
        <span class={`${prefixTable.value}-sortable`} onClick={scoped.change}>
          <i class={`${prefixTable.value}-sortable-icon ${prefixTable.value}-sortable-ascending`} />
          <i class={`${prefixTable.value}-sortable-icon ${prefixTable.value}-sortable-descending`} />
        </span>
      )
    }
    /*     function isCellFixed(index: number, columns: Column[]) {
      let start = 0
      for (let i = 0; i < index; i++) {
        start += columns[i].colSpan
      }
      const after = start + columns[index].colSpan - 1
      const leftFixedLeafCount = props.store.states.fixedLeafColumns.length
      const rightFixedLeafCount = props.store.states.rightFixedLeafColumns
        .length
      const columnsCount = props.store.states.columns.length
      if (props.fixed === true || props.fixed === 'left') {
        return after >= leftFixedLeafCount
      } else if (props.fixed === 'right') {
        return start < columnsCount - rightFixedLeafCount
      } else {
        return (
          after < leftFixedLeafCount ||
          start >= columnsCount - rightFixedLeafCount
        )
      }
    } */
    function getHeaderRowStyle(rowIndex: number) {
      const headerRowStyle = LayoutObserver.table.value.headerRowStyle
      if (isFunction(headerRowStyle)) {
        return headerRowStyle({ rowIndex })
      }
      return headerRowStyle
    }
    function getHeaderRowClass(rowIndex: number) {
      const classes = []

      const headerRowClass = LayoutObserver.table.value.headerRowClass
      if (isString(headerRowClass)) {
        classes.push(headerRowClass)
      } else if (isFunction(headerRowClass)) {
        classes.push(headerRowClass({ rowIndex }))
      }

      return classes.join(' ')
    }
    function getHeaderCellStyle(
      rowIndex: number,
      columnIndex: number,
      row: any,
      column: Column,
    ) {
      let result
      const headerCellStyle = LayoutObserver.table.value.headerCellStyle
      if (typeof headerCellStyle === 'function') {
        result = headerCellStyle({
          rowIndex,
          columnIndex,
          row,
          column,
        })
      } else {
        result = headerCellStyle
      }


      // 固定列的偏移
      const styleObj: any = {}
      if (column.fixed) {
        if (column.fixed == 'right') {
          styleObj.right = column.stickyOffset + 'px'
        } else {
          styleObj.left = column.stickyOffset + 'px'
        }
      }

      return Object.assign(result || {}, styleObj)
    }
    function getHeaderCellClass(
      rowIndex: number,
      columnIndex: number,
      row: any,
      column: Column,
    ) {
      const classes = [
        column.id,
        // column.order,
        column.headerAlignClass,
        column.className,
        column.labelClass,
      ]

      if (column.sortable) {
        classes.push(`${prefixTable.value}-column-has-actions`)
      }
      if (column.filterable) {
        classes.push(`${prefixTable.value}-column-has-filters`)
      }
      if (rowIndex === 0 && column.fixed) {
        classes.push(`${prefixTable.value}-is-fixed-${column.fixed === 'right' ? 'right' : 'left'}`)
        if (column.isStickySide) {
          classes.push(`${prefixTable.value}-is-fixed-${column.fixed === 'right' ? 'right' : 'left'}-side`)
        }
      }
      if (column.type) {
        classes.push(`${prefixTable.value}-column-${column.type}`)
      }
      if (!column.children) {
        classes.push(`${prefixTable.value}-is-leaf`)
      }

      if (column.sortable) {
        classes.push(`${prefixTable.value}-is-sortable`)
      }

      const { sortOrder = {} } = props.store.states
      if (column.sortable && sortOrder.prop && sortOrder.prop === column.prop) {
        classes.push(sortOrder.order)
      }

      const headerCellClass = LayoutObserver.table.value.headerCellClass
      if (typeof headerCellClass === 'string') {
        classes.push(headerCellClass)
      } else if (typeof headerCellClass === 'function') {
        classes.push(
          headerCellClass({
            rowIndex,
            columnIndex,
            row,
            column,
          }),
        )
      }

      return classes.join(' ')
    }
    function handleHeaderClick(event: Event, column: Column) {
      if (column.sortable) {
        handleSortClick(event, column)
      }
      LayoutObserver.table.value.emitter.emit('header-click', { event, column })
    }
    function handleHeaderContextMenu(event: Event, column: Column) {
      LayoutObserver.table.value.emitter.emit('header-contextmenu', event, column)
    }
    function handleMouseDown(event: MouseEvent, column: Column) {
      if (isServer) return
      if (column.children && column.children.length > 0) return
      /* istanbul ignore if */
      if (state.draggingColumn) {
        state.dragging = true

        const table = LayoutObserver.table.value
        const tableEl = table.$el
        const tableLeft = tableEl.getBoundingClientRect().left
        const columnEl = el.value!.querySelector(`th.${column.id}`) as HTMLElement
        const dividerEl = columnEl.querySelector('.divider') as HTMLElement
        const columnRect = columnEl.getBoundingClientRect()
        const minLeft = columnRect.left - tableLeft + 30
        const borderWidth = table.bordered ? 1 : 0
        addClass(columnEl, 'noclick')
        addClass(dividerEl, 'active')

        state.draggingDivider = dividerEl
        state.dragState = {
          startMouseLeft: event.clientX,
          startLeft: columnRect.right - tableLeft,
          startColumnLeft: columnRect.left - tableLeft,
          tableLeft,
          startColumnWidth: column.width!,
        }
        const { resizeImmediate } = table
        const resizeProxyRef = table.$refs.resizeProxyRef as HTMLElement
        if (!resizeImmediate) {
          table.resizeProxyVisible = true
          resizeProxyRef.style.left =
            state.dragState.startLeft! - 2 * borderWidth + 'px'
        }
        state.dragState.left = state.dragState.startLeft
        document.onselectstart = function () {
          return false
        }
        document.ondragstart = function () {
          return false
        }

        const handleMouseMove = (event: MouseEvent) => {
          const { startMouseLeft, startLeft, startColumnLeft } = state.dragState

          const deltaLeft = event.clientX - startMouseLeft!
          const proxyLeft = Math.max(minLeft, startLeft! + deltaLeft)
          state.dragState.left = proxyLeft
          if (!resizeImmediate) {
            resizeProxyRef.style.left = `${proxyLeft - borderWidth}px`
            state.draggingDivider!.style.left = `${proxyLeft! - startColumnLeft!
              }px`
          } else {
            const columnWidth = proxyLeft - startColumnLeft!
            column.width = column.realWidth = columnWidth
            table.doReflow()
          }
        }

        const handleMouseUp = () => {
          if (state.dragging) {
            const { startColumnLeft, startLeft, left } = state.dragState
            const columnWidth = left! - startColumnLeft!
            column.width = column.realWidth = columnWidth
            table.resizeProxyVisible = false
            table.$emit(
              'header-dragend',
              column.width,
              startLeft! - startColumnLeft!,
              column,
              event,
            )

            table.scheduleLayout()
            handleDragEnd()
          }

          document.removeEventListener('mousemove', handleMouseMove)
          document.removeEventListener('mouseup', handleMouseUp)
          document.onselectstart = null
          document.ondragstart = null

          setTimeout(function () {
            removeClass(columnEl, 'noclick')
          }, 0)
        }

        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
      }
    }
    function handleMouseMove(event: MouseEvent, column: Column, cellIndex: number) {
      if (column.children && column.children.length > 0) return
      if (!column || !column.resizable) return

      let target = event.target as HTMLElement
      while (target && target.tagName !== 'TH') {
        target = target.parentNode as HTMLElement
      }
      const columns = props.store.states.columns
      if (!state.dragging) {
        const rect = target.getBoundingClientRect()
        const bodyStyle = document.body.style
        if (rect.width > 12 && rect.right - event.pageX < 8) {
          bodyStyle.cursor = 'col-resize'
          if (hasClass(target, `${prefixTable.value}-column-has-actions`)) {
            target.style.cursor = 'col-resize'
          }
          state.draggingColumn = column
        } else if (
          cellIndex > 0 &&
          rect.width > 12 &&
          event.pageX - rect.left < 20
        ) {
          const index = columns.indexOf(column)
          if (index > -1) {
            const prevColumn = columns[index - 1]
            const elItem = el.value!.querySelector(`.${prevColumn.id} .divider`) as HTMLElement
            addClass(elItem, 'hover')
          }
          state.draggingColumn = undefined
        } else if (!state.dragging) {
          bodyStyle.cursor = ''
          if (hasClass(target, `${prefixTable.value}-column-has-actions`)) {
            target.style.cursor = 'pointer'
          }
          const elItem = el.value!.querySelector('.divider.hover') as HTMLElement
          elItem && removeClass(elItem, 'hover')
          state.draggingColumn = undefined
        }
      }
    }
    function handleMouseOut() {
      if (isServer) return
      if (!state.dragging) {
        document.body.style.cursor = ''
      }
    }
    function handleDragEnd() {
      if (!state.dragging) {
        return
      }
      document.body.style.cursor = ''
      removeClass(state.draggingDivider!, 'active')
      state.draggingDivider!.style.left = ''
      state.draggingDivider = undefined
      state.dragging = false
      state.draggingColumn = undefined
      state.dragState = {}
      // this.table.resizeProxyVisible = false;
    }
    function toggleOrder(order: string) {
      return !order ? 'ascending' : order === 'ascending' ? 'descending' : null
    }

    // 排序按钮
    function handleSortClick(
      event: Event,
      column: Column,
      givenOrder?: 'ascending' | 'descending',
    ) {
      event.stopPropagation()
      let target = event.target as HTMLElement
      while (target && target.tagName !== 'TH') {
        target = target.parentNode as HTMLElement
      }
      if (target && target.tagName === 'TH') {
        if (hasClass(target, 'noclick')) {
          removeClass(target, 'noclick')
          return
        }
      }

      if (!column.sortable) return
      const { sortOrder, sortingColumn, filters } = props.store.states
      const nextSortOrder = {
        prop: column.prop,
        order: givenOrder || column.sortOrders![0],
      }
      if (!givenOrder && sortingColumn === column) {
        const nowOrder = sortOrder.order
        const nextOrderIndex =
          (column.sortOrders.indexOf(nowOrder!) + 1) % column.sortOrders.length
        nextSortOrder.order = column.sortOrders[nextOrderIndex]
      }
      const tableEmitter = LayoutObserver.table.value.emitter

      tableEmitter.emit('update:sortOrder', nextSortOrder)

      const sorter = { column, ...nextSortOrder }
      tableEmitter.emit('sort-change', sorter)
      tableEmitter.emit('change', filters, sorter)
    }

    function handleMouseEnter(event: Event, column: Column) {
      clearTimeout(state.resizeTimer)
      if (column.resizable) {
        addClass(
          event.currentTarget as HTMLElement,
          `${prefixTable.value}-column-resizable`,
        )
      }
    }
    function handleMouseLeave(event: Event, column: Column) {
      if (column.resizable) {
        state.resizeTimer = setTimeout(() => {
          removeClass(
            event.currentTarget as HTMLElement,
            `${prefixTable.value}-column-resizable`,
          )
        }, 50)
      }
    }

    function setTableIsGroup(v: boolean) {
      LayoutObserver.table.value.isGroup = v
    }

    function getVisibleColumns<T extends IColumn>(columns: T[]): T[] {
      if (LayoutObserver.table.value.horizontalVirtual) {
        return columns.filter(col => col.visible)
      } else {
        return columns
      }
    }

    const computedCollection = {
      hasGutter,
    }
    const methodsCollection = {
      renderSortIcon, getHeaderRowStyle, getHeaderRowClass, getHeaderCellStyle,
      getHeaderCellClass, handleHeaderClick, handleHeaderContextMenu, handleMouseDown, setTableIsGroup,
      handleMouseMove, handleMouseOut, handleDragEnd, toggleOrder, handleSortClick, handleMouseEnter, handleMouseLeave,
      getVisibleColumns,
    }

    return {
      ...toRefs(state),
      ...computedCollection,
      ...methodsCollection,
      prefix, prefixTable,
      ...LayoutObserver,
    }

  },
  render() {
    const {
      prefix, prefixTable, store, hasGutter, fixed,
    } = this
    const originColumns = store.states.originColumns
    const columnRows = convertToRows(originColumns)
    const columns = store.states.columns

    const isGroup = columnRows.length > 1

    if (isGroup) this.setTableIsGroup(true)
    return <table class={prefix} cellspacing="0" cellpadding="0">
      <colgroup>
        {this.getVisibleColumns(columns).map((column) => {
          return <col name={column.id} />
        })}
        {
          hasGutter ? <col name="gutter" width="0" /> : ''
        }
      </colgroup>
      <thead>
        {columnRows.map((columns, rowIndex) => {
          return (
            <tr
              style={this.getHeaderRowStyle(rowIndex)}
              class={this.getHeaderRowClass(rowIndex)}
            >
              {this.getVisibleColumns(columns).map((column, cellIndex) => {
                return (
                  <th
                    colspan={column.colSpan}
                    rowspan={column.rowSpan}
                    onMouseenter={($event: MouseEvent) =>
                      this.handleMouseEnter($event, column)
                    }
                    onMouseleave={($event: MouseEvent) =>
                      this.handleMouseLeave($event, column)
                    }
                    onMousemove={($event: MouseEvent) =>
                      this.handleMouseMove($event, column, cellIndex)
                    }
                    onMouseout={this.handleMouseOut}
                    onMousedown={($event: MouseEvent) =>
                      this.handleMouseDown($event, column)
                    }
                    onClick={($event: Event) =>
                      this.handleHeaderClick($event, column)
                    }
                    onContextmenu={($event: Event) =>
                      this.handleHeaderContextMenu($event, column)
                    }
                    style={this.getHeaderCellStyle(
                      rowIndex,
                      cellIndex,
                      columns,
                      column,
                    )}
                    class={this.getHeaderCellClass(
                      rowIndex,
                      cellIndex,
                      columns,
                      column,
                    )}
                  >
                    <div class={[`${prefixTable}-cell`, column.labelClass]}>
                      {column.renderHeader
                        ? column.renderHeader.call(this, {
                          column,
                          $index: cellIndex,
                          store: store,
                          fixed: fixed,
                        })
                        : column.label}
                      {column.sortable ? this.renderSortIcon(column) : ''}
                      {column.filterable
                        ? <filter-panel
                          column={column}
                          disabled={
                            column.fixed === true
                              ? fixed !== 'left'
                              : column.fixed !== fixed
                          }
                          scopedSlots={{
                            'filter-icon': column.$slots['filter-icon'],
                            'filter-dropdown': column.$slots['filter-dropdown'],
                          }}
                        >
                        </filter-panel>
                        : ''
                      }
                    </div>

                    {column.resizable && <span class="divider" />}
                  </th>
                )
              })}
              {hasGutter ? <th class={`${prefixTable}-gutter`}></th> : ''}
            </tr>
          )
        })}
      </thead>
    </table>
  },
})
