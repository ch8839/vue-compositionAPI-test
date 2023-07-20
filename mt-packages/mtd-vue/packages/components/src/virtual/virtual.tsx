import Store from './store'
import MtdOffset from './offset'
import MtdTreeNode from '@components/tree-node'
import MtdOption from '@components/option'
import {
  computed,
  defineComponent,
  reactive,
  ref,
  watch,
  PropType,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import { useListeners } from '@components/hooks/pass-through'
import { isNumber } from '@components/__utils__/type'

function noop() { }

export default defineComponent({
  name: 'MtdVirtual',
  componentName: 'MtdVirtual',
  components: {
    MtdOffset,
    MtdTreeNode,
    MtdOption,
  },
  inheritAttrs: true,
  props: {
    tag: {
      type: String,
      default: 'div',
    },
    viewTag: {
      type: String,
      default: 'div',
    },
    viewTagProps: {
      type: Object,
    },
    viewListTag: {
      type: String,
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
    renderDefault: Function,
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

    const _height = computed(() => isNumber(props.height) ? props.height : parseInt(props.height || '0'))

    const store = reactive(new Store((props.data || []), {
      visibleSize: _height.value,
      rowHeight: props.rowHeight,
      buff: props.buff,
    }))
    const offsetVisibility = ref('')
    const scrollTop = ref(0)

    const listener = computed(() => {
      const temp: any = {}
      // const scrollFun = getListeners().value['scroll']
      temp.scroll = handleScroll
      return useListeners(temp).value
    })

    const offsetRef = ref<any | null>(null)
    const containerRef = ref<any | null>(null)

    const renderData = computed(() => props.virtual ? store.visibleData : props.data)
    const offsetTop = computed(() => props.virtual ? store.range.offsetTop : 0)
    const totalHeight = computed(() => store.totalHeight)

    const containerStyle = computed(() => {
      if (props.height) {
        return {
          height: _height.value + 'px',
        }
      } else {
        return {
          maxHeight: '100%',
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
      // if (!props.virtual) return
      store.handleScroll(e)
      scrollTop.value = (e.target as any).scrollTop
      if (store.range.offsetTop > store.offset) {
        offsetVisibility.value = 'hidden'
      } else {
        offsetVisibility.value = ''
      }
    }

    return {
      store, offsetVisibility, scrollTop,
      renderData, offsetTop, totalHeight, containerStyle,
      offsetRef, containerRef, prefix, listener, prefixMTD,
    }
  },

  mounted() {
    this.reflow()
  },
  methods: {
    scrollIntoViewByIndex(index: number) {
      const scrollTop = this.store.getScrollTopByIndex(index)
      const now = this.scrollTop || 0
      const height = this.store.visibleSize
      const rowHeight = this.store.getRowHeight(index)
      if (!(scrollTop >= now && (scrollTop + rowHeight <= now + height))) {
        let shouldScrollTop = 0
        // 不在视口内
        if (scrollTop < now) {
          // 应该滚动至顶部
          shouldScrollTop = scrollTop
        } else {
          // 应该滚动至底部
          shouldScrollTop = Math.max(0, scrollTop - height + rowHeight)
        }
        this.containerRef.scrollTop = shouldScrollTop
      }
    },
    scrollToTop() {
      this.containerRef.scrollTop = 0
    },
    setOffset(height: any) {
      this.store.setOffset(height)
    },
    reflow() {
      let height = this.height

      if (!height) {
        const style = getComputedStyle(this.$el)
        height = style.height || style.maxHeight
      }

      if (height !== 'auto') {
        this.store.setVisibleSize(height)
      }
    },
  },
  render() {
    const {
      tag: Tag, viewTag: ViewTag, viewListTag: ViewListTag, viewClass, prefix, prefixMTD,
      renderData, totalHeight, offsetTop, loading, viewTagProps, listener, virtual, containerStyle,
    } = this
    const start = this.store.range.start

    const iterator = this.renderItem || noop
    const renderContent = this.renderDefault
    return <Tag class={`${prefixMTD}-virtual-container`}
      {...listener}
      style={containerStyle}
      ref="containerRef"
    >
      {virtual && <div style={{ height: totalHeight + 'px', float: 'left', width: 0 }} />}

      {/* 适应 table 用的插槽 */}
      {this.$slots.headerViewTag}

      <ViewTag ref="view" {...viewTagProps} class={viewClass} style={{ marginTop: offsetTop + 'px' }}>
        {renderContent && <mtd-offset onUpdateOffset={this.setOffset}
          ref="offsetRef">{renderContent()}</mtd-offset>}

        {/* 适应 table 用的插槽 */}
        {this.$slots.headerViewListTag}

        <ViewListTag class={`${prefixMTD}-virtual-list`}>
          {!loading && (this.$slots.default || (this._l as any)(renderData, (row: any, index: number) => {
            return iterator({ row, index: start + index })
          }))}
        </ViewListTag>
      </ViewTag>
      {this.$slots.footer &&
        <div class={`${prefix}-footer`}>
          {this.$slots.footer}
        </div>
      }
    </Tag>
  },
})
