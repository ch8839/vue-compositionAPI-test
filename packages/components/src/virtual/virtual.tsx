import Store from './store'
import MtdOffset from './offset'
import MtdTreeNode from '@components/tree-node'
import MtdOption from '@components/option'
import MtdDropdownMenuItem from '@components/dropdown-menu-item'
import {
  computed,
  defineComponent,
  reactive,
  ref,
  watch,
  PropType,
  getSlotsInRender,
  useListeners,
  onMounted,
  h as hFun,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import { isNumber } from '@utils/type'
import getElement from '@components/hooks/getElement'

function noop() { }

export default defineComponent({
  name: 'MtdVirtual',
  componentName: 'MtdVirtual',
  components: {
    MtdOffset,
    MtdOption,
    MtdTreeNode,
    MtdDropdownMenuItem,
  },
  inheritAttrs: true,
  props: {
    tag: {
      type: String as PropType<any>,
      default: 'div',
    },
    viewTag: {
      type: String as PropType<any>,
      default: 'div',
    },
    viewTagProps: {
      type: Object,
    },
    viewListTag: {
      type: String as PropType<any>,
      default: 'div',
    },
    viewClass: Object,
    rowHeight: {
      type: Number,
      default: 40,
      require: true,
    },
    height: {
      type: [Number, String],
    },
    data: {
      type: Array,
    },
    buff: {
      type: Number,
      default: 3,
    },
    visible: Boolean,
    renderItem: Function,
    renderDefault: Function, // 默认没有list项的时候展示什么
    loading: Boolean,
    virtual: {
      type: Boolean,
      default: false,
    },
    scroll: Function as PropType<(e: Event) => any>,
  },
  emits: ['scroll'],
  setup(props, { emit }) {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('virtual'))
    const prefixMTD = computed(() => config.getPrefix())
    const offsetVisibility = ref('')
    const scrollTop = ref(0)
    const el = getElement()
    const listener = useListeners()

    const m_height = computed(() => {
      const height: number = isNumber(props.height) ? props.height : parseInt(props.height || '0')
      return height
    })

    const store = reactive(new Store((props.data || []), {
      visibleSize: m_height.value,
      rowHeight: props.rowHeight,
      buff: props.buff,
    }))

    const offsetRef = ref<any | null>(null)
    const containerRef = ref<any | null>(null)

    const renderData = computed(() => props.virtual ? store.visibleData : props.data)
    const offsetTop = computed(() => props.virtual ? store.range.offsetTop : 0)
    const totalHeight = computed(() => store.totalHeight)

    const containerStyle = computed(() => {
      if (!props.virtual) {
        return {}
      }
      if (props.height) {
        return {
          height: m_height.value + 'px',
        }
      } else {
        return {
          maxHeight: '300px',
        }
      }
    })

    watch(() => props.height, (v) => {
      v && store.setVisibleSize(v)
    })
    watch(() => props.rowHeight, (v) => {
      v && store.setRowHeight(v)
    })


    watch(() => props.data, (n, v) => {
      if (n !== v) {
        store.setData(n || [])
      }
    })
    // 💣 注意这里watch 的能力范围
    watch(() => props.data?.length, () => {
      store.setData(props.data || [], { force: true })
    })
    watch(() => props.visible, () => {
      store.setData(props.data || [], { force: true })
    })
    watch(() => offsetVisibility, (n) => {
      if (offsetRef.value) {
        offsetRef.value.setVisibility(n)
      }
    })
    watch(() => props.data?.length, () => {
      store.setData(props.data || [], { force: true })
    })

    function handleScroll(e: MouseEvent) {
      emit('scroll', e)
      if (!props.virtual) return

      store.handleScroll(e)
      scrollTop.value = (e.target as any).scrollTop
      if (store.range.offsetTop > store.offset) {
        offsetVisibility.value = 'hidden'
      } else {
        offsetVisibility.value = ''
      }
    }

    function scrollIntoViewByIndex(index: number) {
      const innerScrollTop = store.getScrollTopByIndex(index)
      const now = scrollTop.value || 0
      const height = store.visibleSize
      const rowHeight = store.getRowHeight(index)
      if (!(innerScrollTop >= now && (innerScrollTop + rowHeight <= now + height))) {
        let shouldScrollTop = 0
        // 不在视口内
        if (innerScrollTop < now) {
          // 应该滚动至顶部
          shouldScrollTop = innerScrollTop
        } else {
          // 应该滚动至底部
          shouldScrollTop = Math.max(0, innerScrollTop - height + rowHeight)
        }
        containerRef.value.scrollTop = shouldScrollTop
      }
    }

    function scrollToTop() {
      containerRef.value.scrollTop = 0
    }

    function setOffset(height: any) {
      store.setOffset(height)
    }

    function reflow() {
      let height: string | number = m_height.value

      if (!height && el.value) {
        const style = getComputedStyle(el.value as Element)
        height = parseInt(style.height) || parseInt(style.maxHeight)
      }

      store.setVisibleSize(height)

    }

    function defaultRenderItem({ row, index }: { row: any, index: number }) {
      // 🤡 个人demo，
      return hFun('div', { class: 'v-list-item' }, `【${index}】${row.label}`)
    }

    onMounted(() => {
      reflow()
    })

    return {
      store, offsetVisibility, scrollTop,
      handleScroll, scrollToTop, setOffset, reflow, scrollIntoViewByIndex, defaultRenderItem,
      renderData, offsetTop, totalHeight, containerStyle,
      offsetRef, containerRef, prefix, listener, prefixMTD,
    }
  },

  render() {
    const {
      tag: Tag, viewTag: ViewTag, viewListTag: ViewListTag, viewClass, prefix, prefixMTD, store,
      renderData, totalHeight, offsetTop, loading, viewTagProps, listener, virtual, containerStyle,
    } = this
    const start = store.range.start

    const renderItem = this.renderItem || this.defaultRenderItem
    const renderDefault = this.renderDefault
    return <Tag class={`${prefixMTD}-virtual-container`}
      {...listener}
      onScroll={this.handleScroll}
      style={containerStyle}
      ref="containerRef"
    >
      {/* 撑开总高的骨架 */}
      {virtual &&
        <div style={{ height: totalHeight + 'px', float: 'left', width: 0 }} />
      }

      {/* 适应 table 用的插槽 */}
      {getSlotsInRender(this, 'headerViewTag')}

      {/* empty */}
      {getSlotsInRender(this, 'empty')}

      <ViewTag
        ref="view"
        {...viewTagProps}
        class={viewClass}
        style={{ marginTop: offsetTop + 'px' }}
      >

        {(renderDefault && (renderData?.length === 0) || loading) &&
          <mtd-offset onUpdateOffset={this.setOffset} ref="offsetRef">
            {renderDefault?.()}
          </mtd-offset>
        }

        {/* 适应 table 用的插槽 */}
        {getSlotsInRender(this, 'headerViewListTag')}

        <ViewListTag class={`${prefixMTD}-virtual-list`}>
          {!loading &&
            (getSlotsInRender(this)
              || renderData?.map((row: any, index: number) => renderItem({ row, index: start + index })))
          }
        </ViewListTag>
      </ViewTag>
      {getSlotsInRender(this, 'footer') &&
        <div class={`${prefix}-footer`}>
          {getSlotsInRender(this, 'footer')}
        </div>
      }
    </Tag>
  },
})
