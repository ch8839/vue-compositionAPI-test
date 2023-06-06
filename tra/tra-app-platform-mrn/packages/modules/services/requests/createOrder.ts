import { Env } from '@nibfe/multi-platform-env/types/mrn'
import { checkRespnse } from '../utils/error'
import { Fetch } from '../service-interfaces'
import { IPayParams, Response } from '../interfaces/common'
import qs from 'qs'
import { ServiceRequestConfig } from '../factory'

/**
 * 折扣卡 / 玩乐卡信息
 */
export interface ICardInfo {
  vipCardNo: string
  cardPromoCipher: string
  couponToken: string
}

/**
 * KTV 专用
 */
export interface IKTYInfo {
  dpId: string
  version_name: string
  f: string
  ticket: string
  signature: string
  bookDateTimestamp: number
  eventPromoChannel: string
  extraChargeItemId: string
  extraChargePrice: string
  extraChargePriceVersion: string
  extraChargeType: string
}

/**
 * 统一预订通用
 */
export interface IBarPackage {
  packageItemId: string
  packageQuantity: number
  packagePriceNo: number
}

/**
 * 酒吧套餐定制
 */
export interface IBookInfo {
  unitPrice: number | null
  priceNo: string
  priceVersion: number
  purchaseDate: number
  appPeriodStr: string
  appPeriodId: string
  signAgreement: number // 是否勾选了协议
  oneClickPayStatus: number // 极速支付状态 （单独购买时预支付用这个参数，玩乐卡搭售时下单需要这个参数。）
  bookAll: boolean // 是否是包场
  poolId: number // 拼场Id
  orderRemark: string // 订单备注
  bookName: string // 预订人姓名
  gender: number // 预订人性别
}

export type CreateOrderParams = {
  // I. 用户信息
  mobile: string
  //   cx: params.cx
  //   token: params.token

  // II. 设备 / 环境信息
  //   openId: params.openId
  //   uuid: params.uuid
  //   cityId: params.cityId
  //   channel: params.channel
  //   platform: params.platform
  //   clientType: params.clientType
  clientVersion: string
  osName: string
  //   appId: params.appId

  // III. 业务信息
  // 3.1. 通用信息
  productItemId: number
  arriveTime?: number
  leaveTime?: number //params.leaveTimeStamp
  cooperationBizType: number | string //params.cooperationBizType
  shopId: string | number
  shopuuid: string
  encryptedPromoString: string
  quantity: number
  cipher: string // 优惠参数

  needUseVirtualNumber?: number

  // 3.2. 折扣卡 / 玩乐卡信息
  //   vipCardNo?: number
  //   cardPromoCipher?: string
  //   couponToken?: string

  // 3.3. KTV 专用
  //   dpId?: string
  //   version_name?: string
  //   f?: string
  //   ticket?: string
  //   signature?: string
  //   bookDateTimestamp?: number
  //   eventPromoChannel?: string
  //   extraChargeItemId?: string
  //   extraChargePrice?: string
  //   extraChargePriceVersion: string
  //   extraChargeType?: string

  // 3.4 统一预订通用
  //   unitPrice?: number
  //   priceNo?: string
  //   priceVersion?: string
  //   purchaseDate?: number
  //   appPeriodStr?: string
  //   appPeriodId?: number
  //   signAgreement?: 0 // 是否勾选了协议
  //   oneClickPayStatus?: number // 极速支付状态 （单独购买时预支付用这个参数，玩乐卡搭售时下单需要这个参数。）
  //   bookAll?: boolean // 是否是包场
  //   poolId?: string // 拼场Id
  //   orderRemark?: string // 订单备注
  //   bookName?: string // 预订人姓名
  //   gender?: number // 预订人性别

  // 酒吧套餐定制
  //   packageItemId: string
  //   packageQuantity: number
  //   packagePriceNo: number
} & Pick<
  Env,
  | 'cx'
  | 'token'
  | 'openId'
  | 'uuid'
  | 'cityId'
  | 'channel'
  | 'platform'
  | 'clientType'
  | 'appId'
> &
  Partial<ICardInfo> &
  Partial<IKTYInfo> &
  Partial<IBookInfo> &
  Partial<IBarPackage>

// createOrder(params) {
//     console.log('params: ', params)
//     const requestParams = {
//       // I. 用户信息
//       mobile: params.mobileuserMobile,
//       cx: params.cx,
//       token: params.token,
//       // II. 设备 / 环境信息
//       openId: params.openId,
//       uuid: params.uuid,
//       cityId: params.cityId,
//       channel: params.channel,
//       platform: params.platform,
//       clientType: params.clientType,
//       clientVersion: params.clientVersion,
//       osName: params.osName,
//       appId: params.appId,
//       // III. 业务信息
//       // 3.1. 通用信息
//       productItemId: params.skuId,
//       arriveTime: params.arriveTimeStamp,
//       leaveTime: params.leaveTimeStamp,
//       cooperationBizType: params.cooperationBizType,
//       shopId: params.shopId,
//       shopuuid: params.shopuuid,
//       encryptedPromoString: params.encryptedPromoString,
//       quantity: params.quantity,
//       cipher: params.cipher, // 优惠参数

//       // 3.2. 折扣卡 / 玩乐卡信息
//       vipCardNo: params.vipCardNo,
//       cardPromoCipher: params.cardPromoCipher,
//       couponToken: params.couponToken,

//       // 3.3. KTV 专用
//       dpId: params.dpId,
//       version_name: params.version_name,
//       f: params.f,
//       ticket: params.ticket,
//       signature: params.signature,
//       bookDateTimestamp: params.bookDateTimeStamp,
//       eventPromoChannel: params.eventPromoChannel,
//       extraChargeItemId: params.extraChargeItemId,
//       extraChargePrice: params.extraChargePrice,
//       extraChargePriceVersion: params.extraChargePriceVersion,
//       extraChargeType: params.extraChargeType,

//       // 3.4 统一预订通用
//       unitPrice: params.unitPrice,
//       priceNo: params.priceNo,
//       priceVersion: params.priceVersion,
//       purchaseDate: params.purchaseTimeStamp,
//       appPeriodStr: params.appPeriodStr || null,
//       appPeriodId: params.appPeriodTimeStamp,
//       signAgreement: 0, // 是否勾选了协议
//       oneClickPayStatus: params.oneClickPayStatus || 0, // 极速支付状态 （单独购买时预支付用这个参数，玩乐卡搭售时下单需要这个参数。）
//       bookAll: params.bookAll, // 是否是包场
//       poolId: params.poolId, // 拼场Id
//       orderRemark: params.orderRemark, // 订单备注
//       bookName: params.bookName, // 预订人姓名
//       mobile: params.mobile, // 预订人手机号
//       gender: params.gender, // 预订人性别

//       // 酒吧套餐定制
//       packageItemId: params.packageItemId,
//       packageQuantity: params.packageQuantity,
//       packagePriceNo: params.packagePriceNo,
//     }
//     if (!requestParams.poolId) delete requestParams.poolId
//     return axios({
//       url: this.CREATE_ORDER,
//       method: 'post',
//       headers: {
//         'content-type': 'application/x-www-form-urlencoded',
//       },
//       data: qs.stringify(requestParams),
//     }).then(res => res.data)
//   }

export interface ICreateOrderResp {
  uniOrderId: string
  shortOrderId: number
  payParams?: IPayParams
}

export function createOrder(
  fetch: Fetch<Response<ICreateOrderResp>>,
  params: CreateOrderParams
): Promise<Response<ICreateOrderResp>> {
  const requestParams = {
    ...params
  }
  const fetchPatams: ServiceRequestConfig = {
    url: '/dztrade/groupbuy/online/submitorder',
    params: requestParams,
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      mkscheme: 'https'
    },
    // data: qs.stringify(requestParams)
  }
  return fetch(fetchPatams).then(data => checkRespnse(data, fetchPatams))
}
