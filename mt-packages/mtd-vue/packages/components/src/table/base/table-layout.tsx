import scrollbarWidth from '../utils/scrollbar-width'
import { isServer } from '@utils/env'
import { nextTick } from '@ss/mtd-adapter'
import { IColumn } from '@components/table-column/types'
import { isString, isNumber } from '@utils/type'
import { ITable } from '../types'

class TableLayout {

  name?: string

  table!: ITable
  observers: any[]
  fit: boolean
  showHeader: boolean

  height?: number
  scrollX?: boolean
  scrollY?: boolean
  bodyWidth?: number
  totalWidth?: number
  fixedWidth?: number
  rightFixedWidth?: number
  tableHeight?: number
  headerHeight: number // Table Header Height
  appendHeight: number // Append Slot Height
  footerHeight: number // Table Footer Height
  viewportHeight?: number // Table Height - Scroll Bar Height
  bodyHeight?: number // Table Height - Table Header Height
  // Table Height - Table Header Height - Scroll Bar Height
  fixedBodyHeight?: number
  gutterWidth: number

  constructor(options: any) {

    // 初始化带上undefined一类的，否则没法监听
    this.height = undefined
    this.bodyWidth = undefined
    this.totalWidth = undefined
    this.bodyHeight = undefined
    this.fixedWidth = undefined
    this.rightFixedWidth = undefined
    this.tableHeight = undefined
    this.viewportHeight = undefined
    this.fixedBodyHeight = undefined

    this.observers = []
    this.fit = true
    this.showHeader = true

    this.scrollX = false
    this.scrollY = false
    this.headerHeight = 44 // Table Header Height
    this.appendHeight = 0 // Append Slot Height
    this.footerHeight = 44 // Table Footer Height
    // Table Height - Table Header Height - Scroll Bar Height
    this.gutterWidth = scrollbarWidth()
    for (const name in options) {
      if (Object.hasOwnProperty.call(options, name)) {
        (this as any)[name] = options[name]
      }
    }
    if (!this.table) {
      throw new Error('table is required for Table Layout')
    }
  }

  get columns(): IColumn[] {
    return this.table.store.states.columns
  }
  get visibleColumns(): IColumn[] {
    return this.table.store.states.visibleColumns
  }

  updateScrollY() {
    const height = this.height
    if (!isString(height) && !isNumber(height)) return
    const bodyWrapperRef = this.table!.bodyWrapperRef
    if (this.table.$el && bodyWrapperRef) {
      const prefixMTD = this.table.prefixMTD
      const body = bodyWrapperRef.querySelector(`.${prefixMTD}-table-body`) as HTMLElement
      this.scrollY = body.offsetHeight > this.bodyHeight!
    }
  }

  setHeight(value: string | number, prop = 'height') {
    if (isServer) return
    const el = this.table.$el as any
    if (isString(value) && /^\d+$/.test(value)) {
      value = Number(value)
    }
    this.height = value as number

    if (!el && (value || value === 0)) {
      nextTick(() => this.setHeight(value, prop))
      return
    }

    if (typeof value === 'number') {
      el.style[prop] = value + 'px'

      this.updateElsHeight()
    } else if (typeof value === 'string') {
      el.style[prop] = value
      this.updateElsHeight()
    }
  }

  setMaxHeight(value: string | number) {
    return this.setHeight(value, 'max-height')
  }

  updateElsHeight() {
    if (!this.table.ready) {
      nextTick(() => this.updateElsHeight())
      return
    }
    const headerWrapperRef = this.table.headerWrapperRef
    const appendWrapperRef = this.table.appendWrapperRef
    const footerWrapperRef = this.table.footerWrapperRef
    this.appendHeight = appendWrapperRef ? appendWrapperRef.offsetHeight : 0

    if (this.showHeader && !headerWrapperRef) return
    const headerHeight = (this.headerHeight = !this.showHeader
      ? 0
      : headerWrapperRef!.offsetHeight)
    if (
      this.showHeader &&
      headerWrapperRef!.offsetWidth > 0 &&
      (this.columns || []).length > 0 &&
      headerHeight < 2
    ) {
      nextTick(() => this.updateElsHeight())
      return
    }
    const tableHeight = (this.tableHeight = this.table.$el.clientHeight)
    if (
      this.height !== null &&
      (!isNaN(this.height!) || typeof this.height === 'string')
    ) {
      const footerHeight = (this.footerHeight = footerWrapperRef
        ? footerWrapperRef.offsetHeight
        : 0)
      this.bodyHeight =
        tableHeight - headerHeight - footerHeight + (footerWrapperRef ? 1 : 0)
    }
    this.fixedBodyHeight = this.scrollX
      ? this.bodyHeight! - this.gutterWidth
      : this.bodyHeight

    const noData = !this.table.data || this.table.data.length === 0
    this.viewportHeight = this.scrollX
      ? tableHeight - (noData ? 0 : this.gutterWidth)
      : tableHeight

    this.updateScrollY()
    this.notifyObservers('scrollable')
  }

  getFlattenColumns() {
    const flattenColumns: IColumn[] = []
    const columns: IColumn[] = this.columns || []
    columns.forEach((column) => {
      flattenColumns.push(column)
    })

    return flattenColumns
  }

  updateColumnsWidth() {
    if (isServer) return
    const fit = this.fit
    const bodyWidth = this.table.$el.clientWidth
    let bodyMinWidth = 0

    const flattenColumns = this.getFlattenColumns()
    const flexColumns = flattenColumns.filter(
      (column) => !isNumber(column.width),
    )

    // Clean those columns whose width changed from flex to unflex
    flattenColumns.forEach((column) => {
      if (isNumber(column.width) && column.realWidth) {
        column.realWidth = undefined
      }
    })

    if (flexColumns.length > 0 && fit) {
      flattenColumns.forEach((column) => {
        bodyMinWidth += column.width || column.minWidth || 80
      })

      const scrollYWidth = this.scrollY ? this.gutterWidth : 0

      if (bodyMinWidth <= bodyWidth - scrollYWidth) {
        // DON'T HAVE SCROLL BAR
        this.scrollX = false

        const totalFlexWidth = bodyWidth - scrollYWidth - bodyMinWidth

        if (flexColumns.length === 1) {
          flexColumns[0].realWidth =
            (flexColumns[0].minWidth || 80) + totalFlexWidth
        } else {
          const allColumnsWidth = flexColumns.reduce(
            (prev, column) => prev + (column.minWidth || 80),
            0,
          )
          const flexWidthPerPixel = totalFlexWidth / allColumnsWidth
          let noneFirstWidth = 0

          flexColumns.forEach((column, index) => {
            if (index === 0) return
            const flexWidth = Math.floor(
              (column.minWidth || 80) * flexWidthPerPixel,
            )
            noneFirstWidth += flexWidth
            column.realWidth = (column.minWidth || 80) + flexWidth
          })

          flexColumns[0].realWidth =
            (flexColumns[0].minWidth || 80) + totalFlexWidth - noneFirstWidth
        }
      } else {
        // HAVE HORIZONTAL SCROLL BAR
        this.scrollX = true
        flexColumns.forEach(function (column) {
          column.realWidth = column.minWidth
        })
      }

      this.bodyWidth = Math.max(bodyMinWidth, bodyWidth)
      this.table.resizeState.width = this.bodyWidth
    } else {
      flattenColumns.forEach((column) => {
        if (!column.width && !column.minWidth) {
          column.realWidth = 80
        } else {
          column.realWidth = column.width || column.minWidth
        }

        bodyMinWidth += column.realWidth!
      })
      this.totalWidth = bodyMinWidth
      this.scrollX = bodyMinWidth > bodyWidth

      this.bodyWidth = bodyMinWidth
    }

    const fixedColumns = this.table.store.states.fixedColumns

    if (fixedColumns.length > 0) {
      let fixedWidth = 0
      fixedColumns.forEach(function (column) {
        fixedWidth += column.realWidth! || column.width!
      })

      this.fixedWidth = fixedWidth
    }

    const rightFixedColumns = this.table.store.states.rightFixedColumns
    if (rightFixedColumns.length > 0) {
      let rightFixedWidth = 0
      rightFixedColumns.forEach(function (column) {
        rightFixedWidth += column.realWidth! || column.width!
      })

      this.rightFixedWidth = rightFixedWidth
    }

    // 横向虚拟滚动状态下 bodyWidth 将是实际渲染区域而非全部宽度
    if (this.table.horizontalVirtual) {
      let dynamicRenderWidth = 0 // 实际渲染区域宽度
      this.visibleColumns.forEach(col => {
        dynamicRenderWidth = dynamicRenderWidth + (col.realWidth! || col.width!)
      })
      this.bodyWidth = dynamicRenderWidth || bodyWidth
    }

    this.notifyObservers('columns')
  }

  addObserver(observer: Function) {
    this.observers.push(observer)
  }

  removeObserver(observer: Function) {
    const index = this.observers.indexOf(observer)
    if (index !== -1) {
      this.observers.splice(index, 1)
    }
  }

  notifyObservers(event: string) {
    const observers = this.observers
    observers.forEach((observer) => {
      switch (event) {
        case 'columns':
          observer.onColumnsChange(this)
          break
        case 'scrollable':
          observer.onScrollableChange(this)
          break
        default:
          throw new Error(`Table Layout don't have event ${event}.`)
      }
    })
  }
}

export default TableLayout
