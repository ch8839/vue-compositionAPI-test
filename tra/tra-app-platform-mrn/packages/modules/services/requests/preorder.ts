import { Env } from '@nibfe/multi-platform-env/types/mrn'
import { pick } from 'lodash'
import { IProductInfo, IShopInfo, Response } from '../interfaces/common'
import { Fetch } from '../service-interfaces'
import { checkRespnse } from '../utils/error'
import { preOrderMock } from '../mocks/booking_create_order'

export interface IUserInfo {
  mobile: string
  remark?: string // 备注
  name?: string
  gender?: number
  address?: string
  idNumber?: string
  marriage?: number
}

export interface IVirtualNumberInfo {
  show: boolean
  use: boolean
}

export interface ChargeInfo {
  extraChargePrice?: string
}

export interface IPreorderResp {
  userMobile: string
  shopId: number
  shopuuid: string
  shopName: string
  productId: number
  productName: string
  productItemId: number
  productItemName: string
  unitPrice: number
  reduceRules?: {
    reduceRuleID: number
    discountPersonNum: number
    discountMoney: number
    discountDesc: string
  }[]
  unit?: string
  unitType: number
  priceNo: string
  priceVersion: number
  minCount: number
  maxCount: number
  cooperationBizType: number
  metaAttributeMap?: any
  productCode: number
  bizType: number
  productType: number
  spuType: number
  suitableShopCount: number
  cityName?: any
  useDaysAfterOrder: number
  spuId: number
  showVirtualNumber: boolean
  title: string
  subTitle: string
  purchaseDateDesc: string
  acceptRule?: any
  refundRule: RefundRule
  reserveRuleNotice?: any
  purchaseDate: number
  arriveDate: number
  appPeriodId?: any
  appPeriodStr?: any
  poolInfoData?: any
  aheadArriveTime: number
  packageInfo?: any
  addPriceType: number
  startAddCount: number
  minAddCount: number
  maxAddCount: number
  additionalPrice?: any
  seatInfoList?: any
  thirdPartyName?: string
  venueInfoList?: {
    venueName: string
    period: string
  }[]
  arriveTimeStart?: string
  leaveTimeEnd?: string
  dailyPriceInfoDTOList?: {
    arriveTime: number
    price: number
  }[]
  productItemBeans?: any
  purchaseMode: number
  washingInstruction?: any
  deliveryNotice?: any
  cancelRuleDesc?: any
  showPromoDesk: boolean
  oneClickPayDisplayDTO?: {
    defaultPayType: number | string
    disPlayStatus: number
    guideMessage?: string
    needGuideMarkSwitch: any
    oneClickPaySubTitle: string
    serialCode: string
    useStatus: boolean
  }
  douHuABTestDTO: DouHuABTestDTO
  coachName?: any
  extraChargeInfo?: ChargeInfo
  ktvItems?: KtvItem[]
  purchaseNotes?: Array<any>

  thirdPartyChargeInfo?: ChargeInfo
  refundRelativeHours?: number

  // 金额明细
  amountDetailVO?: any
  // 优惠明细
  promoDeskVO?: any
  // 权益台明细
  cardInfoVO?: any
  stage?: number // 无需关注
}

export interface KtvItem {
  saleType: number
  index: number

  productId: number
  itemId: number
  itemName: string
  itemPackageDesc: string
  itemPrice: number
  minOrderNum: number
  signHour: number
  periodType: number
}

// interface RootObject {
//   productId: number;
//   itemId: number;
//   itemName: string;
//   itemPackageDesc: string;
//   itemPrice: number;
//   saleType: number;
//   minOrderNum: number;
//   signHour: number;
//   periodType: number;
// }

export interface DouHuABTestDTO {
  douHuTestList: DouHuTestList[]
}

export interface DouHuTestList {
  actionType: string
  strategyId: string
  moduleAbInfo4Front: string
}

export interface RefundRule {
  hoursBefore: number
  refundDate?: any
  refundTime: number
  beforeTimeStamp: number
  refundable: boolean
}

export type PreorderProductInfo = Pick<
  IProductInfo,
  | 'minCount'
  | 'productType'
  | 'unitPrice'
  | 'minCount'
  | 'maxCount'
  | 'productCode'
  | 'productName'
  | 'suitableShopCount'
  | 'spuId'
  | 'spuType'
  | 'skuId'
  | 'skuName'
  | 'priceVersion'
  | 'priceNo'
>

export type PreorderShopInfo = Pick<
  IShopInfo,
  'shopId' | 'shopName' | 'shopUuid'
>

export enum InteractType {
  CHANGE_QUANTITY = 0, // 数量改变
  SELECT_TIME = 1, // 选择时间
  SELECT_DAY = 2, // 选择日期
  CHANGE_CARD_STATUS = 3, // 勾选和反勾选卡
  SELECT_PROMO = 4, // 选择优惠并确定
}
export type PreorderRespFormated = {
  productInfo: PreorderProductInfo
  shopInfo: PreorderShopInfo
  userInfo: IUserInfo
  virtualNumberInfo: IVirtualNumberInfo
  cityName: string

  ktvItems: KtvItem[]
  thirdPartyChargeInfo?: ChargeInfo

  // 表示哪种交互引起的preorder接口请求
  interactType?: InteractType
} & IPreorderResp
export enum PromoType {
  BOOKING_PROMO = "MARKET_PRICE_PROMO",
  MERCHANT_COUPON = "shopCoupon",
  PLATFORM_COUPON = "coupon",
  CARD_PROMO_BEFORE_BUY_CARD = "equityDeskCard",
  CARD_PROMO_AFTER_BUY_CARD = "discountCard",
  PLATFORM_PROMO = "promo",
  MERCHANT_PROMO = "shopPromo"
}
export enum ActionType {
  NONE = 'none',
  CHECK_BOX = 'checkbox',
  REDIRECT = 'redirect'
}
export enum SelectedState {
  SELECTED = 1,
  UNSELECTED = 0,
}
export interface PromoSnapshot {
  promoId: string // 优惠唯一Id
  promoType: PromoType //优惠类型
  selectedState: SelectedState //操作后状态 1-选中 0-未选中
}
export enum SceneType {
  INITIAL = 0,
  OTHER = 1,
}
export interface PromoInfo {
  promoSnapshotList: Array<PromoSnapshot> // 用户选择的优惠状态(快照)
  promoExtMap: any // 优惠扩展字段，前端用来透传给营销的字段
  operatorPromoType: PromoType // 本次用户操作的是哪个优惠类型（商家立减、平台优惠等），页面首次进入不用传递或没有操作优惠不用回传递
}
export type PreorderParams = {
  productItemId: string // 商品skuId
  shopId: IShopInfo['shopId'] // 商户id
  shopIdStr: string // 商户id字符串形式
  shopuuid: IShopInfo['shopUuid'] // 点评商户id
  //   cityId: params.cityId // 城市id
  //   channel: params.channel // 下单软件平台，后期改为 enum
  //   platform: params.platform // 下单终端平台，后期改为 enum
  //   clientType: params.clientType // 下单客户端类型，后期改为 enum
  clientVersion: string // 下单客户端类型版本
  //   uuid: params.uuid // 设备id
  //   token: params.token // 用户令牌 token
  //   openId: params.openId // 小程序用户id
  cooperationBizType: string | number
  // latitude: Env['lat']
  // longitude: Env['lng']

  arriveTime?: number // 到店时间
  leaveTime?: number // 离店时间
  purchaseDate?: number // 购买时间

  appPeriodId?: string
  appPeriodStr?: string

  // >>>>> ktv专有字段
  roomType?: string // 房间类型
  eventPromoChannel?: string
  // lat: Env['lat']
  // lng: Env['lng']
  f?: string
  ticket?: string
  signature?: string

  // 酒吧套餐
  packageItemId?: string

  // 新ktv字段
  periodResourceId?: string
  roomResourceId?: string

  // 权益台字段
  vipCardId?: string // 折扣卡id，初次加载后，后面需要前端传递，确定卡
  selectedCard?: SelectedState // 是否勾选会员卡

  // 优惠台字段
  promoDeskJson?: string

  // MRN下单页新增
  stage?: number // 此处只会传2 2代表新下单页(MRN)
  unionId?: string // unionId
  uuid?: string // uuid，营销使用
  appVersion?: string // App版本，营销使用
  quantity?: number // 针对足疗下单页场景：购买数量（首次进入可不传值），后面进入必须要传值
  sceneType?: SceneType // 针对足疗下单页场景：0 - 首次进入提单页 1 - 用户在提单页上进行操作（加减数量，选择优惠，选择权益台等）
} & Pick<
  Env,
  | 'cityId'
  | 'channel'
  | 'platform'
  | 'clientType'
  | 'uuid'
  | 'token'
  | 'openId'
  | 'lat'
  | 'lng'
>

export function preorder(
  fetch: Fetch<Response<IPreorderResp>>,
  params: PreorderParams
): Promise<PreorderRespFormated> {
  const requestParams = {
    ...params,
    latitude: params.lat,
    longitude: params.lng
  }
  const fetchPatams = {
    url: '/dztrade/groupbuy/online/preorder',
    params: requestParams,
    method: 'GET',
    headers: {
      mkscheme: 'https'
    },
  }
  return fetch(fetchPatams)
    .then(data => {
      return checkRespnse(data, fetchPatams)
    })
  // return new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     resolve(preOrderMock)
  //   }, 1000)
  // })
    .then((res: Response<IPreorderResp>) => {
      const data = res.data
      const productInfo: PreorderProductInfo = {
        ...pick(data, [
          'minCount',
          'productType',
          'unitPrice',
          'minCount',
          'maxCount',
          'productCode',
          'productName',
          'suitableShopCount',
          'spuId',
          'spuType',
          'priceVersion',
          'priceNo'
        ]),
        skuId: data?.productItemId,
        skuName: data?.productItemName,
        spuId: data?.productId
      }

      const shopInfo: PreorderShopInfo = {
        ...pick(data, ['shopId', 'shopName']),
        shopUuid: data.shopuuid
      }

      const userInfo: IUserInfo = {
        mobile: data.userMobile
      }

      const virtualNumberInfo: IVirtualNumberInfo = {
        show: !!data.showVirtualNumber,
        use: !!data.showVirtualNumber
      }

      const ktvItems =
        data.ktvItems?.map(item => ({
          ...item,
          saleType: item.saleType - 1
        })) || []

      return {
        ...res.data,
        shopInfo,
        productInfo,
        userInfo,
        virtualNumberInfo,
        cityName: data.cityName || '',
        ktvItems,
        thirdPartyChargeInfo: data.thirdPartyChargeInfo || data.extraChargeInfo
      }
    })
}
