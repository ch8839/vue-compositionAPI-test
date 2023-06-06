import { lxTrackMGEClickEvent, lxTrackMGEViewEvent, openUrl } from '@mrn/mrn-utils'
import BasePage from '../base-page/index'
import createToolBox from '@nibfe/multi-platform-env'
import MrnBase from '@nibfe/multi-platform-env/types/branch/client/mrn'
import createService, {
  OrderListInfo,
  OrderItem,
  Operation,
} from '../../../services/page-services/entertainment_order_list'
import { BUTTON_TYPE } from '@nibfe/tra-app-platform-mrn-modules/services/requests/entertainment_order_list'

export interface TabItem {
  // tab的唯一Id
  key?: string
  // tab的标签文案
  label?: string
  // 扩展字段，用于业务有复杂数据结构的场景
  extra?: any
}

interface RequestParams {
  start: number // 起始条数
  pagesize: number // 每页大小
  filter?: number | string // 订单状态
}
class OrderListPage extends BasePage {
  services!: ReturnType<typeof createService>

  reloadFlag = Math.random()
  pageLoading = false
  pageReady = false

  orderTabs: TabItem[] = [
    { label: '全部订单', key: '0' },
    { label: '待付款', key: '1' },
    { label: '可使用', key: '2' },
    { label: '退款/售后', key: '3' },
  ]
  selectedTabIndex = 0
  orderList: Array<OrderItem> = []
  nextPageNo = 1

  currentSelectedOrder = {}
  showOrderDeleteConfirmDialog = false // 是否展示删除订单确认弹窗
  showOrderListBottomText = true // 是否展示订单列表底部文案

  lxInfo = {
    cid: 'c_gc_c73fbwto',
    tab_mv: 'b_gc_x5r4z1u5_mv',
    tab_mc: 'b_gc_x5r4z1u5_mc',
    order_mv: 'b_gc_25mrcz15_mv',
    order_mc: 'b_gc_25mrcz15_mc'
  }

  async beforeInit() {
    console.log('🐒🐒🐒🐒🐒🐒 beforeInit', this.envInfo)
    this.tools = createToolBox() as unknown as MrnBase
    console.log('this.tools: ', this.tools);
    try {
      await this.tools.mtCheckSession({
        success: () => {
          this.reloadFlag = Math.random()
        },
        fail: () => {
          this.$toast('请先登录')
          // // 关闭当前页面
          setTimeout(() => {
            this.tools.back()
          }, 1000)
        }
      })
    } catch (err) {
      console.log('err: ', err);
    }
    this.envInfo = await this.tools.ready(['token'])
    console.log('this.envInfo: ', this.envInfo);
    this.createService()
    console.log('🐒>>>>>> beforeInit', this.envInfo)
  }

  createService() {
    this.services = createService()
  }
  pageInit() {
    console.log('pageInit')
  }
  afterInit() {
    console.log('afterInit')
  }
  get filter() {
    return this.orderTabs[this.selectedTabIndex]['key'] || '0'
  }
  get isAll() {
    return this.selectedTabIndex === 0
  }
  changeTab(_, index) {
    this.selectedTabIndex = index
    this.resetPage() // 每次切换tab需要重置下页数
    this.resetList()
    this.handleTabClickLx(_, index)
  }
  resetPage() {
    this.nextPageNo = 1
  }
  resetList() {
    this.showOrderListBottomText = false
    this.orderList = []
  }
  fetchList() {
    console.log('>>>>🔥fetchList trigger', this.envInfo)
    const filter = this.filter
    const requestParams = {
      ordersearchscene: 'Joy',
      ordertab: Number(filter),
      pageno: this.nextPageNo,
      pagesize: 20,
      platform: this.envInfo.platform,
      version: this.envInfo.uaInfo?.version,
      token: this.envInfo.token,
      channel:  this.envInfo.channel,
    }
    return this.services.getOrderList(requestParams)
    .then((res) => {
      console.log('res: ', res);
      const { hasNextPage, nextPageNo, orderList } = res
      console.log('orderList: ', orderList);
      if (filter !== this.filter) return // 已经切换了tab，如果还有数据返回，不会继续处理
      this.nextPageNo = hasNextPage ? nextPageNo : 1 // 后端没数据的时候nextPageNo为null，此时置为1
      this.orderList = this.orderList.concat(orderList)
      return res
    })
    .catch((e) => {
      console.log('获取订单列表错误', e)
      throw e
    }).finally(() => {
      this.showOrderListBottomText = true
    })
  }
  jumpToPoi(orderInfo: OrderItem) {
    console.log('orderInfo: ', orderInfo);
    if (orderInfo.headerUrl) {
      this.tools.openLink(orderInfo.headerUrl)
    }
  }
  triggerOperation(operationInfo: Operation, orderInfo: OrderItem, index: number) {
    console.log('operationInfo: ', operationInfo);
    this.handleOrderItemClickLx(2, orderInfo, index, {
      title: operationInfo.text,
    })
    // 如果有按钮操作类型，就执行对应函数
    if (operationInfo.operationType === BUTTON_TYPE.DELETE) {
      this.showOrderDeleteDialog(orderInfo, index)
      return
    }
    // 目前只有跳转能力
    if (operationInfo.url) {
      this.tools.openLink(operationInfo.url)
    }
  }
  // 展示订单删除弹窗
  showOrderDeleteDialog(item: OrderItem, index: number) {
    if (!item.canDelete) {
      this.$toast('该订单不可删除')
      return
    }
    console.log('item: ', item, index, this.orderList);
    // 这里相当于重新设置orderList，让当前列表重新渲染，这样删除按钮就会隐藏
    const cloneOrderList = JSON.parse(JSON.stringify(this.orderList))
    this.orderList = cloneOrderList
    this.currentSelectedOrder = item
    this.showOrderDeleteConfirmDialog = true
  }
  // 关闭订单删除弹窗
  closeOrderDeleteDialog() {
    this.showOrderDeleteConfirmDialog = false
  }
  // 删除订单(调用接口)
  deleteOrder(item: OrderItem) {
    const requestParams = {
      url: item.deleteUrl,
      token: this.envInfo.token,
      userid: item.userId,
      orderid: item.orderInfo.orderId,
      platformId: 0,
      version: this.envInfo.uaInfo?.version,
      channel:  this.envInfo.channel,
      type: item.type,
      index: item.type
    }
    console.log('requestParams: ', requestParams);
    return this.services.deleteOrder(requestParams)
      .then((res) => {
        // 删除成功，前端删除订单，找到对应请求的这笔订单id，更新订单数组
        console.log('res: ', res);
        this.$toast('删除成功')
        const filterOrderList = this.orderList.filter(order => order.orderInfo.orderId !== item.orderInfo.orderId)
        this.orderList = filterOrderList
        console.log('orderList: ', filterOrderList);
      }).catch(err => {
        console.log('订单删除失败', err);
        this.$toast(err?.msg || err?.content || '订单删除失败')
      }).finally(() => {
        this.closeOrderDeleteDialog()
      })
  }
  jumpToOrder(orderInfo: OrderItem, index: number) {
    this.handleOrderItemClickLx(1, orderInfo, index)
    if (!orderInfo.orderInfo?.orderDetailUrl) {
      this.$toast('跳转失败')
      return
    }
    this.tools.openLink(orderInfo.orderInfo?.orderDetailUrl)
  }
  // 打点相关方法
  handleTabViewLx() {
    this.orderTabs.forEach((item) => {
      lxTrackMGEViewEvent('gc', this.lxInfo.tab_mv, this.lxInfo.cid, {
        status: 0,
        tab_name: item['label'],
      })
    })
  }
  handleTabClickLx(_, index) {
    // 产品这里希望知道list是否有值，需要延迟打个点
    setTimeout(() => {
      lxTrackMGEClickEvent('gc', this.lxInfo.tab_mc, this.lxInfo.cid, {
        status: this.orderList.length > 0 ? 1 : 0,
        tab_name: this.orderTabs[index]['label'],
      })
    }, 1000)
  }
  handleOrderItemViewLx(item: OrderItem, index: number) {
    lxTrackMGEViewEvent('gc', this.lxInfo.order_mv, this.lxInfo.cid, {
      exchange_type: item.partnerId,
      index,
      order_category_id: 2,
      order_id: item.orderInfo.orderId,
      order_st: item.orderInfo.orderStatus,
      tab_name: this.orderTabs[this.selectedTabIndex]['label']
    })
  }
  handleOrderItemClickLx(click_type: number, item: OrderItem, index: number, opts?: Record<string, any>) {
    lxTrackMGEClickEvent('gc', this.lxInfo.order_mc, this.lxInfo.cid, {
      click_type,
      title: opts && opts.title || '',
      exchange_type: item.partnerId,
      index,
      order_category_id: 2,
      order_id: item.orderInfo.orderId,
      order_st: item.orderInfo.orderStatus,
      tab_name: this.orderTabs[this.selectedTabIndex]['label']
    })
  }
}

export default OrderListPage
