/**
 * ==========通用 start==========
 */

/**
 * base response
 */
export interface Response<T> {
  code: number // 业务返回码
  data: T // 返回数据，responseData 的泛型
  msg: string // 返回信息
  message?: string
  type?: string
}

export enum REFUND_STATUS_ENUM {
  INIT = 0, // 未退款
  REFUNDING = 1, // 退款中
  REFUND_AUDITING = 2, // 退款审核中
  REFUND_SUCCESS = 3, // 退款成功
  REFUND_FAILED = 4, // 退款失败
  REFUND_CANCEL = 5 // 退款撤销
}

// 按钮类型
export enum BUTTON_TYPE_ENUM {
  PAY_ORDER = 1, // 去支付
  REBOOK = 2, // 重新预订
  COMMENT = 3, // 去点评
  SHARE_FRIENDS = 4, // 告诉朋友
  REFUND = 5, // 申请退款
  TRYOTHER = 6 // 试试其他店
}

export enum ORDER_DISPLAY_STATUS {
  INIT = 0, // 处理中
  TO_PAY = 1, // 待付款
  CANCELED = 2, // 未付款，订单取消
  TO_ACCEPT = 3, // 等待商家接单      // 接单时间内
  NEXT_TO_ACCEPT = 4, // 等待商家接单 // 下一个可接单时间
  SHOP_UN_ACCEPT_REFUNDING = 5, // 商户未接单，退款中
  SHOP_UN_ACCEPT_REFUND_SUCCESS = 6, // 商户未接单，退款成功
  SHOP_UN_ACCEPT_REFUND_FAILED = 7, // 商户未接单，退款失败
  USER_CANCEL_SHOP_AUDITING = 8, // 订单已取消，等待商家确认退款
  USER_CANCEL_REFUNDING = 9, // 订单已取消，退款中
  USER_CANCEL_REFUND_SUCCESS = 10, // 订单已取消，退款成功
  USER_CANCEL_REFUND_FAILED = 11, // 订单已取消，退款失败
  BUY_FAILED = 12, // 购买失败
  BUY_SUCCESS = 13, // 预订成功
  BUY_SUCCESS_REFUND_CANCEL = 14, // 预订成功，退款已撤销
  USER_REFUND_APPEAL_CS_AUDITING = 15, // 等待客服处理
  USER_REFUND_APPEAL_FAILED = 16, // 退款申诉失败
  USER_REFUND_APPEAL_SUCCESS = 17, // 退款申诉成功
  USER_REFUND_APPEAL_SUCCESS_REFUNDING = 18, // 退款申诉成功，退款中
  CONSUMED = 19, // 已消费
  COMMENTED_REFUND_CANCEL = 20, // 已消费，退款已撤销
  POOL_PRPCESS = 21 // 拼场中
}

// 商品信息
export interface IProductInfo {
  productType: number
  // productItemAttrDesc: string
  unitPrice: number
  priceNo: string
  priceVersion: number
  minCount: number
  maxCount: number
  productCode: number
  productName: string

  suitableShopCount: number // 适用商户数量
  productPicUrl: string // 商品图
  skuName: string // 商品名称
  skuId: number // 商品项Id
  spuId: number // 商品skuId
  spuType: number // 商品业务类型
}

// 门店信息
export interface IShopInfo {
  shopId: number // 美团门店id
  dpShopUuid: string // 点评门店uuid
  shopUuid: string // 点评门店id
  shopName: string // 店铺名称
  shopContractPhoneList: string[] | null // 商户电话
  showType: string | null
  mainCategoryId: number // 门店前台类目
  shopAddress?: string
}

// 订单信息
export interface IOrderInfo {
  orderId: string // 订单编号
  orderAddTime: string // 订单下单时间
  productCode: string // 业务类型 退款需要参数
  payOrderId: number // 短订单号
  cooperationBizType: number // 业务类型
  bookMobile: string // 预定人手机号
  bookName: string // 预订人姓名
  commentScore: number // 评价分数
  totalAmount: string // 订单总金额
  promoAmount: string // 优惠金额
  paidAmount: string // 实际付款
  reviewId: string // 订单评价id
}

// 支付设置（注意不是支付参数）
export interface IPaymentSetting {
  callbackUrl: string
  cashierType?: string
  extraData?: string
  closeCurrentPage?: boolean
}

// 预订信息
export interface IBookingInfo {
  productDesc: string // 商品描述
  reserveTime: string // 预定时间
  acceptDeadlineConfig: number // 商家接单截止时间配置
  aheadArriveTime: number // 提前到店时间
  displayPoolProcess: boolean
}

// 套餐信息
export interface IPackageInfo {
  packageInfoList: Array<{
    name: string
    price: string | number
    quantity: number
  }> // 套餐列表信息
  priceNo: string | number
  skuId: string | number
  skuName: string
  marketPrice: number
  specialPrice: number
  maxCount: number
  minCount: number
  quantity: number
  packageDetailDialogShow: boolean // 是否展示套餐详情弹窗，默认为false
}

export interface IPayParams {
  degradeInfo: {
    tradeNO: string
    degradeExtParam: string
    payToken: string
  } | null // 降级支付信息
  degradeStatus: boolean // 是否降级支付
  needRedirect: boolean
  payToken: string
  tradeNO: string
  uniOrderId: string
  wxPayUrl: string | null
}

// 申请支付返回信息
export interface IApplyPaymentResponse {
  payParams: IPayParams
  token: string
  uniOrderId: string
}
/**
 * ==========通用 end==========
 */

/**
 * 富文本字段
 */
export interface IJsonText {
  text: string
  strong?: boolean
  color?: string
  fontSize?: string
  backgroundColor?: string
  fontWeight?: number
  arrow?: boolean
  icon?: string
  link?: boolean
}

export enum Channel {
  DP = 'dp',
  MT = 'mt'
}
