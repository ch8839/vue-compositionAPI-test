import { computed, defineComponent, PropType } from '@ss/mtd-adapter'

import { cssStyle } from './style'
import { hasProp } from '@utils/vnode'
import { firstUpperCase, noop } from '@utils/util'
import { addResizeListener, removeResizeListener } from '@utils/resize-event'

import TabBar from './tab-bar'
import TabPage from './tab-page'
import TabOne from './tab-one'
import TabDrop from './tab-drop'
import TabAdd from './tab-add'

import { debounce } from 'throttle-debounce'

import { Component } from '@components/types/component'
import { IPane, IPaneDrop, ITabBar, TabPosition } from '../types'
import { useConfig } from '@components/config-provider'

const ONE_HUNDRED_PERCENTAGE = '100%'

export default defineComponent({
  name: 'MtdTabNav',
  components: {
    TabBar,
    TabPage,
    TabOne,
    TabDrop,
    TabAdd,
  },
  props: {
    currentValue: [String, Number, Object, Array],
    panes: {
      type: Array as PropType<IPane[]>,
      required: true,
    },
    closable: Boolean,
    size: {
      type: String,
      default: 'normal',
    },
    type: String,
    lineSize: Number,
    scrollUnit: {
      type: Number,
      default: 1,
    },
    tabPosition: {
      type: String as PropType<TabPosition>,
      default: 'top',
    },
    // 垂直时，tab 数量限制
    verticalHeightNumber: {
      type: Number,
      required: true,
    },
    addable: Boolean,
  },
  emits: ['tabClick', 'tabRemove', 'prevClick', 'nextClick'],
  setup() {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('tabs-nav'))
    const prefixMTD = computed(() => config.getPrefix())
    return {
      prefix, prefixMTD,
    }
  },
  data() {
    return {
      fontSize: 0,
      containerWidth: 0,
      containerStyle: {},
      page: {
        offsetWidth: 0,
        offsetHeight: 0,
        pageStyle: {
          right: null,
          bottom: null,
          transform: null,
          padding: null,
        },
      },
      scrollStyle: {
        'max-width': 0,
        height: '',
      } as { [key: string]: number | string },
      animatedStyle: {
        transform: '',
      },
      animatedtranslate: 0,
      tabList: [],
      splitIndex: 0,
      firstIndex: 0,
      pageShow: true,
      // vertical tab height
      oneTabHeight: 0,
      isMounted: false,
      repaint: noop,
    }
  },
  computed: {
    pageHaveShow(): boolean {
      return this.tabPosition === 'left' || this.tabPosition === 'right'
    },
    navStyle() {
      return {}
    },
    fixedWidth(): number {
      return this.page.offsetWidth
    },
    prevStatus(): boolean {
      return this.firstIndex !== 0
    },
    scrollable(): boolean {
      const { scrollStyle, $refs } = this
      return (
        (($refs as any).animated as HTMLElement).offsetWidth >
        scrollStyle['max-width']
      )
    },
  },

  watch: {
    firstIndex() {
      if (this.firstIndex < 0) {
        this.firstIndex = 0
        return
      }
      let widthSum = 0
      for (let i = 0; i < this.firstIndex; i++) {
        if (this.tabPosition === 'left' || this.tabPosition === 'right') {
          widthSum += this.oneTabHeight
        } else {
          widthSum += this.tabList[i]
        }
      }
      this.animatedtranslate = -1 * widthSum
    },
    panes() {
      // 🥚 cconsole.log('add tab 时')
      // add tab 时updatetablist 数据用于计算翻页
      this.$nextTick(() => {
        this.updateNav()
        const { panes, tabList } = this
        if (panes.length !== tabList.length) {
          this.updateFirstIndex()
        }
        const { barRef } = this.$refs as any
        barRef && (barRef as ITabBar).getStyle()
      })
    },
    animatedtranslate() {
      let direction = ''

      switch (this.tabPosition) {
        case 'top':
          direction = 'X'
          break
        case 'right':
          direction = 'X'
          break
        case 'left':
          direction = 'Y'
          break
        case 'bottom':
          direction = 'Y'
          break
      }
      Object.assign(this.animatedStyle, {
        transform: `translate${direction}(${this.animatedtranslate}px)`,
      })
    },
    currentValue() {
      // 确保拿到当前激活的active
      this.$nextTick(() => {
        this.scrollToActiveTab()

        // 300ms后各个tab的宽度动效才结束，此时计算宽度才是准确的
        setTimeout(() => {
          this.updateNav()
        }, 300)
      })
    },
  },

  created() {
    this.isMounted = false
    this.repaint = debounce(100, this.resetBarStyle)
  },

  mounted() {
    addResizeListener(this.$el, this.updateNav)
    this.isMounted = true
    // 等待nav 及组件 渲染结束，updateNav 内部使用子组件引用
    this.$nextTick(() => {
      this.updateNav()
    })
  },

  beforeUnmount() {
    if (this.isMounted) removeResizeListener(this.$el, this.updateNav)
  },

  methods: {
    updateFirstIndex() {
      let activeTabIndex = 0
      for (let i = 0; i < this.panes.length; i++) {
        if (this.panes[i].value === this.currentValue) {
          activeTabIndex = i
          break
        }
      }
      const { container, animated } = this.$refs as {
        [key: string]: HTMLElement;
      }
      if (!container || !animated) return
      this.updateList(container, animated)
      const list = this.tabList
      const maxWidth = this.scrollStyle['max-width']
      const scrollWidth =
        maxWidth === ONE_HUNDRED_PERCENTAGE ? 0 : parseFloat(`${maxWidth}`)
      if (scrollWidth === 0) {
        return null
      }
      let someSum = 0
      for (let i = activeTabIndex; i >= 0; i--) {
        someSum += list[i]
        if (someSum > scrollWidth) {
          this.firstIndex = i + 1
          break
        }
      }
      if (someSum < scrollWidth) {
        this.firstIndex = 0
      }
    },
    updateNav() {
      if (!this.isMounted) {
        return
      }
      const { tabPosition, verticalHeightNumber, $refs } = this
      const refs = $refs as any
      const { container, animated } = refs
      const page = refs.page as Component
      let add = refs.add as Component
      const page$el = page ? page.$el : undefined
      const { offsetWidth, offsetHeight } = page$el || {}
      const list = ['margin-left', 'margin-right']
      const style = cssStyle(page$el, ...list)
      this.page = Object.assign(this.page, {
        offsetWidth: offsetWidth + style['margin-left'] + style['margin-right'],
        offsetHeight,
      })
      if (!container || !animated) return
      this.updateList(container, animated)
      this.oneTabHeight = (() => {
        for (let i = 0, len = animated.children.length; i < len; i++) {
          const item = animated.children[i] as HTMLElement
          // 🤡🤡🤡这么找隐患很大！
          const regular = eval('/' + this.prefixMTD + '-tabs-item/')
          if ((item.attributes as any).class.value.match(regular)) {
            const list = ['margin-bottom']
            const style = cssStyle(item, ...list)
            return item.offsetHeight + style['margin-bottom']
          }
          continue
        }
      })()!

      // this.oneTabHeight 会触发tab add 渲染,更新,下面依赖渲染结果，so 添加nexttick
      this.$nextTick(() => {
        const list = ['margin-left', 'margin-right']
        add = add || {}
        const style = cssStyle(add.$el, ...list)
        const addWidth =
          add && add.$el
            ? add.$el.offsetWidth + style['margin-left'] + style['margin-right']
            : 0

        if (!animated) {
          // tofix https://tt.sankuai.com/ticket/detail?id=3747238
          return
        }

        if (tabPosition === 'top' || tabPosition === 'bottom') {
          const contentWidth = animated.scrollWidth + addWidth
          const shouldShowPager = contentWidth > this.containerWidth

          // 动态增加 tabs 是，由于之前没有翻页，所以在进入到次时挂载，所以 fixedWidth 会是 0。
          const pagerWidth = shouldShowPager
            ? Math.max(Math.min(this.fixedWidth || 0, 56), 56)
            : 0

          const fixedWidth = pagerWidth + addWidth

          this.scrollStyle['max-width'] = shouldShowPager
            ? this.containerWidth - fixedWidth + 'px'
            : ONE_HUNDRED_PERCENTAGE
        } else {
          const { offsetWidth, offsetHeight } = page$el || {
            offsetWidth: 0,
            offsetHeight: 0,
          }
          this.scrollStyle['max-width'] = ONE_HUNDRED_PERCENTAGE
          const isShowPage = verticalHeightNumber
          const scrollHeight = this.oneTabHeight * verticalHeightNumber
          let computedHeight = Math.min(scrollHeight, animated.offsetHeight)

          if (isShowPage && animated.offsetHeight > scrollHeight) {
            computedHeight += offsetWidth
            Object.assign(this.scrollStyle, {
              height: scrollHeight + 'px',
            })
            Object.assign(this.animatedStyle, {
              height: animated.offsetHeight + 'px',
            })
            Object.assign(this.page.pageStyle, {
              bottom: (offsetWidth - offsetHeight) / 2 + 'px',
              right: '20px',
              transform: 'rotate(90deg)',
              padding: '2px 0',
            })
          } else {
            this.pageShow = false
          }

          this.containerStyle = {
            ...this.containerStyle,
            height: computedHeight + 'px',
          }
        }
        // 等待 scrollStyle 应用在 scroll 元素上
        this.$nextTick(() => {
          // 初始化page状态
          this.computedPageShow()
        })
      })
    },
    updateList(container: HTMLElement, animated: HTMLElement) {
      if (!this.isMounted) {
        return
      }
      const { splitIndex, tabList, containerWidth } = this.computedMoreIndex(
        container,
        animated,
      )
      this.splitIndex = splitIndex
      this.tabList = tabList
      this.containerWidth = containerWidth
    },
    computedMoreIndex(container: HTMLElement, animated: HTMLElement) {
      let len = 0
      const result = {
        splitIndex: this.splitIndex,
        tabList: [],
        containerWidth: this.containerWidth,
      } as { [key: string]: any }
      // get container width
      result.containerWidth = container.offsetWidth;
      [...animated.children].every((el: any, index: number) => {
        // 如果 margin-right 固定 style['margin-right']可做优化
        const list = ['margin-right']
        const style = cssStyle(el, ...list)
        const tabLength = el.offsetWidth + style['margin-right']
        len = len + tabLength

        if (len <= result.containerWidth) {
          result.splitIndex = index
        }

        result.tabList.push(tabLength)
        return true
      })

      const { barRef } = this.$refs
      barRef && result.tabList.shift()
      return result
    },
    onPrevClick() {
      this.computedTranslate(-1)
    },
    onNextClick() {
      this.computedTranslate(1)
    },
    computedTranslate(o: number) {
      this.firstIndex = this.firstIndex + o * this.scrollUnit
    },
    scrollToActiveTab() {
      // console.log('激活的active tab发生了改变')

      // active 渲染结束
      this.$nextTick(() => {
        const activeTab = this.$el.querySelector(
          `.${this.prefixMTD}-tab-active`,
        ) as HTMLElement
        if (!activeTab) return
        const navScroll = this.$refs.scroll as HTMLElement
        // console.log(navScroll)
        const activeTabBounding = activeTab.getBoundingClientRect()
        const navScrollBounding = navScroll.getBoundingClientRect()
        const { animatedtranslate } = this
        let newOffset = animatedtranslate

        if (activeTabBounding.left < navScrollBounding.left) {
          newOffset =
            animatedtranslate +
            (navScrollBounding.left - activeTabBounding.left)
        }
        if (activeTabBounding.right > navScrollBounding.right) {
          this.updateFirstIndex()
          let widthSum = 0
          for (let i = 0; i < this.firstIndex; i++) {
            widthSum += this.tabList[i]
          }
          newOffset = -widthSum
        }
        this.animatedtranslate = newOffset
        this.$nextTick(() => { // 🤡
          this.computedPageShow()
          const bar = (this.$refs as any).barRef as ITabBar
          bar && bar.getStyle()
        })
      })
    },
    computedPageShow() {
      const { $refs, pageHaveShow } = this

      const { animated, scroll } = $refs as { [key: string]: HTMLElement }

      if (!animated || !scroll) {
        return
      }
      // 比较 tab 总长度与 scroll 确定是否超长
      // pageHaveShow vertical 情况使用
      if (!pageHaveShow) {
        this.pageShow = animated.offsetWidth > scroll.offsetWidth
        if (!this.pageShow) {
          this.animatedtranslate = 0
        }
      }
    },
    computedActive(currentValue: any, item: IPane | IPaneDrop) {
      const { tabDropInfo } = item as IPaneDrop

      if (tabDropInfo) {
        return tabDropInfo.moreTabs.some((it) => {
          item.active = currentValue === it.value
          return item.active
        })
      }

      item.active = currentValue === (item as IPane).value

      return item.active
    },
    getNextStatus() {
      const { animatedtranslate, scrollStyle, $refs } = this
      const styleName = this.tabPosition === 'left' ? 'height' : 'width'
      // animatedLength 滚动剩余距离
      const cssStyleName = styleName === 'width' ? 'max-width' : styleName
      const animatedLength =
        parseFloat(scrollStyle[cssStyleName] as string) +
        Math.abs(animatedtranslate)
      if (this.firstIndex === 0) {
        return true
      } else {
        return (
          $refs.animated &&
          animatedLength <
          ($refs as any).animated[`offset${firstUpperCase(styleName)}`]
        )
      }
    },
    addClick(event: Event) {
      // this.computedPageShow();
      (this.$parent as any).addTabButton(event)
    },
    resetBarStyle() {
      (this.$refs as any)?.barRef?.getStyle?.()
    },
  },

  render() {
    const {
      type,
      size,
      panes,
      lineSize,
      scrollStyle,
      animatedStyle,
      prevStatus,
      pageShow,
      tabPosition,
      containerStyle,
      closable,
      addable,
      oneTabHeight,
      prefix,
    } = this
    const nextStatus = pageShow ? this.getNextStatus() : false
    const tabs = panes.map((item, index) => {
      const active = this.computedActive(this.currentValue, item)
      const { disabled, value, icon, label, tabDropInfo } = item
      let tabValue = value

      const tabOneData = {
        props: {
          size,
          disabled,
          active,
          icon,
          label,
          pane: item,
          //paneLabel: item.$slots.label,
          tabDropInfo,
          value,
          key: value,
          currentValue: this.currentValue,
          closable: hasProp(item as any, 'closable') ? item.closable : closable,
        },
        on: {
          tabClick: (ev: Event, activeValue: any) => {
            // activeName select 使用
            tabValue = activeValue || tabValue
            this.$emit('tabClick', ev, item, tabValue, index)
          },
          tabRemove: (e: Event) => {
            this.$emit('tabRemove', e, item)
          },
        },
        refInFor: true, // 为什么使用这个🤡
        ref: `tabs${index}`,
      }
      return <tab-one {...tabOneData}>
        <template slot="label">
          {item.$slots.label}
        </template>
      </tab-one>
    })

    const barData = {
      props: {
        tabs: panes,
        lineSize,
        tabPosition,
      },
      ref: 'barRef',
    }

    const pageData = {
      props: {
        size,
        prevStatus,
        nextStatus,
        pageStyle: this.page.pageStyle,
      },
      on: {
        prevClick: (event: Event) => {
          this.onPrevClick()
          this.$emit('prevClick', event)
        },
        nextClick: (event: Event) => {
          this.onNextClick()
          this.$emit('nextClick', event)
        },
      },
      ref: 'page',
    }

    const addData = {
      props: {
        width: oneTabHeight,
        size: size,
      },
      ref: 'add',
    }

    return (
      <div
        class={{
          [`${prefix}-container`]: true,
        }}
        style={containerStyle}
        ref="container"
      >
        <div class={`${prefix}-scroll`} style={scrollStyle} ref="scroll">
          <div
            class={`${prefix}-animated`}
            style={animatedStyle}
            ref="animated"
          >
            {!type && <tab-bar {...barData}></tab-bar>}
            {tabs}
          </div>
        </div>
        {addable && <tab-add {...addData}></tab-add>}
        {pageShow && <tab-page {...pageData}></tab-page>}
      </div>
    )
  },
})
