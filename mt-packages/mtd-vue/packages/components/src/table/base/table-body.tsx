import {
  defineComponent,
  PropType,
  computed,
  toRefs,
  reactive,
  watch,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import {
  ITableStore,
} from '@components/table/types'
import {
  IColumn,
} from '@components/table-column/types'
import LayoutObserverHook from '../hook/layout-observer'
import MtdCheckbox from '@components/checkbox'
import MtdVirtual from '@components/virtual'
import MtdIcon from '@components/icon'
import { addClass, removeClass } from '@utils/dom'
import { isFunction, isString } from '@utils/type'
import { isServer } from '@utils/env'
import getElement from '@components/hooks/getElement'
import { getCell, getColumnByCell, getRowIdentity } from '../utils/index'
import { debounce } from 'throttle-debounce'
import { translateIntoProps, useAttrs } from '@components/hooks/pass-through'
// import column from '../store/column'

function defaultFindTreeColumnIndex(columns: IColumn[]) {
  return columns.findIndex((column) => {
    return column.type === 'default'
  })
}

export default defineComponent({
  name: 'MtdTableBody',
  components: {
    MtdCheckbox,
    MtdVirtual,
    MtdIcon,
  },
  props: {
    columns: {
      type: Array as PropType<IColumn[]>,
      required: true,
    },
    store: {
      type: Object as PropType<ITableStore>,
      required: true,
    },
    striped: Boolean,
    rowClass: [String, Function],
    rowStyle: [Object, Function],
    highlight: Boolean,
    tableStyle: {
      type: Object,
    },
    showSummary: {
      type: Boolean,
    },
  },
  emits: [],
  setup(props) {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('table-body'))
    const prefixTable = computed(() => config.getPrefixCls('table'))
    const el = getElement()
    const LayoutObserver = LayoutObserverHook()

    const state = reactive<{
      tooltipContent: string;
      tooltipVisible: boolean;
      hoverState?: {
        cell?: HTMLElement;
        column?: IColumn;
        row?: any;
      };
    }>({
      tooltipContent: '',
      tooltipVisible: false,
      hoverState: undefined,
    })

    // @Computed
    const currentRow = computed<any>(() => props.store.states.currentRow)
    const tree = computed<boolean>(() => LayoutObserver.table.value.tree)
    const data = computed<any[]>(() => props.store.states.data)
    const isComplex = computed<boolean>(() => props.store.states.isComplex)
    const isVerticalVirtual = computed(() => LayoutObserver.table.value.verticalVirtual)
    const virtualOptions = computed(() => LayoutObserver.table.value.virtualOptions)

    const maxHeight = () => {
      return isVerticalVirtual.value ? el.value?.offsetHeight : undefined
    }

    // @Watch
    watch(() => props.store.states.hoverRow, (newVal, oldVal) => {
      if (!isComplex.value || isServer) return
      if (!el.value) return
      const rows = el.value.querySelector('tbody')!.children
      const oldRow = rows[oldVal!]
      const newRow = rows[newVal!]
      oldRow && removeClass(oldRow, 'hover')
      newRow && addClass(newRow, 'hover')
    })

    // @Methods
    function getKeyOfRow(row: any, index: number) {
      const rowKey = LayoutObserver.table.value.rowKey
      if (rowKey) {
        return getRowIdentity(row, rowKey)
      }
      return index
    }

    /* function getColumnFixedType(index: number): string | boolean {
      if(index < props.store.states.fixedLeafColumns.length) {
        return 'left'
      } else if(index >= props.store.states.columns.length - props.store.states.rightFixedLeafColumns.length){
        return 'right'
      }
      return (
         ||
        
      )
    } */

    // 合并行列
    function getSpan(row: any, column: IColumn, rowIndex: number, columnIndex: number) {
      let rowspan = 1
      let colspan = 1

      const fn = LayoutObserver.table.value.rowColSpan
      if (typeof fn === 'function') {
        const result = fn({
          row,
          column,
          rowIndex,
          columnIndex,
        })
        if (result) {
          rowspan = result.rowspan
          colspan = result.colspan
        }
      }

      return {
        rowspan,
        colspan,
      }
    }

    function getRowStyle(row: any, rowIndex: number) {
      const rowStyle = LayoutObserver.table.value.rowStyle
      if (typeof rowStyle === 'function') {
        return rowStyle({
          row,
          rowIndex,
        })
      }
      return rowStyle
    }

    function getRowClass(row: any, rowIndex: number) {
      const classes = [`${prefixTable.value}-row`]

      if (props.highlight && currentRow.value === row) {
        classes.push(`${prefixTable.value}-current-row`)
      }
      if (props.striped && rowIndex % 2 === 1) {
        classes.push(`${prefixTable.value}-row-striped`)
      }
      const rowClass = LayoutObserver.table.value.rowClass
      if (typeof rowClass === 'string') {
        classes.push(rowClass)
      } else if (typeof rowClass === 'function') {
        classes.push(rowClass({ row, rowIndex }))
      }

      return classes.join(' ')
    }


    function getCellStyle(
      rowIndex: number,
      columnIndex: number,
      row: any,
      column: IColumn,
    ) {
      let result
      const cellStyle = LayoutObserver.table.value.cellStyle
      if (isFunction(cellStyle)) {
        result = cellStyle({
          rowIndex,
          columnIndex,
          row,
          column,
        })
      } else {
        result = cellStyle
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

    function getCellClass(
      rowIndex: number,
      columnIndex: number,
      row: any,
      column: IColumn,
    ) {
      const classes = [column.id, column.alignClass, column.className]

      if (column.fixed) {
        classes.push(`${prefixTable.value}-is-fixed-${column.fixed === 'right' ? 'right' : 'left'}`)
        if (column.isStickySide) {
          classes.push(`${prefixTable.value}-is-fixed-${column.fixed === 'right' ? 'right' : 'left'}-side`)
        }
      }
      if (column.type) {
        classes.push(`${prefixTable.value}-column-${column.type}`)
      }

      const cellClass = LayoutObserver.table.value.cellClass
      if (isString(cellClass)) {
        classes.push(cellClass)
      } else if (isFunction(cellClass)) {
        classes.push(
          cellClass({
            rowIndex,
            columnIndex,
            row,
            column,
          }),
        )
      }

      return classes.join(' ')
    }

    function handleCellMouseEnter(event: MouseEvent, row: any) {
      const table = LayoutObserver.table.value
      const cell = getCell(event)

      if (cell) {
        const column = getColumnByCell(table, cell)!
        const hoverState = { cell, column, row }
        const tooltipSelector = `.${prefixTable.value}-cell-tooltip`
        const overflowSelector = column.overflowSelector || tooltipSelector
        const element = (event.target as HTMLElement).querySelector(
          overflowSelector,
        )
        const tooltip =
          overflowSelector !== tooltipSelector
            ? (event.target as HTMLElement).querySelector(tooltipSelector)
            : element

        if (column.showOverflowTooltip && element) {
          const { scrollWidth, clientWidth } = element
          const tooltipVisible = scrollWidth > clientWidth
          if (tooltipVisible) {
            table.showTooltip(
              tooltip as HTMLElement,
              (element as HTMLElement).innerText,
            )
          }
        }
        state.hoverState = hoverState
        table.$emit('cell-mouse-enter', {
          event,
          row: hoverState.row,
          column: hoverState.column,
          cell: hoverState.cell,
        })
      }
    }

    function handleCellMouseLeave(event: MouseEvent) {
      const table = LayoutObserver.table.value
      table.hideTooltip()
      const cell = getCell(event)
      if (!cell) return
      const oldHoverState = state.hoverState || {}
      LayoutObserver.table.value.$emit('cell-mouse-leave', {
        event,
        row: oldHoverState.row,
        column: oldHoverState.column,
        cell: oldHoverState.cell,
      })
    }

    const handleMouseEnter = debounce(30, function (
      event: MouseEvent,
      row: any,
      index: number,
    ) {
      props.store.setHoverRow(index)
      LayoutObserver.table.value.$emit('row-mouse-enter', { event, row })
    })

    const handleMouseLeave = debounce(30, function (event: MouseEvent, row: any) {
      props.store.setHoverRow(undefined)
      LayoutObserver.table.value.$emit('row-mouse-leave', { event, row })
    })

    function handleContextMenu(event: Event, row: any) {
      handleEvent(event, row, 'contextmenu')
    }

    function handleDoubleClick(event: Event, row: any) {
      handleEvent(event, row, 'dblclick')
    }

    function handleClick(event: Event, row: any, $index: number) {
      if (props.highlight) {
        if (row !== currentRow.value) {
          props.store.setCurrentRow(row)
          LayoutObserver.table.value.$emit('current-change', row, currentRow.value)
        }
      }
      if (LayoutObserver.table.value.expandOnClickTr) {
        const { disabled } = props.store.getExpandPropsByItem(row, $index)
        !disabled && handleExpandClick(event, row, $index)
      }
      handleEvent(event, row, 'click')
    }

    function handleEvent(event: Event, row: any, name: string) {
      const table = LayoutObserver.table.value
      const cell = getCell(event)
      let column
      if (cell) {
        column = getColumnByCell(table, cell)
        if (column) {
          table.$emit(`cell-${name}`, { event, row, column, cell })
        }
      }
      table.$emit(`row-${name}`, { event, row, column })
    }

    function loadTreeData(row: any) {
      const loadData = LayoutObserver.table.value.loadData
      const { key } = row.$$mtd
      row.$$mtd.loading = true
      loadData!(row, props.store.createLoadDataCallback(key, row))
    }

    function handleExpandClick(e: Event, row: any, index: number) {
      e.stopPropagation()
      if (tree.value && row.$$mtd) {
        const { hasChild, childCount, expanded, loading, loaded } = row.$$mtd
        if (hasChild && !childCount && !expanded && !loading && !loaded) {
          loadTreeData(row)
        }
      }
      props.store.toggleRowExpansion(row, index)
    }

    function hasTooltip(column: IColumn) {
      return column.showOverflowTooltip || LayoutObserver.table.value.showOverflowTooltip
    }

    // USE 横向虚拟滚动

    const isHorizontalVirtual = computed(() => LayoutObserver.table.value.horizontalVirtual)
    const totalWidth = computed(() => (LayoutObserver.table.value.layout.totalWidth))
    function handleScroll(e: Event) {
      if (!isHorizontalVirtual.value) return

      LayoutObserver.table.value.handleHorizontalScroll(e)
    }

    const visibleColumns = computed(() => {
      return getVisibleColumns(props.columns)
    })

    function getVisibleColumns<T extends IColumn>(columns: T[]): T[] {
      if (isHorizontalVirtual.value) {
        return columns.filter(col => col.visible)
      } else {
        return columns
      }
    }

    const verticalVirtualProps = computed(() => {
      const temp: any = {}
      // 触发竖向虚拟滚动的条件

      temp.virtual = LayoutObserver.table.value.verticalVirtual
      if (isVerticalVirtual.value && virtualOptions.value && LayoutObserver.table.value.height) {
        temp.rowHeight = virtualOptions.value?.rowHeight
      }

      return useAttrs(temp).value
    })

    const computedCollection = {
      data, tree, maxHeight, verticalVirtualProps, visibleColumns, isHorizontalVirtual, totalWidth,
    }
    const methodsCollection = {
      getSpan, getRowStyle, getRowClass, getCellStyle, getCellClass, handleCellMouseEnter, handleCellMouseLeave,
      handleMouseEnter, handleMouseLeave, handleContextMenu, handleDoubleClick, handleClick, handleEvent, loadTreeData,
      handleExpandClick, hasTooltip, getKeyOfRow, handleScroll, getVisibleColumns,
    }

    const tableCollection = {
      findTreeColumnIndex: LayoutObserver.table.value.findTreeColumnIndex || defaultFindTreeColumnIndex,
      renderExpanded: LayoutObserver.table.value.renderExpanded,
      indent: LayoutObserver.table.value.indent,
      rowKey: LayoutObserver.table.value.rowKey,
    }

    return {
      ...toRefs(state),
      ...computedCollection,
      ...methodsCollection,
      prefix, prefixTable,
      ...tableCollection,
      ...LayoutObserver,
      el,
    }

  },
  render() {
    const {
      prefix, prefixTable, visibleColumns, tree, store, rowStyle, indent, rowKey,
      tableStyle, verticalVirtualProps, isHorizontalVirtual, totalWidth, striped,
      showSummary,
    } = this
    const renderColumn = (
      row: any,
      column: IColumn,
      $index: number,
    ) => {
      return column.renderCell.call(this, {
        row,
        column,
        $index,
        store: this.store,
        fixed: column.fixed,
      })
    }
    const renderTreeExpaned = (
      row: any,
      column: IColumn,
      $index: number,
    ) => {
      const { expanded, hasChild, level, loading } = row.$$mtd || {}
      const classes = [`${prefixTable}-tree-expand-icon`]
      !hasChild && classes.push(`${prefixTable}-is-fixed-left`)
      expanded && classes.push(`${prefixTable}-expand-icon-expanded`)
      return (
        <div
          class={classes}
          onClick={(e: Event) => this.handleExpandClick(e, row, $index)}
          style={{
            marginLeft: level > 0 ? `${level * indent}px` : 0,
          }}
        >
          {loading ? (
            <mtd-icon name={'loading'} />
          ) : (
            <mtd-icon name={'triangle-right'} />
          )}
        </div>
      )
    }
    const treeIndentIndex = !tree ? -1 : this.findTreeColumnIndex(visibleColumns)
    const data = store.states.data

    const renderTr = ({ row, index: $index }: { row: any, index: number }) => {
      return [
        <tr
          style={rowStyle ? this.getRowStyle(row, $index) : null}
          key={rowKey ? this.getKeyOfRow(row, $index) : $index}
          onDblclick={($event: Event) =>
            this.handleDoubleClick($event, row)
          }
          onClick={($event: Event) => this.handleClick($event, row, $index)}
          onContextmenu={($event: Event) =>
            this.handleContextMenu($event, row)
          }
          onMouseenter={($event: MouseEvent) =>
            this.handleMouseEnter($event, row, $index)
          }
          onMouseleave={($event: MouseEvent) =>
            this.handleMouseLeave($event, row)
          }
          class={[this.getRowClass(row, $index)]}
        >
          {visibleColumns.map((column, cellIndex) => {
            const { rowspan, colspan } = this.getSpan(
              row,
              column,
              $index,
              cellIndex,
            )
            if (!rowspan || !colspan) {
              return ''
            } else {
              return (
                <td
                  style={this.getCellStyle($index, cellIndex, row, column)}
                  class={this.getCellClass($index, cellIndex, row, column)}
                  rowspan={rowspan}
                  colspan={colspan}
                  onMouseenter={($event: MouseEvent) =>
                    this.handleCellMouseEnter($event, row)
                  }
                  onMouseleave={this.handleCellMouseLeave}
                >
                  <div class={`${prefixTable}-cell`}>
                    {cellIndex === treeIndentIndex &&
                      renderTreeExpaned(row, column, $index)}
                    {this.hasTooltip(column) ? (
                      <div class={`${prefixTable}-cell-tooltip`}>
                        {renderColumn(row, column, $index)}
                      </div>
                    ) : (
                      renderColumn(row, column, $index)
                    )}
                  </div>
                </td>
              )
            }
          })}
        </tr>,
        !tree && store.isExpanded(row, $index) ? (
          <tr>
            <td
              colspan={visibleColumns.length}
              class={`${prefixTable}-expanded-cell`}
            >
              <div class={`${prefixTable}-cell`}>
                {this.renderExpanded
                  ? this.renderExpanded({
                    row,
                    $index,
                    store: store,
                  })
                  : ''}
              </div>
            </td>
          </tr>
        ) : (
          ''
        ),
      ]
    }

    const renderColGroup = () => <colgroup>
      {visibleColumns.map((column) => {
        return <col name={column.id} />
      })}
    </colgroup>

    const tableProps = translateIntoProps({
      attrs: {
        cellspacing: '0',
        cellpadding: '0',
        border: '0',
      },
      class: {
        [prefix]: true,
        [prefix + '-striped']: striped,
      },
      style: tableStyle,
    })

    return <mtd-virtual
      class={{
        [`${prefix}-show-summary`]: showSummary,
      }}
      visible={true}
      view-tag="table"
      view-tag-props={tableProps}
      view-list-tag="tbody"
      data={data}
      renderItem={renderTr}
      {...verticalVirtualProps}
      height={this.maxHeight()}
      onScroll={this.handleScroll} // 🔥 动态绑定事件
    >

      {isHorizontalVirtual && <template slot="headerViewTag">
        <div style={{ width: totalWidth + 'px', float: 'left', height: 0 }} />
      </template>}

      <template slot="headerViewListTag">
        {renderColGroup()}
      </template>

    </mtd-virtual>

  },
})
