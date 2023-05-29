import {
  defineComponent,
  PropType,
  computed,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import {
  ITableSortOrder,
  ITableStore,
} from '@components/table/types'
import {
  IColumn,
} from '@components/table-column/types'
import LayoutObserverHook from '../hook/layout-observer'

export default defineComponent({
  name: 'MtdTableFooter',
  props: {
    fixed: [String, Boolean],
    columns: {
      type: Array as PropType<IColumn[]>,
      required: true,
    },
    store: {
      type: Object as PropType<ITableStore>,
      required: true,
    },
    summaryMethod: Function,
    sumText: String,
    border: Boolean,
    sortOrder: {
      type: Object as PropType<ITableSortOrder>,
      default: () => {
        return {
          prop: '',
          order: undefined,
        }
      },
    },
  },
  emits: [],
  setup(props) {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('table-footer'))
    const prefixTable = computed(() => config.getPrefixCls('table'))
    const LayoutObserver = LayoutObserverHook()


    const hasGutter = computed<boolean>(() => !props.fixed && !!LayoutObserver.tableLayout.value.gutterWidth)


    const computedCollection = {
      hasGutter,
    }
    const methodsCollection = {

    }

    return {
      ...LayoutObserver,
      ...computedCollection,
      ...methodsCollection,
      prefix, prefixTable,
    }

  },
  render() {

    const {
      prefix, prefixTable, summaryMethod, columns, store, sumText, hasGutter,
    } = this

    let sums: Array<string | number | undefined> = []
    if (summaryMethod) {
      sums = summaryMethod({
        columns: columns,
        data: store.states.data,
      })
    } else {
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = sumText
          return
        }
        const values = store.states.data.map((item) =>
          Number(item[column.prop!]),
        )
        const precisions: number[] = []
        let notNumber = true
        values.forEach((value) => {
          if (!isNaN(value)) {
            notNumber = false
            const decimal = ('' + value).split('.')[1]
            precisions.push(decimal ? decimal.length : 0)
          }
        })
        const precision = Math.max.apply(null, precisions)
        if (!notNumber) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return parseFloat((prev + curr).toFixed(Math.min(precision, 20)))
            } else {
              return prev
            }
          }, 0)
        } else {
          sums[index] = ''
        }
      })
    }

    const TableTag = 'table' as any
    const ColTag = 'col' as any

    return <TableTag
      class={prefix}
      cellspacing="0"
      cellpadding="0"
      border="0"
    >
      <colgroup>
        {
          columns.map((column) => (
            <ColTag name={column.id} />
          ))
        }
        {
          hasGutter ? <ColTag name="gutter" /> : ''
        }
      </colgroup>
      <tbody>
        <tr>
          {columns.map((column, cellIndex) => {
            return (
              <td
                colspan={column.colSpan}
                rowspan={column.rowSpan}
                class={[
                  column.id,
                  column.alignClass,
                  column.className || '',
                  !column.children ? `${prefixTable}-is-leaf` : '',
                  column.labelClass,
                ]}
              >
                <div class={[`${prefixTable}-cell`, column.labelClass]}>
                  {sums[cellIndex]}
                </div>
              </td>
            )
          })}
          {hasGutter ? <td class={`${prefixTable}-gutter`}></td> : ''}
        </tr>
      </tbody>
    </TableTag>
  },
})
