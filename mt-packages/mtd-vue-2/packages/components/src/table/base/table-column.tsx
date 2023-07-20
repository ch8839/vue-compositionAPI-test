import {
  defineComponent,
  PropType,
  computed,
  toRefs,
  reactive,
  watch,
  onMounted,
  onUnmounted,
  nextTick,
  set,
  hasProp,
  vueInstance,
  getScopedSlotsInRender,
  getAllScopedSlots,
  getSlotsInRender,
  vSlots,
  VNode,
  toProps,
  getParentIns,
} from '@ss/mtd-adapter'

import useConfig from '@hooks/config'
import { getPropByPath, hasOwn } from '@utils/util'
import {
  ITable,
  TableRender,
  ExpandProps,
  TableHeaderRender,
} from '@components/table/types'
import {
  ITableColumn,
  TableType,
  TableAlign,
  IColumn,
  ITableFilter,
  ITableColumnSlots,
} from '@components/table-column/types'

import getElement from '@components/hooks/getElement'
import MtdIcon from '@components/icon'
import MtdCheckbox from '@components/checkbox'

let columnIdSeed = 1

const defaults = {
  default: {
    order: '',
  },
  selection: {
    width: 34,
    minWidth: 34,
    realWidth: 34,
    order: '',
  },
  expand: {
    width: 48,
    minWidth: 48,
    realWidth: 48,
    order: '',
  },
  index: {
    width: 48,
    minWidth: 48,
    realWidth: 48,
    order: '',
  },
}

const DEFAULT_RENDER_CELL: TableRender = ({ row, column, $index }) => {
  const property = column.prop

  const value = property && getPropByPath(row, property).v
  if (column && column.formatter) {
    return column.formatter(row, column, value, $index)
  }
  return value
}

const DEFAULT_RENDER_HEADER: TableHeaderRender = ({ column }) => {
  return column.label || ''
}


const getDefaultColumn = function (type: TableType, options: any) {
  const column: { [key: string]: any } = {}

  Object.assign(column, defaults['default'], type ? defaults[type] : {})
  for (const name in options) {
    if (hasOwn(options, name)) {
      const value = options[name]
      if (typeof value !== 'undefined') {
        column[name] = value
      }
    }
  }

  if (!column.minWidth) {
    column.minWidth = 80
  }

  /*  column.realWidth =
    column.width === undefined ? column.minWidth : column.width */

  return column
}

const parseWidth = (width?: any): number | undefined => {
  if (width !== undefined) {
    width = parseInt(width as string, 10)
    if (isNaN(width)) {
      width = undefined
    }
  }
  return width
}

const parseMinWidth = (minWidth?: any): number | undefined => {
  if (minWidth !== undefined) {
    minWidth = parseInt(minWidth as string, 10)
    if (isNaN(minWidth)) {
      minWidth = 80
    }
  }
  return minWidth
}

export default defineComponent({
  name: 'MtdTableColumn',
  components: {
    MtdIcon,
    MtdCheckbox,
  },
  inheritAttrs: false,
  props: {
    type: {
      type: String as PropType<TableType>,
      default: 'default',
    },
    label: String,
    className: String,
    labelClass: String,
    prop: String,
    width: String,
    minWidth: String,
    renderHeader: Function,
    sortable: {
      type: [String, Boolean],
      default: false,
    },
    sortMethod: {
      type: Function,
    },
    sortBy: [String, Function, Array],
    resizable: {
      type: Boolean,
      default: false,
    },
    context: {
      type: Object as PropType<any>,
      default: () => { },
    },
    columnKey: String,
    align: String,
    headerAlign: String as PropType<TableAlign>,
    fixed: [Boolean, String],
    formatter: Function,
    index: [Number, Function],
    sortOrders: {
      type: Array,
      default: () => {
        return ['ascending', 'descending', null]
      },
      validator: (val: string[]) => {
        return val.every(
          (order) => ['ascending', 'descending', null].indexOf(order) > -1,
        )
      },
    },
    showOverflowTooltip: {
      type: Boolean,
      default: null,
    },

    // to support: https://tt.sankuai.com/ticket/detail?id=4121738
    overflowSelector: String,

    filteredValue: Array,
    // 筛选时必须传递此方法
    filterMethod: {
      type: Function,
    },
    filters: {
      type: Array as PropType<ITableFilter[]>,
    },
    filterMultiple: {
      type: Boolean,
      default: true,
    },
    filterDropdownVisible: Boolean,
    showFilterActions: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['update:filteredValue', 'update:filterDropdownVisible'],

  setup(props, ctx) {

    const { emit, slots } = ctx
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('table-body'))
    const prefixTable = computed(() => config.getPrefixCls('table'))
    const ins = vueInstance()
    const el = getElement()

    const state = reactive({
      column: {} as IColumn,
      sFilteredValue: props.filteredValue || [],
      sFilterDropdownVisible: props.filterDropdownVisible || false,
    })

    // @Render
    const forced: {
      [key: string]: {
        [key: string]: any;
        renderHeader?: TableHeaderRender;
        renderCell: TableRender;
        sortable?: boolean;
        resizable?: boolean;
      };
    } = {
      default: {
        renderHeader(data) {
          const { column } = data
          const render: TableHeaderRender =
            column.$slots.header || DEFAULT_RENDER_HEADER
          return render(data)
        },
        renderCell(data) {
          const { column } = data
          const render = column.$slots.default || DEFAULT_RENDER_CELL
          return render(data)
        },
      },
      selection: {
        renderHeader: function (scope) {
          const store = scope.store
          const { isAllSelected, hasAnySelected, data } = store.states
          return <mtd-checkbox
            disabled={data && data.length === 0}
            indeterminate={hasAnySelected && !isAllSelected}
            value={isAllSelected}
            onInput={store.toggleAllSelection}
            onClick={(e: Event) => {
              e.stopPropagation()
            }}
          />
        },
        renderCell: function ({ row, column, store, $index }) {
          const hanlder = (checked: boolean) => {
            store.rowSelectedChanged(row, checked)
          }

          const props = {
            ...store.getCheckboxPropsByItem(row, $index),
          }

          const on = {
            change: hanlder,
          }

          const selection = column.$slots.selection

          if (selection) {
            return selection({ props, row, $index, on })
          } else {
            return <mtd-checkbox {...toProps(props)} on={on} />
          }

        },
        sortable: false,
        resizable: false,
      },
      index: {
        renderHeader: function ({ column }) {
          return column.label || '#'
        },
        renderCell: function ({ row, $index, column }) {
          const i = $index + 1
          const index = column.$slots.index
          if (index) {
            return index({ row, index: i, $index })
          }

          return <div>{i}</div>
        },
        sortable: false,
      },
      expand: {
        renderCell: function ({ row, column, store, $index }) {

          const props = store.getExpandPropsByItem(row, $index) as ExpandProps
          const { disabled, expanded } = props

          // this => table
          const toggle = (e: Event) => {
            this.handleExpandClick(e, row, $index)
          }
          if (disabled) {
            return ''
          }

          const expand = column.$slots.expand
          if (expand) {
            // todo: 确认 toggle 对外形式
            const scope = { ...props, row, $index, toggle }
            return expand(scope)
          }

          return (
            <div
              class={
                [`${prefixTable.value}-expand-icon`, (expanded ? `${prefixTable.value}-expand-icon-expanded` : '')]
              }
              onClick={toggle}
            >
              <MtdIcon name={'triangle-right'} />
            </div>
          )
        },
        // sortable: false,
        resizable: false,
      },
    }
    // @Computed
    const columnOrTableParent = computed<ITable | ITableColumn>(() => { // 🔥这里原本是ITableColumn
      let parent = getParentIns(ins)
      while (parent && !(parent as ITable).tableId && !(parent as ITableColumn).columnId) {
        parent = parent.$parent
      }
      return parent as ITable | ITableColumn
    })
    const columnId = computed(() => {
      const parent = columnOrTableParent.value
      const columnId =
        ((parent as ITable).tableId || (parent as ITableColumn).columnId) + 'm_column_' + columnIdSeed++
      return columnId
    })
    const owner = computed<ITable>(() => {
      // 🔥为什么不用provide的方式
      let parent = getParentIns(ins)
      while (parent && !(parent as ITable).tableId) {
        parent = parent.$parent
      }
      return parent as ITable
    })
    const isSubColumn = computed<boolean>(() => owner.value !== columnOrTableParent.value)
    const m_width = computed<number | undefined>(() => parseWidth(props.width))
    const m_minWidth = computed<number | undefined>(() => parseMinWidth(props.minWidth))
    const m_sortable = computed<boolean | string>(() => props.sortable === '' ? true : props.sortable)
    const m_fixed = computed<boolean | string | undefined>(() => props.fixed === '' ? true : props.fixed)
    const m_showOverflowTooltip = computed<boolean>(() => props.showOverflowTooltip === null
      ? owner.value.showOverflowTooltip
      : props.showOverflowTooltip)
    const m_overflowSelector = computed<string | undefined>(() => props.overflowSelector === null
      ? owner.value.overflowSelector
      : props.overflowSelector)
    const alignClass = computed<string | undefined>(() => props.align
      ? `${prefixTable.value}-text-` + props.align
      : undefined)
    const headerAlignClass = computed<string | undefined>(() => props.headerAlign
      ? `${prefixTable.value}-text-` + props.headerAlign
      : alignClass.value)

    const m_column = computed<IColumn>(() => {
      const option = {
        id: columnId.value,
        columnKey: props.columnKey,
        label: props.label,
        className: props.className,
        labelClass: props.labelClass,
        prop: props.prop,
        type: props.type,
        context: props.context,

        width: m_width.value,
        minWidth: m_minWidth.value,

        alignClass: alignClass.value,
        headerAlignClass: headerAlignClass.value,

        renderHeaderFn: props.renderHeader,
        formatter: props.formatter,

        fixed: m_fixed.value,

        sortable: m_sortable.value,
        sortMethod: props.sortMethod,
        sortOrders: props.sortOrders,
        showOverflowTooltip: m_showOverflowTooltip.value,
        overflowSelector: m_overflowSelector.value,
        filterable: props.filters || props.filterMethod,
        filters: props.filters,
        filterDropdownVisible: state.sFilterDropdownVisible,
        filteredValue: state.sFilteredValue,
        filterMethod: props.filterMethod,
        filterMultiple: props.filterMultiple,
        showFilterActions: props.showFilterActions,
        updateFilteredValue: updateFilteredValue,
        updateFilterDropdownVisible: updateFilterDropdownVisible,
        resizable: props.resizable,
        visible: true,

        $slots: slots,
      }

      const column = getDefaultColumn(props.type, option)
      Object.assign(column, forced['default'], props.type ? forced[props.type] : {})
      return column as IColumn
    })

    // @Watch
    watch(m_column, (n: any, v: any) => {
      Object.keys(n).forEach((k) => {
        const value = n[k]
        if (!v || value !== v[k]) {
          set(state.column, k, value)
        }
      })
      const props = ['width', 'minWidth', 'fixed']
      if (v && props.some((p) => n[p] !== v[p])) {
        owner.value.scheduleLayout(n['fixed'] !== v['fixed'])
      }
    }, { immediate: true })
    watch(() => props.filteredValue, (value: any) => {
      state.sFilteredValue = value
      state.column.filteredValue = value
    })
    watch(() => props.filterDropdownVisible, (visible: boolean) => {
      state.sFilterDropdownVisible = visible
      state.column.filterDropdownVisible = visible
    })

    //@Methods
    function updateFilteredValue(filteredValue: any) {
      emit('update:filteredValue', filteredValue)
      if (!hasProp(ins, 'filteredValue')) {
        state.sFilteredValue = filteredValue
        state.column.filteredValue = state.sFilteredValue
      }
    }
    function updateFilterDropdownVisible(filterDropdownVisible: boolean) {
      emit('update:filterDropdownVisible', filterDropdownVisible)
      if (!hasProp(ins, 'filterDropdownVisible')) {
        state.sFilterDropdownVisible = filterDropdownVisible
        state.column.filterDropdownVisible = state.sFilterDropdownVisible

      }
    }
    // computed 时 id 为空
    state.column.id = columnId.value
    if (props.type === 'expand') {
      if (owner.value.renderExpanded) {
        console.warn('[MTD warn][TableColumn] expand column only allow once')
      } else {
        owner.value.renderExpanded = (data) => {
          return getScopedSlotsInRender(ins, 'default')?.(data)// 🔥🔥注意这里slots的用法
        }
      }
    }

    onMounted(() => {
      nextTick(() => {
        const parent = columnOrTableParent.value
        let columnIndex: number

        // 🔥利用这种方式获得comlumnId是否合适？

        if (!isSubColumn.value) {
          columnIndex = ([] as HTMLElement[]).indexOf.call(
            ((parent as ITable).hiddenColumnsRef).children,
            el.value as HTMLElement,
          )
        } else {
          columnIndex = ([] as HTMLElement[]).indexOf.call(
            (parent as any).$el.children as HTMLCollection,
            el.value as HTMLElement,
          )
        }

        owner.value.store.insertColumn({
          column: state.column,
          index: columnIndex > -1 ? columnIndex : undefined,
          parent: isSubColumn.value ? (parent as ITableColumn).column : undefined,
        })
      })
    })

    onUnmounted(() => {
      if (!columnOrTableParent.value) return
      const parent = columnOrTableParent.value
      owner.value.store.removeColumn({
        column: state.column,
        parent: isSubColumn.value ? (parent as ITableColumn).column : undefined,
      })
    })


    const computedCollection = {
      columnId, isSubColumn,
    }
    const methodsCollection = {
      updateFilteredValue, updateFilterDropdownVisible,
    }

    return {
      ...toRefs(state),
      ...computedCollection,
      ...methodsCollection,
      prefix,
    }

  },
  render() {
    const children = getSlotsInRender(this, 'group')
    return <div>{children}</div>
  },
})
