import { Response, Channel } from '../interfaces/common'
import { Fetch } from '../service-interfaces'
import { mt_mock, dp_mock } from '../mocks/order_list_mock'

export interface GetOrderList {
  (fetch: Fetch, params: OrderListParams): Promise<Response<OrderListInfo>>
}

export enum PLATFORM_TYPE {
  IOS = 0,
  ANDROID = 1
}

export enum BUTTON_TYPE {
  DELETE = 1
}

export interface OrderListParams {
  ordersearchscene: string // 订单列表查询场景（休娱/丽人/医美等）
  ordertab: number // 单状态tab（美团订单中心默认查全部tab） 0:全部状态, 1:待付款, 2:待使用, 3:退款/售后
  pageno: number // 当前页，从0开始
  pagesize: number // 页大小，约定20
  platform: string
  version: string // 客户端版本号
  token: string
  dpid?: string
  channel: Channel
}

export interface OrderListResult<T> {
  orderList: Array<T>
  hasNextPage: boolean
  nextPageNo: number // 需要塞下一页的页码
}

// ===== mt =====
export interface MtOrderVO {
  [key: string]: any
  orderid: number
  stringOrderId: string
  showStatus: string // 展示状态
  dealPic: string // 订单图片地址
  partnerId: number // 业务方编号
  orderInfo: string[], // 订单显示信息
  buttons: Array<MtButtonDTO>
  title: string // 订单标题
  ordertime: number // 下单时间(秒)
  orderDetail: string // 订单详情页地址
  expiring: boolean // 订单即将过期标记（综订和团购都没有使用，但还是保留该字段，透传即可）
  deleteUrl: string // 订单删除的URL地址，参数以post形式传递orderid和token
  allstatus: number
  topaystatus: number
  tousestatus: number
  tofbstatus: number
  torfstatus: number
  toReceiveStatus: number
  canDelete: number, // 删除标记 0:不可删除 1:可删除
  bgIcon: string // bg的图标(休娱用了固定的)
  activeReceiptList: string[] // “待使用”状态团购订单的可使用券码，最多三张
  userId: number // 订单的用户id
}

export interface MtButtonDTO {
  text: string
  imeituan: string // 点击按钮后的跳转地址
  style: number // 展示样式：0浅色，1深色
}

// ===== dp =====

export interface DpOrderVO {
  [key: string]: any
  orderId: string // 订单号
  createTime: number
  id: number // 订单中心订单唯一标识id
  type: number // 业务方标识
  updateTime: number // 更新时间
  statusText: string // 订单状态文字
  statusStyle: number // 订单状态样式
  title: string // 订单标题
  text1: string // 第一行文字，实际为空，取dealName
  text2: string // 展示用文字
  clickUrl: string // 点击订单跳转链接, dianping://开头并encode
  event: string // 订单标签
  orderPicUrl: string // 订单图片
  headerTitle: string // 头部标题, 商户名或团单名
  headerUrl: string // 头部点击跳转链接, 商户页/团单详情页入口, dianping://开头并encode
  channelName: string // 频道文案
  channelIcon: string // 频道icon
  canDelete: number // 是否可删除
  buttonList: Array<DpButtonDTO>
  price: string // 订单价格
  dealName: string // 商品名称
  encourage: string // 激励文案
  activeReceiptList: string[] // “待使用”状态团购订单的可使用券码，最多三张
}

export interface DpButtonDTO {
  buttonText: string
  buttonStyle: number // 1-正常，2-高亮
  buttonUrl: string
  buttonType?: BUTTON_TYPE // 按钮操作类型
}

export interface DeleteOrderParams {
  url: string // 请求删除url
  token: string
  userid: number
  orderid: string
  platformId: PLATFORM_TYPE
  version: string
  channel: Channel
  type?: number
  index?: number
}

export interface MtDeleteOrderParams {
  url: string // 请求删除url
  token: string
  userid: number
  orderid: string | number
  platformId: PLATFORM_TYPE
  version: string
  channel: Channel
}

export interface DpDeleteOrderParams {
  orderid: string
  type: number
  index: number
}

export interface DeleteOrderRes {
  code: number
  message?: string
  msg?: string
}

// =============== 前端模型 ===============

export interface OrderListInfo {
  orderList: Array<OrderItem>
  hasNextPage: boolean
  nextPageNo: number
}
export interface OrderItem {
  shopInfo: {
    shopName: string,
    shopId?: string | number
    canJumpHeader?: boolean
  }
  orderInfo: {
    orderPic: string
    orderId: string | number
    orderStatus: string,
    orderDesc: unknown[],
    orderDetailUrl: string
  }
  receiptList: string[], // 券码信息
  operations: Array<Operation>
  productInfo?: {
    skuName: string
    skuId?: string
  }
  partnerId?: string | number
  headerUrl?: string // 门店跳转Url
  // 美团侧定制字段，点评和美团的订单删除交互规范不一样，美团是左滑删除，点评是按钮点击删除
  canDelete?: number
  deleteUrl?: string
  userId?: number
  type?: number // 订单类型，点评侧才有的字段
}

export interface Operation {
  text: string
  style: number // 展示样式：0浅色，1深色
  url: string // 点击按钮后的跳转地址
  operationType?: BUTTON_TYPE // 按钮操作类型
}

export function getOrderList(
  fetch: Fetch<OrderListResult<MtOrderVO | DpOrderVO>>,
  params: OrderListParams
): Promise<OrderListInfo> {
  return params.channel === Channel.DP ? getDpOrderList(fetch as Fetch<OrderListResult<DpOrderVO>>, params) : getMtOrderList(fetch as Fetch<OrderListResult<MtOrderVO>>, params)
}

function getMtOrderList(
  fetch: Fetch<OrderListResult<MtOrderVO>>,
  params: OrderListParams
): Promise<OrderListInfo> {
  const url = '/dztrade/general/mtorderlist.api'
  // return new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     resolve(mt_mock)
  //   }, 1000)
  // })
  return fetch({
    url,
    params,
    isMapi: true,
  })
    .then((res: OrderListResult<MtOrderVO>) => {
      const formatted = transformMtListData(res)
      return formatted
    })
}

function getDpOrderList(
  fetch: Fetch<OrderListResult<DpOrderVO>>,
  params: OrderListParams
): Promise<OrderListInfo> {
  const url = '/dztrade/general/dporderlist.api'
  console.log('params: ', params);
  return fetch({
    url,
    params,
    isMapi: true,
  })
    // return new Promise((resolve, reject) => {
    //   setTimeout(() => {
    //     resolve(dp_mock)
    //   }, 1000)
    // })
    .then((res: OrderListResult<DpOrderVO>) => {
      const formatted = transformDpListData(res)
      return formatted
    })
}

function transformMtListData(raw: OrderListResult<MtOrderVO>): OrderListInfo {
  console.log('raw: ', raw);
  const formatted = {
    hasNextPage: raw.hasNextPage,
    nextPageNo: raw.nextPageNo || 0,
    orderList: raw.orderList && raw.orderList.map((orderDTO) => {
      const orederItemInfo: OrderItem = {
        shopInfo: {
          shopName: orderDTO.title || '',
          canJumpHeader: false
        },
        orderInfo: {
          orderPic: orderDTO.dealPic || '',
          orderId: orderDTO.stringOrderId || orderDTO.orderid || '',
          orderStatus: orderDTO.showStatus || '',
          orderDetailUrl: orderDTO.orderDetail || '',
          orderDesc: orderDTO.orderInfo || [],
        },
        receiptList: orderDTO.activeReceiptList || [],
        operations: orderDTO.buttons?.map((btn) => {
          return {
            text: btn.text || '',
            style: btn.style || 0, // 展示样式：0浅色，1深色
            url: btn.imeituan, // 点击按钮后的跳转地址
          }
        }) || [],
        partnerId: orderDTO.partnerId || orderDTO.partnerId,
        canDelete: orderDTO.canDelete,
        deleteUrl: orderDTO.deleteUrl,
        userId: orderDTO.userId,
      }
      return orederItemInfo
    })
  }
  console.log('formatted: ', formatted);
  return formatted
}

function transformDpListData(raw: OrderListResult<DpOrderVO>): OrderListInfo {
  console.log('raw: ', raw);
  const formatted = {
    hasNextPage: raw.hasNextPage || 0,
    nextPageNo: raw.nextPageNo || 0,
    orderList: raw.orderList && raw.orderList.map((orderDTO) => {
      console.log('orderDTO: ', orderDTO.text2);
      const orderDesc = orderDTO.text2 ? [orderDTO.text2] : [] as any[]
      orderDesc.unshift([{
        text: (orderDTO.text1 || ''),
        textsize: 13,
        strong: true,
        textcolor: '#111',
      }])
      const orederItemInfo: OrderItem = {
        shopInfo: {
          shopName: orderDTO.title || '',
          canJumpHeader: true
        },
        orderInfo: {
          orderPic: orderDTO.orderPicUrl || orderDTO.orderPic || '',
          orderId: orderDTO.orderId || orderDTO.orderid || orderDTO.extendOrderId || '',
          orderStatus: orderDTO.statusText || '',
          orderDetailUrl: orderDTO.clickUrl || '',
          orderDesc,
        },
        receiptList: orderDTO.activeReceiptList || [],
        operations: orderDTO.buttonList.map((btn) => {
          return {
            text: btn.buttonText || '',
            style: btn.buttonStyle === 2 ? 1 : 0, // 展示样式：0浅色，1深色
            url: btn.buttonUrl, // 点击按钮后的跳转地址
            operationType: btn.buttonType || 0, // 按钮类型
          }
        }) || [],
        canDelete: orderDTO.canDelete,
        partnerId: orderDTO.type, // 点评的业务方编号字段为type
        type: orderDTO.type, // 订单类型
        headerUrl: orderDTO.headerUrl, // 头部点击跳转链接, 商户页/团单详情页入口, dianping://开头并encode
      }
      // 点评的恶心逻辑，删除按钮前端需要单独处理
      if (orderDTO.canDelete) {
        orederItemInfo.operations.push({
          text: '删除',
          style: 0,
          url: '',
          operationType: 1
        })
      }
      return orederItemInfo
    })
  }
  return formatted
}

function getBaseUrlByUrl(url) {
  const reg = new RegExp(/(\w+):\/\/([^/:]+)(:\d*)?/)
  const matchObj = url.match(reg)
  const baseURL = matchObj && matchObj[0] || 'https://mapi.dianping.com' // 兜底mapi.dianping.com
  return baseURL
}

function deleteMtOrder(
  fetch: Fetch<DeleteOrderRes>,
  params: MtDeleteOrderParams
): Promise<DeleteOrderRes> {
  // 获取域名baseURL，域名参考：https://km.sankuai.com/collabpage/1406479370
  const baseURL = getBaseUrlByUrl(params.url)
  // return Promise.resolve({
  //   code: 200
  // })
  return fetch({
    baseURL,
    url: params.url,
    data: params,
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      mkscheme: 'https'
    }
  }).then((res: DeleteOrderRes) => {
    if (res.code === 0 || res.code === null) {
      // 0或者null表示成功，其他都表示失败。
      return res
    } else {
      return Promise.reject(res)
    }
  })
}

function deleteDpOrder(
  fetch: Fetch<DeleteOrderRes>,
  params: DeleteOrderParams
): Promise<DeleteOrderRes> {
  // 点评的删除都是mapi的域名：https://km.sankuai.com/collabpage/1406479370，删除链接是写死的
  const url = '/mapi/usercenter/uniorderdelete.bin'
  console.log('params: ', params);
  const dpParams: DpDeleteOrderParams = {
    orderid: params.orderid,
    type: params.type,
    index: params.type
  }
  return fetch({
    baseURL: 'https://mapi.dianping.com',
    url,
    params: dpParams,
    method: 'GET',
    isMapi: true,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    }
  }).then((res: DeleteOrderRes) => {
    if (res.code === 200) {
      return res
    } else {
      return Promise.reject(res)
    }
  })
}

export function deleteOrder(
  fetch: Fetch<DeleteOrderRes>,
  params: DeleteOrderParams
): Promise<DeleteOrderRes> {
  return params.channel === Channel.DP
    ? deleteDpOrder(fetch as Fetch<DeleteOrderRes>, params)
    : deleteMtOrder(fetch as Fetch<DeleteOrderRes>, params)
}

