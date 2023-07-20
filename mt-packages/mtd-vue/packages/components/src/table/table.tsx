import {
  defineComponent,
  computed,
  nextTick,
  markRaw,
  reactive,
  ref,
  watch,
  onMounted,
  onUnmounted,
  onActivated,
  toRefs,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import MtdLoading from '@components/loading'
import MtdTooltip from '@components/tooltip'
import { debounce } from 'throttle-debounce'
import { addResizeListener, removeResizeListener } from '@utils/resize-event'
import Mousewheel from './utils/mousewhee'

import TableLayout from './base/table-layout'
import TableBody from './base/table-body'
import TableHeader from './base/table-header'
import TableFooter from './base/table-footer'

import { createStore } from './store/index'
import { ITooltip } from '@components/tooltip/types'
import { IColumn } from '@components/table-column/types'
import { ITableStore } from '@components/table/types'
import vueInstance from '@components/hooks/instance'
import getElement from '@components/hooks/getElement'
import useTable from './useTable'

import tableProps from './tablePropsType'
import mitt, { Emitter } from '@utils/mitt'
import { useAttrs } from '@components/hooks/pass-through'
import { firstUpperCase } from '@utils/util'

import {
  Fragment,
} from '@ss/mtd-adapter'

let tableIdSeed = 1
const props = tableProps()
const emits = [
  'change',
  'row-mouse-enter',
  'row-mouse-leave',
  'current-change',
  'header-click',
  'header-contextmenu',
  'update:sortOrder',
  'sort-change',
  'row-contextmenu',
  'row-dblclick',
  'row-click',
  'row-mouse-enter',
  'row-mouse-leave',
  'cell-contextmenu',
  'cell-dblclick',
  'cell-click',
  'cell-mouse-enter',
  'cell-mouse-leave',
  'select-all',
  'update:selection',
  'select',
  'update:loadedKeys',
  'expand-change',
  'update:expandRowKeys',
]

export default defineComponent({
  name: 'MtdTable',
  directives: {
    Mousewheel, // 🔥这里和vue3有差别
  },

  components: {
    TableHeader,
    TableFooter,
    TableBody,
    MtdLoading,
    MtdTooltip,
    Fragment,
  },
  inheritAttrs: true,
  props,
  emits,
  setup(props, ctx) {

    const { emit } = ctx
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('table'))
    const prefixMTD = computed(() => config.getPrefix())

    // @Ohther
    const ins = vueInstance()
    const el = getElement()

    const bodyWrapperIns = ref<any | null>(null)
    const fixedBodyWrapperIns = ref<any | null>(null)
    const rightFixedBodyWrapperIns = ref<any | null>(null)
    const bodyWrapperRef = computed<HTMLElement | null>(() => bodyWrapperIns.value?.el)
    const headerWrapperRef = ref<HTMLElement | null>(null)
    const footerWrapperRef = ref<HTMLElement | null>(null)
    const appendWrapperRef = ref<HTMLElement | null>(null)
    const fixedBodyWrapperRef = computed<HTMLElement | null>(() => fixedBodyWrapperIns.value?.el)
    const rightFixedBodyWrapperRef = computed<HTMLElement | null>(() => rightFixedBodyWrapperIns.value?.el)
    const hiddenColumnsRef = ref<HTMLElement | null>(null)
    const tooltipRef = ref<ITooltip | null>(null)

    const TableHook = useTable(props, ctx)

    // @Data
    const layout = new TableLayout({
      table: ins,
      fit: props.fit,
      showHeader: props.showHeader,
    })

    const moudles = [
      {
        mutations: {
          updateColumns: () => {
            nextTick(doReflow)
          },
        },
      },
    ]

    const store = createStore(
      {
        $emit: emit,
        expandable: props.expandable,
      },
      moudles,
    )

    const tableId = `${prefix.value}_` + tableIdSeed++
    const debouncedUpdateLayout = markRaw(debounce(50, doReflow))
    const debounceResizeListener = markRaw(debounce(50, resizeListener))

    const state = reactive<{
      store: ITableStore
      layout: TableLayout
      hoverRow?: boolean
      isHidden: false
      renderExpanded?: Function
      resizeProxyVisible: boolean
      resizeState: {
        width?: number,
        height?: number,
      },
      isGroup: boolean
      scrollPosition: string
      CheckboxPropsCache: any
      tooltipContent: string
      tooltipVisible: boolean
      ready: boolean
      tableId: string
      debouncedUpdateLayout: Function
      debounceResizeListener: Function

      emitter: Emitter
    }>({
      store,
      layout,
      hoverRow: undefined,
      isHidden: false,
      renderExpanded: undefined,
      resizeProxyVisible: false,
      resizeState: {
        width: undefined,
        height: undefined,
      },
      // 是否拥有多级表头
      isGroup: false,
      scrollPosition: 'left',

      CheckboxPropsCache: {},
      // use in table-body
      tooltipContent: '',
      tooltipVisible: false,
      ready: false,

      tableId,
      debouncedUpdateLayout,
      debounceResizeListener,

      emitter: markRaw(mitt()),
    })

    // 基本上emit的动作不在table这个组件父层级上
    const specificEmits = {
      ['update:sortOrder']: (v: any[]) => { TableHook.handleUpdateOrder(v[0]) },
      ['update:loadedKeys']: TableHook.handleLoadedKeys,
      ['update:expandRowKeys']: TableHook.handleExpand,
    } as { [key: string]: (v: any) => void }

    emits.forEach(emitItem => {
      state.emitter.on(emitItem, (...args: any[]) => {
        specificEmits[emitItem]
          ? specificEmits[emitItem](args)
          : emit(emitItem, args)
      })
    })

    const syncStatesWatch = (watchWho: any, stateFunText: string) => {
      const stateFunName = firstUpperCase(stateFunText)
      watch(watchWho, (val: any) => {
        const fn = (state.store as any)[`set${stateFunName}`]
        if (!fn) {
          console.error('未找到同步函数', stateFunName)
        } else {
          fn(val)
        }
      }, { immediate: true, deep: true })
    }

    // @Computed
    const columns = computed<IColumn[]>(() => state.store.states.columns)
    const shouldUpdateHeight = computed<boolean>(() => (
      !!TableHook._height.value ||
      !!TableHook._maxHeight.value ||
      state.store.states.fixedColumns.length > 0 ||
      state.store.states.rightFixedColumns.length > 0
    ))
    const bodyWidth = computed<string>(() => {
      const { bodyWidth, scrollY, gutterWidth } = state.layout
      return bodyWidth ? bodyWidth - (scrollY ? gutterWidth : 0) + 'px' : ''
    })
    const bodyHeight = computed(() => {
      if (TableHook._height.value) {
        return {
          height: state.layout.bodyHeight ? state.layout.bodyHeight + 'px' : '',
        }
      } else if (TableHook._maxHeight.value) {
        const propsMaxHeight = Number(TableHook._maxHeight.value)
        return {
          'max-height':
            (props.showHeader
              ? propsMaxHeight -
              state.layout.headerHeight -
              state.layout.footerHeight
              : propsMaxHeight - state.layout.footerHeight) + 'px',
        }
      }
      return {}
    })
    const fixedBodyHeight = computed(() => {
      if (TableHook._height.value) {
        return {
          height: state.layout.fixedBodyHeight
            ? state.layout.fixedBodyHeight + 'px'
            : '',
        }
      } else if (TableHook._maxHeight.value) {
        const propsMaxHeight = Number(TableHook._maxHeight.value)
        let maxHeight = state.layout.scrollX
          ? propsMaxHeight - state.layout.gutterWidth
          : propsMaxHeight

        if (props.showHeader) {
          maxHeight -= state.layout.headerHeight
        }

        maxHeight -= state.layout.footerHeight

        return {
          'max-height': maxHeight + 'px',
        }
      }

      return {}
    })
    const fixedHeight = computed(() => {
      if (TableHook._maxHeight.value) {
        if (props.showSummary) {
          return {
            bottom: '0',
          }
        }
        const { data } = state.store.states
        return {
          bottom:
            state.layout.scrollX && data ? state.layout.gutterWidth + 'px' : '',
        }
      } else {
        if (props.showSummary) {
          return {
            height: state.layout.tableHeight
              ? state.layout.tableHeight + 'px'
              : '',
          }
        }
        return {
          height: state.layout.viewportHeight
            ? state.layout.viewportHeight + 'px'
            : '',
        }
      }
    })
    const isEmpty = computed<boolean>(() => {
      const { data } = state.store.states
      return !props.loading && (!data || !data.length)
    })

    // @Watch
    watch(() => props.expandable, (v) => {
      state.store.expandable = v
    })
    watch(TableHook._height, (v) => {
      v && state.layout.setHeight(v)
    }, { immediate: true })
    watch(TableHook._maxHeight, (v) => {
      v && state.layout.setMaxHeight(v)
    }, { immediate: true })
    watch(() => props.data, (v) => {
      state.store.setData(v)
    }, { immediate: true })
    watch(TableHook._expandRowKeys, (v) => {
      const fn = state.store[`setExpandRowKeys`]
      v && fn && fn(v)
      if (shouldUpdateHeight.value) {
        nextTick(() => {
          state.layout.updateElsHeight()
        })
      }
    }, {
      immediate: true,
      deep: true,
    })

    syncStatesWatch(() => props.tree, 'treeEnabled')
    syncStatesWatch(() => props.reserveSelection, 'reserveSelection')
    syncStatesWatch(() => props.selection, 'selection')
    syncStatesWatch(() => props.indexOfSelection, 'indexOfSelection')
    syncStatesWatch(() => props.checkboxable, 'selectable')
    syncStatesWatch(() => props.rowKey, 'rowKey')
    syncStatesWatch(() => props.currentRowKey, 'currentRowKey')
    syncStatesWatch(() => props.loadData, 'loadData')

    syncStatesWatch(TableHook._sortOrder, 'sortOrder')
    syncStatesWatch(TableHook._treeFieldNames, 'treeFieldNames')
    syncStatesWatch(TableHook._loadedKeys, 'loadedKeys')

    // @LifeCycle
    onMounted(() => {

      bindEvents()

      state.ready = true
      state.store.setReady(state.ready)

      doReflow()

      state.resizeState = {
        width: el.value!.offsetWidth,
        height: el.value!.offsetHeight,
      }
      fixSafariLayout()
    })

    onUnmounted(() => {
      if (state.debounceResizeListener) {
        removeResizeListener(el.value!, state.debounceResizeListener as any)
      }
    })

    onActivated(() => {
      fixSafariLayout()
    })


    // @Methods
    function fixSafariLayout() {
      if (
        /chrome/i.test(navigator.userAgent) ||
        !/safari/i.test(navigator.userAgent)
      ) {
        return
      }
      // see https://ones.sankuai.com/ones/product/4348/workItem/defect/detail/7533564
      if (el.value) {
        // 不走 vue 的生命周期
        const tables = [...el.value.querySelectorAll('table')] as any[] // 🔥 HTMLElement不行
        tables.forEach((table) => {
          table.style['table-layout'] = 'auto'
        })
        setTimeout(() => {
          tables.forEach((table) => {
            table.style['table-layout'] = ''
          })
        }, 20)
      }
    }

    function scheduleLayout(updateColumns: boolean) {
      if (updateColumns) {
        state.store.updateColumns()
      }
      debouncedUpdateLayout()
    }
    // dom event handle
    function handleMouseLeave() {
      state.store.setHoverRow(undefined)
    }

    function updateScrollY() {
      state.layout.updateScrollY()
      state.layout.updateColumnsWidth()
    }

    function handleFixedMousewheel(event: MouseEvent, data: any) {
      if (!bodyWrapperRef.value) return
      if (Math.abs(data.spinY) > 0) {
        const currentScrollTop = bodyWrapperRef.value.scrollTop
        if (data.pixelY < 0 && currentScrollTop !== 0) {
          event.preventDefault()
        }
        if (
          data.pixelY > 0 &&
          bodyWrapperRef.value.scrollHeight - bodyWrapperRef.value.clientHeight > currentScrollTop
        ) {
          event.preventDefault()
        }
        bodyWrapperRef.value.scrollTop += Math.ceil(data.pixelY / 5)
      } else {
        bodyWrapperRef.value.scrollLeft += Math.ceil(data.pixelX / 5)
      }
    }

    function handleHeaderFooterMousewheel(event: MouseEvent, data: any) {
      const { pixelX, pixelY } = data
      if (Math.abs(pixelX) >= Math.abs(pixelY)) {
        event.preventDefault()
        bodyWrapperRef.value!.scrollLeft += data.pixelX / 5
      }
    }

    function bindEvents() {

      bodyWrapperRef.value && bodyWrapperRef.value.addEventListener('scroll', function () {
        if (headerWrapperRef.value) headerWrapperRef.value.scrollLeft = this.scrollLeft
        if (footerWrapperRef.value) footerWrapperRef.value.scrollLeft = this.scrollLeft
        if (fixedBodyWrapperRef.value) {
          fixedBodyWrapperRef.value.scrollTop = this.scrollTop
        }
        if (rightFixedBodyWrapperRef.value) {
          rightFixedBodyWrapperRef.value.scrollTop = this.scrollTop
        }
        const maxScrollLeftPosition = this.scrollWidth - this.offsetWidth - 1
        const scrollLeft = this.scrollLeft
        // todo 可优化，目前会引起 table 的重新渲染
        if (scrollLeft >= maxScrollLeftPosition) {
          state.scrollPosition = 'right'
        } else if (scrollLeft === 0) {
          state.scrollPosition = 'left'
        } else {
          state.scrollPosition = 'middle'
        }
      })

      if (props.fit) {
        addResizeListener(el.value, debounceResizeListener)
      }
    }

    function resizeListener() {
      if (!state.ready || !el.value) return
      let shouldUpdateLayout = false
      const { width: oldWidth, height: oldHeight } = state.resizeState

      const width = el.value.offsetWidth
      if (oldWidth !== width) {
        shouldUpdateLayout = true
      }

      const height = el.value.offsetHeight
      if ((TableHook._height.value || shouldUpdateHeight.value) && oldHeight !== height) {
        shouldUpdateLayout = true
      }

      if (shouldUpdateLayout) {
        state.resizeState.width = width
        state.resizeState.height = height
        doReflow()
      }
    }

    function doReflow() {
      state.layout.updateColumnsWidth()
      if (shouldUpdateHeight.value) {
        state.layout.updateElsHeight()
      }
    }

    function scrollTo(px: number) {
      (bodyWrapperRef.value as HTMLElement).scrollTop = px
    }

    function getPopper() {
      return tooltipRef.value!.getPopper()
    }
    function showTooltip(reference: HTMLElement, content: string) {
      // 需要销毁才能更新 reference
      const popper = getPopper()
      if (!popper) {
        return
      }
      popper.destroy()
      state.tooltipVisible = true
      state.tooltipContent = content
      popper.setReferenceEl(reference)
      popper.updatePopper()
    }
    function hideTooltip() {
      state.tooltipVisible = false
    }

    // USE 横向虚拟滚动 START
    const scrollLeft = ref(0)
    const marginLeft = ref(0)
    const horizontalRange = ref<[number, number]>([0, 0])
    const totalColWidthSums = ref<number[]>([0])
    const totalWidth = computed(() => state.layout.totalWidth)
    function handleHorizontalScroll(e: Event) {
      scrollLeft.value = (e.target as HTMLElement).scrollLeft
      calcRange()
    }
    function calcRange() {

      const tableClientWidth = el.value?.clientWidth || 0

      let start = 0
      const sums = totalColWidthSums.value

      while (scrollLeft.value >= sums[start + 1]) {
        start++
      }

      let end = start
      const rightBoundary = scrollLeft.value + tableClientWidth
      while (sums[end + 1] <= rightBoundary) {
        end++
      }

      horizontalRange.value = [start, end]
    }

    watch(columns, (newCols, oldCols) => {
      if (props.horizontalVirtual && newCols.length !== oldCols.length) {
        const arr: number[] = [0]
        newCols.reduce((total: number, col: IColumn, index: number) => {
          const result = total + (col.realWidth! || col.width!)
          arr[index + 1] = result
          return result
        }, 0)
        totalColWidthSums.value = arr
        setTimeout(() => {
          calcRange()
        }, 0)
      }
    })

    watch(horizontalRange, (val) => {
      if (!props.horizontalVirtual) return
      marginLeft.value = totalColWidthSums.value[val[0]]
      store.tailorColumns(val)
    })

    const useHorizontalVirtualScroll = {
      scrollLeft, totalWidth, handleHorizontalScroll, totalColWidthSums, marginLeft,
    }
    // USE 虚拟滚动 END

    //use tooltipProps
    const _tooltipProps = useAttrs(props.tooltipProps)

    const refCollection = {
      bodyWrapperIns, fixedBodyWrapperIns, rightFixedBodyWrapperIns,
      bodyWrapperRef, headerWrapperRef, hiddenColumnsRef, footerWrapperRef,
      fixedBodyWrapperRef, rightFixedBodyWrapperRef, tooltipRef, appendWrapperRef,
    }
    const computedCollection = {
      columns, bodyWidth, bodyHeight, fixedBodyHeight, fixedHeight, isEmpty,
    }
    const methodsCollection = {
      doReflow, scrollTo,
      scheduleLayout, handleMouseLeave, updateScrollY, handleFixedMousewheel, handleHeaderFooterMousewheel, getPopper,
      showTooltip, hideTooltip,
    }
    const otherCollection = {
      _tooltipProps,
    }

    return {
      prefix, prefixMTD,
      ...toRefs(state),
      ...TableHook,
      ...refCollection,
      ...computedCollection,
      ...methodsCollection,
      ...otherCollection,

      ...useHorizontalVirtualScroll,
    }
  },
  render() {
    const {
      _maxHeight,
      prefix, striped, bordered, isGroup, isHidden, fit, layout, size, isEmpty, loading, showHeader,
      store, bodyWidth, highlightCurrentRow, rowClass, rowStyle, disableMouseEvent,
      showSummary, data, summaryMethod, sumText, resizeProxyVisible, _tooltipProps, tooltipClass,
      tooltipVisible, tooltipContent, context, scrollPosition, emptyText, bodyHeight, loadingMessage,
      horizontalVirtual, totalWidth, marginLeft,
    } = this

    return <div
      class={{
        [prefix]: true,
        [`${prefix}-fit`]: fit,
        [`${prefix}-striped`]: striped,
        [`${prefix}-border`]: bordered || isGroup,
        [`${prefix}-hidden`]: isHidden,
        [`${prefix}-group`]: isGroup,
        [`${prefix}-fluid-height`]: _maxHeight,
        [`${prefix}-scrollable-x`]: layout.scrollX,
        [`${prefix}-scrollable-y`]: layout.scrollY,
        [`${prefix}-${size}`]: size,
        [`${prefix}-empty`]: isEmpty,
        [`${prefix}-loading`]: loading,
      }}
      onMouseleave={this.handleMouseLeave}
    >

      <div class={`${prefix}-hidden-columns`} ref="hiddenColumnsRef">
        {this.$slots.default}
      </div>

      {/* 表格的头部 */}
      {showHeader &&
        <div
          v-mousewheel={this.handleHeaderFooterMousewheel} // 🔥🔥🔥 不一定有用这个指令
          class={[
            `${prefix}-header-wrapper`,
            layout.scrollX ? `${prefix}-scrolling-${scrollPosition}` : `${prefix}-scrolling-none`,
          ]}
          ref="headerWrapperRef"
        >
          {horizontalVirtual && <div style={{ width: totalWidth + 'px', float: 'left', height: 0 }} />}
          <table-header
            ref="tableHeaderRef"
            states={store.states}
            store={store}
            border={bordered}
            fixed={false}
            style={{
              width: layout.bodyWidth ? layout.bodyWidth + 'px' : '',
              marginLeft: marginLeft + 'px',
            }}
          />
        </div>

      }

      {/* 表格的身体-前置插槽 */}
      {this.$slots.preposition}

      {/* 表格的身体 */}
      <table-body
        ref="bodyWrapperIns"
        class={[
          layout.scrollX ? `${prefix}-scrolling-${scrollPosition}` : `${prefix}-scrolling-none`,
          `${prefix}-body-wrapper`,
        ]}
        showSummary={showSummary}
        style={bodyHeight}
        highlight={highlightCurrentRow}
        context={context}
        columns={store.states.columns}
        store={store}
        striped={striped}
        row-class={rowClass}
        row-style={rowStyle}
        disable-mouse-event={disableMouseEvent}
        table-style={{
          width: bodyWidth,
          marginLeft: marginLeft + 'px',
        }}
      />
      {isEmpty &&
        <div
          slot="empty"
          class={`${prefix}-empty-block`}
          style={{
            width: bodyWidth,
          }}
        >
          <span class={`${prefix}-empty-text`}>
            {this.$slots.empty || emptyText}
          </span>
        </div>
      }
      {loading &&
        <div slot="loading" class={`${prefix}-loading-block`}>
          {this.$slots.loading || <mtd-loading message={loadingMessage} />}
        </div>
      }
      {/*         {this.$slots.append &&
          <div
            slot="loading"
            class={`${prefix}-append-wrapper`}
            style={{
              height: layout.appendHeight + 'px',
            }}
            ref="appendWrapperRef"
          >
            {this.$slots.append}
          </div>
        } */}

      {/* 表格的身体-后置插槽 */}
      {this.$slots.postposition}

      {/* 表格的脚 */}
      {showSummary &&
        <div
          v-show={data && data.length > 0}
          class={`${prefix}-footer-wrapper`}
          v-mousewheel={this.handleHeaderFooterMousewheel}
          ref="footerWrapperRef"
        >
          <table-footer
            border={bordered}
            sum-text={sumText}
            summary-method={summaryMethod}
            columns={store.states.columns}
            store={store}
            style={{
              width: layout.bodyWidth ? layout.bodyWidth + 'px' : '',
            }}
          />
        </div>
      }

      <div
        class={`${prefix}-column-resize-proxy`}
        ref="resizeProxyRef"
        v-show={resizeProxyVisible}
      />

      <mtd-tooltip
        {..._tooltipProps}
        placement={'top'}
        ref={'tooltipRef'}
        trigger="custom"
        popper-class={tooltipClass}
        visible={tooltipVisible}
        content={tooltipContent}
      />

    </div>
  },
}) as any // 🤡
