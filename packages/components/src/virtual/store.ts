export enum DIRECTION_TYPE {
  front = 'FRONT', // 上，左
  behind = 'BEHIND', // 下，右
}

export interface RowScrollEvent {
  direction: DIRECTION_TYPE; // 滚动方向
  distance: number; // 滚动距离
  interval: number; // 时间间隔

  scrollTop: number; // 当前滚动位置
  timeStamp: number; // 当前时间戳
  speed?: number; // 滚动速度
}

export interface Viewport {
  start: number; // 视口内第一条元素的下标
  end: number;  // 视口内最后一条元素的下标
  height?: number; // 视口高度

  buffered?: boolean;
  rowScroll?: RowScrollEvent;
}

export interface RenderRange extends Viewport {
  top: number; // 渲染第一条元素的 scrollTop 值，通常来说恒等于 offsetTop
  bottom: number; // 渲染最后一条元素的 scrollTop 值

  offsetTop: number; // 视口的偏移量
  rendered?: boolean; // 是否已经渲染
}

function createRowScrollEvent(event: MouseEvent, store: Store): RowScrollEvent {
  const { lastScroll: last, range } = store
  const { target, timeStamp } = event
  const scrollTop = (target as HTMLElement).scrollTop
  const prev = last || {
    scrollTop: 0,
    timeStamp,
  }

  return {
    direction: scrollTop > prev.scrollTop ? DIRECTION_TYPE.behind : DIRECTION_TYPE.front,
    distance: Math.abs(scrollTop - range.top),
    interval: timeStamp - prev.timeStamp,
    timeStamp,
    scrollTop,
  }
}

function shouldUpdateStore(rowScroll: RowScrollEvent, store: Store) {
  // 后面换成 store
  return !isInRender(rowScroll, store)
}

// a in b
function isInRange(a: Viewport, b: Viewport) {
  return a.start >= b.start && a.end <= b.end
}

function isInRender(rowScroll: RowScrollEvent, store: Store) {
  const { visibleSize, range, rowHeight } = store
  const top = rowScroll.scrollTop
  const bottom = top + visibleSize
  // ⭐️ 关键在这里 在容器大小方面进行判断是否更新请求数据
  return (top > range.top + rowHeight) && bottom < (range.bottom - rowHeight)
}

function createViewport(rowScroll: RowScrollEvent, store: Store): Viewport {
  // 需要引入 store
  const { scrollTop } = rowScroll
  const { rowHeight, visibleCount, offset } = store
  const fl = Math.max(0, scrollTop - offset) / rowHeight
  const start = Math.floor(fl)
  const end = Math.ceil(fl) + visibleCount

  return {
    start,
    end,
    rowScroll,
  }
}
// eslint-disable-next-line
function shouldUpdateVisibleData(store: Store) {
  return true
}

export interface RenderBuffer {
  offsetTop: number;
  range: RenderRange;
}

export default class Store {
  public data: any[] = [] // 数据源
  public visibleData: any[] = [] // 实际渲染数据

  public buff: number // 缓存数量，不区分上下
  public buffSize: number // buff * rowHeight; 后面需要区分向上向下

  public rowHeight: number // 单行高度
  public totalHeight = 0 // 整体高度，通常 data.length * rowHeight

  public offset = 0 // 顶部偏移量
  public visibleSize: number // 视口区域大小
  public visibleCount!: number // 市口区域内可显示条数，通常 Math.ceil(visibleSize / rowHeight)
  public range: RenderRange // 当前渲染的实际内容

  public lastScroll?: RowScrollEvent // 上一次滚动事件
  public scrollSpeed = 0 // 0px/ms

  private disabled = false
  constructor(data: any[], params: { visibleSize: number, rowHeight: number, buff?: number }) {
    const { visibleSize: initVisibleSize, rowHeight, buff } = params
    this.visibleSize = initVisibleSize
    this.rowHeight = rowHeight
    this.resetVisibleCount()

    this.buff = buff || 4
    this.buffSize = this.buff * this.rowHeight // 需要区分出向上向下

    this.range = {
      start: 0,
      end: this.visibleCount + this.buff,
      top: 0,
      bottom: this.visibleSize + this.buffSize,
      offsetTop: 0,
    }

    this.setData(data, { force: true })
    return this
  }

  public handleScroll(e: MouseEvent) {
    this.handleScrollY(e)
  }

  private handleScrollY(e: MouseEvent) {
    const rowScroll = createRowScrollEvent(e, this)
    this.getScrollSpeed(rowScroll)
    if (shouldUpdateStore(rowScroll, this)) {
      const vw = createViewport(rowScroll, this)
      const updated = this.setViewport(vw)
      if (updated) {
        this.lastScroll = rowScroll
      }
      return updated
    }
    return false
  }
  /**
   *
   * @param data
   * @param option
   * @param option.force 是否强制更新，通常用于滚动加载时
   */
  public setData(data: any[], option: { force?: boolean } = {}) {
    if (option.force || this.data.length !== data.length) {
      this.totalHeight = data.length * this.rowHeight + this.offset
    }
    const old = this.data
    this.data = data
    if (old !== data) {
      // todo: 清空缓存，强制刷新
    }
    this.reflowViewport()
  }

  public setRowHeight(rowHeight: number | string) {
    if (typeof rowHeight === 'string') {
      this.rowHeight = parseInt(rowHeight) // 目前仅支持 px
    } else {
      this.rowHeight = rowHeight
    }
    this.totalHeight = this.data.length * this.rowHeight
    // 更新当前视图数据
    this.resetVisibleCount()
    this.reflowViewport()
  }

  public setVisibleSize(visibleSize?: number | string) {
    if (typeof visibleSize === 'string') {
      const n = parseInt(visibleSize) // 目前仅支持 px
      if (isNaN(n)) {
        console.warn('visibleSize should be number, now is auto')
        return
      }
      this.visibleSize = n
    } else {
      this.visibleSize = visibleSize || 0
    }
    // 更新当前视图数据
    this.resetVisibleCount()
    this.reflowViewport()
  }

  public setDisabled(disabled: boolean) {
    this.disabled = disabled
    this.reflowViewport()
  }

  public setOffset(offset: number) {
    if (this.offset !== offset) {
      this.offset = offset
      this.totalHeight = this.data.length * this.rowHeight + this.offset
      // todo: 也许需要重新计算位置
    }
  }

  public getScrollTopByIndex(index: number) {
    let i = index
    if (index > this.data.length) {
      i = this.data.length
    } else if (index < 0) {
      i = 0
    }
    return i * this.rowHeight + this.offset
  }

  // eslint-disable-next-line
  public getRowHeight(index: number) {
    return this.rowHeight
  }
  /**
   * 重新计算视口区域内容，通常在 visibleSize、rowHeight 变动后调用
   * @returns 是否更新渲染区域
   */
  private reflowViewport() {
    const { lastScroll: rowScroll } = this
    let nextViewport: Viewport
    if (rowScroll) {
      nextViewport = createViewport(rowScroll, this)
    } else {
      nextViewport = {
        start: 0,
        end: this.visibleCount,
      }
    }
    return this.setViewport(nextViewport, { force: true })
  }
  /**
   *
   * @param v 当前视口
   * @returns 是否更新渲染区域
   */
  private setViewport(v: Viewport, options?: { force?: boolean }): boolean {
    if ((options && options.force) || !isInRange(v, this.range)) {
      this.updateRange(v)
      return true
    }
    return false
  }

  /**
   * @returns 是否更新渲染数据
   */
  private updateRange(v: Viewport) {
    // 不在已渲染的区域内，更新数据 同时更新 range
    const max = Math.max(0,
      this.data.length - this.visibleCount - this.buff)
    const start = Math.min(Math.max(0, v.start - this.buff), max)
    const end = Math.min((start + this.buff) + this.visibleCount + this.buff, this.data.length)

    const range: RenderRange = {
      start,
      end,

      top: start * this.rowHeight + this.offset,
      bottom: end * this.rowHeight,

      offsetTop: start * this.rowHeight,
      rowScroll: v.rowScroll,
    }
    // nextTick to update range height & buff height
    this.range = range
    if (shouldUpdateVisibleData(this)) {
      this.updateVisibleData()
    }
  }

  private updateVisibleData() {
    if (this.disabled) {
      this.visibleData = this.data
      return
    }
    const { start, end } = this.range
    this.range.bottom = end * this.rowHeight
    // console.log('视口(准确的来说是range)内元素上下标', start, end - 1)
    this.visibleData = this.data.slice(start, end)
    this.afterRenderData()
  }

  private afterRenderData() {
    // todo 渲染结束后，更新 range.top, range.bottom 值，并计算每行高度
  }

  private resetVisibleCount() {
    this.visibleCount = Math.ceil(this.visibleSize / this.rowHeight)
  }

  private getScrollSpeed = this.getScrollSpeedFun() // 闭包
  private getScrollSpeedFun() {
    //利用定时器，来计算滚动速度

    let distance = 0, speed = 0
    let scrollSpeedTimer: any = null
    const timeScale = 100

    // 节流函数
    return (e: RowScrollEvent) => {

      if (scrollSpeedTimer) return

      scrollSpeedTimer = setTimeout(() => {
        //设置开始定时器
        const distanceScale = e.scrollTop - distance
        speed = distanceScale / timeScale
        this.scrollSpeed = speed
        distance = e.scrollTop
        clearTimeout(scrollSpeedTimer)
        scrollSpeedTimer = null
      }, timeScale)
    }
  }
}
