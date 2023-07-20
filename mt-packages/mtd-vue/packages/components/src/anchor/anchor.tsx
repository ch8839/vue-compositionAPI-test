import {
  defineComponent,
  computed,
  reactive,
  toRefs,
  nextTick,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import { scrollTop, sharpMatcherRegx } from '@utils/util'
import MtdAffix from '@components/affix'
import { on, off } from '@utils/dom'
import mitt from '@utils/mitt'
import { IAnchorLink } from '@components/anchor-link/types'
import { isString } from '@utils/type'
import { useClassStyle } from '@components/hooks/pass-through'
import vueInstance from '@components/hooks/instance'

import useProvide from './useProvide'

export default defineComponent({
  name: 'MtdAnchor',
  components: {
    MtdAffix,
  },
  inheritAttrs: true,
  props: {
    affix: {
      type: Boolean,
      default: true,
    },
    offsetTop: {
      type: Number,
      default: 0,
    },
    offsetBottom: Number,
    bounds: {
      type: Number,
      default: 5,
    },
    container: null,
    showInk: {
      type: Boolean,
      default: true,
    },
    scrollOffset: {
      type: Number,
      default: 0,
    },
  },
  emits: ['select', 'change'],
  setup() {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('anchor'))
    const ins = vueInstance()
    const { provideAnchor } = useProvide()
    provideAnchor(ins)

    const state = reactive({
      isAffixed: false, // current affixed state
      inkTop: 0,
      inkVisible: false,
      animating: false, // if is scrolling now
      currentLink: '', // current show link =>  #href -> currentLink = #href
      currentId: '', // current show title id =>  #href -> currentId = href
      scrollContainer: undefined as HTMLElement | Window | undefined,
      scrollElement: undefined as HTMLElement | undefined,
      titlesOffsetArr: [] as any[],
      wrapperTop: 0,
      upperFirstTitle: true,
      links: [] as IAnchorLink[],
      emitter: mitt(),
      isMounted: false,
    })

    const classStyle = useClassStyle()

    return {
      ...toRefs(state),
      prefix, classStyle,
    }
  },

  computed: {
    wrapperComponent(): string {
      return this.affix ? 'mtd-affix' : 'div'
    },
    wrapperStyle(): any {
      return {
        maxHeight: this.offsetTop
          ? `calc(100vh - ${this.offsetTop}px)`
          : '100vh',
      }
    },
    containerIsWindow(): boolean {
      return this.scrollContainer === window
    },
  },
  watch: {
    $route() {
      nextTick(() => {
        this.handleHashChange()
        this.handleScrollTo()
      })
    },
    container() {
      this.init()
    },
    currentLink(newHref, oldHref) {
      this.$emit('change', newHref, oldHref)
    },
  },
  created() {
    this.emitter.on('addAnchorLink', this.addAnchorLink)
    this.emitter.on('removeAnchorLink', this.removeAnchorLink)
    this.emitter.on('go', this.goAnchor)
  },
  mounted() {
    this.init()
    this.isMounted = true
  },
  beforeUnmount() {
    this.removeListener()
  },
  methods: {
    addAnchorLink(link: IAnchorLink) {
      this.links.push(link)
      if (this.isMounted) {
        this.updateTitleOffset()
      }
    },
    removeAnchorLink(link: IAnchorLink) {
      this.links = this.links.filter((item) => item !== link)
    },
    goAnchor(href: string) {
      this.currentLink = href
      this.$emit('select', href)
      const isRoute = (this as any).$router
      if (isRoute) {
        const sharpLinkMatch = sharpMatcherRegx.exec(href)
        if (sharpLinkMatch) {
          (this as any).$router.push({
            ...(this as any).$route,
            hash: decodeURIComponent(sharpLinkMatch[0]),
          })
        } else {
          (this as any).$router.push(decodeURIComponent(href))
        }
      } else {
        window.location.href = href
        nextTick(() => {
          this.handleHashChange()
          this.handleScrollTo()
        })
      }
      // // 在上面路由改变之后，会触发页面刷新，滚动条会回到0的位置，所以要将滚动条回归到上次的位置
      // if (this.scrollElement) {
      //   this.scrollElement.scrollTop = lastScrollTop || 0;
      // }
    },
    handleAffixStateChange(state: boolean) {
      this.isAffixed = this.affix && state
    },
    handleScroll(e: MouseEvent) {
      if (this.titlesOffsetArr[0]) {
        this.upperFirstTitle =
          (e.target as HTMLElement).scrollTop < this.titlesOffsetArr[0].offset
      }
      if (this.animating) return
      this.updateTitleOffset()
      const scrollTop =
        (document.documentElement.scrollTop ||
          document.body.scrollTop ||
          (e.target as HTMLElement).scrollTop) + this.scrollOffset
      this.getCurrentScrollAtTitleId(scrollTop)
    },
    handleHashChange() {
      const url = window.location.href
      const sharpLinkMatch = sharpMatcherRegx.exec(url)
      if (!sharpLinkMatch) return
      this.currentLink = sharpLinkMatch[0]
      this.currentId = sharpLinkMatch[1]
    },
    handleScrollTo() {
      const anchor = document.getElementById(this.currentId)
      const currentLinkElementA = this.$el.querySelector(
        `a[data-href="${this.currentLink}"]`,
      )
      let offset = this.scrollOffset
      if (currentLinkElementA) {
        const offsetAttr = currentLinkElementA.getAttribute(
          'data-scroll-offset',
        )
        if (offsetAttr) {
          offset = parseFloat(offsetAttr)
        }
      }

      if (!anchor) return
      const offsetTop = anchor.offsetTop - this.wrapperTop - offset
      this.animating = true
      scrollTop(
        this.scrollContainer!,
        this.scrollElement!.scrollTop,
        offsetTop,
        600,
        () => {
          this.animating = false
        },
      )
      this.handleSetInkTop()
    },
    handleSetInkTop() {
      const currentLinkElementA = this.$el.querySelector(
        `a[data-href="${this.currentLink}"]`,
      )
      if (!currentLinkElementA) {
        this.inkVisible = false
        return
      }
      const elementATop = (currentLinkElementA as HTMLElement).offsetTop
      const top = elementATop < 0 ? this.offsetTop : elementATop
      this.inkTop = top
      this.inkVisible = true
    },
    updateTitleOffset() {
      const hrefs = this.links.map((link) => {
        return link.href!
      })
      const idArr: string[] = hrefs.map((href) => {
        return href.split('#')[1]
      })
      const offsetArr: { link: string; offset: number }[] = []
      idArr.forEach((id) => {
        const titleEle = document.getElementById(id)
        if (titleEle) {
          offsetArr.push({
            link: `#${id}`,
            offset: titleEle.offsetTop - this.scrollElement!.offsetTop,
          })
        }
      })
      this.titlesOffsetArr = offsetArr
    },
    getAffixTarget(): HTMLElement | Window {
      return this.container
        ? isString(this.container)
          ? document.querySelector(this.container)
          : this.container
        : window
    },
    getCurrentScrollAtTitleId(scrollTop: number) {
      let i = -1
      const len = this.titlesOffsetArr.length
      let titleItem = {
        link: '#',
        offset: 0,
      }
      scrollTop += this.bounds
      while (++i < len) {
        const currentEle = this.titlesOffsetArr[i]
        const nextEle = this.titlesOffsetArr[i + 1]
        if (
          scrollTop >= currentEle.offset &&
          scrollTop < ((nextEle && nextEle.offset) || Infinity)
        ) {
          titleItem = this.titlesOffsetArr[i]
          break
        }
      }
      this.currentLink = titleItem.link
      this.handleSetInkTop()
    },
    getContainer() {
      this.scrollContainer = this.getAffixTarget()
      this.scrollElement = this.container
        ? (this.scrollContainer as HTMLElement)
        : document.documentElement || document.body
    },
    removeListener() {
      off(this.scrollContainer, 'scroll', this.handleScroll as any)
      off(window, 'hashchange', this.handleHashChange)
    },
    init() {
      this.handleHashChange()
      nextTick(() => {
        this.removeListener()
        this.getContainer()
        this.wrapperTop = this.containerIsWindow
          ? 0
          : this.scrollElement!.offsetTop
        this.handleScrollTo()
        this.handleSetInkTop()
        this.updateTitleOffset()
        if (this.titlesOffsetArr[0]) {
          this.upperFirstTitle =
            this.scrollElement!.scrollTop < this.titlesOffsetArr[0].offset
        }
        on(this.scrollContainer, 'scroll', this.handleScroll as any)
        on(window, 'hashchange', this.handleHashChange)
      })
    },
  },
  render() {
    const {
      prefix, wrapperComponent, offsetTop, offsetBottom, affix, showInk, inkVisible,
      wrapperStyle, inkTop, classStyle,
    } = this
    const {
      getAffixTarget, handleAffixStateChange,
    } = this
    const Component = wrapperComponent
    return <Component
      {...classStyle}
      offset-top={offsetTop}
      offset-bottom={offsetBottom}
      get-target={affix ? getAffixTarget : undefined}
      onChange={handleAffixStateChange}
    >
      <div class={`${prefix}-wrapper`} style={wrapperStyle}>
        <div class={prefix}>
          <div class={`${prefix}-ink`}>
            <span
              v-show={showInk && inkVisible}
              class={`${prefix}-ink-ball`}
              style={{ top: `${inkTop}px` }}
            />
          </div>
          {this.$slots.default}
        </div>
      </div>
    </Component>
  },
})
