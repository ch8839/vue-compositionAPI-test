import Big from 'big.js'
import dayjs from 'dayjs'
import _template from 'lodash/template'
import { lxTrackMGEClickEvent, lxTrackMGEViewEvent } from '@mrn/mrn-utils'
import { CreateOrderParams } from '../../../services/requests/createOrder'
import {
  PreorderRespFormated,
  PreorderParams,
  RefundRule,
  InteractType, 
  PromoType, ActionType
} from '../../../services/requests/preorder'
import { pageRouterClose } from '@mrn/mrn-utils'

import BaseOrderCreate from '../../base/order-create'

import 'dayjs/locale/zh-cn'
import { FetchBizError } from '../../../services/utils/error'
dayjs.locale('zh-cn')

interface ITimeInfo {
  appPeriodId: string
  appPeriodStr: string
  arriveTimeStamp?: number
  leaveTimeStamp?: number
  purchaseTimeStamp?: number
  purchaseTimeStr: string
  aheadArriveTimeStr: number | string
}

export const BOOKING_BY_TABLE = 1 // 按桌预订
export const BOOKING_BY_PERSON = 2 // 按人预订
export const POOL_MODE = 1 // 拼场模式
export const BOOK_ALL_MODE = 2 // 包场模式

export enum FORM_KEY {
  GENDER = 'gender',
  QUANTITY = 'quantity',
  PACKAGE_QUANTITY = 'packageQuantity',
  MOBILE = 'mobile',
  NAME = 'name',
  REMARK = 'remark'
}

interface BottomBannerTextParts {
  week?: string
  day?: string
  time?: string
  duration?: string
  number?: string
}
class BookingOrderCreate extends BaseOrderCreate {
  // transactionCode = '100088' // 前端定义的接口token

  // ============ 数据模型 start============
  // appPeriodId = '' // 有些业务用这个参数识别时段 。某些业务必填如美容业务
  // appPeriodStr = ''
  // arriveTimeStamp?: number = 0 // 前端链接上的到店时间的时间戳
  // leaveTimeStamp?: number = 0 // 离店时间
  // purchaseTimeStamp?: number = 0 // 预订时间点的时间戳
  // purchaseTimeStr = '' // 预订时间点的时间戳转换时间
  // aheadArriveTimeStr: number | string = '' // 开场前提前多少（分钟）到场（非时间戳）
  timeInfo: ITimeInfo = {
    appPeriodId: '', // 有些业务用这个参数识别时段 。某些业务必填如美容业务
    appPeriodStr: '',
    arriveTimeStamp: 0, // 前端链接上的到店时间的时间戳
    leaveTimeStamp: 0, // 离店时间
    purchaseTimeStamp: 0, // 预订时间点的时间戳
    purchaseTimeStr: '', // 预订时间点的时间戳转换时间
    aheadArriveTimeStr: '' // 开场前提前多少（分钟）到场（非时间戳）
  }

  // appPeriodTimeStamp = '' // 预订时间点的时间戳
  // appPeriodTimeStr = '' // 具体的时间点encode
  // productItemIds = '' // 这个我也不知道是啥，源代码里的
  // spuType = '' // 业务形式
  refundRule: RefundRule = {
    beforeTimeStamp: 0,
    hoursBefore: 0,
    refundDate: null,
    refundTime: 0,
    refundable: true
  } // 退款规则

  /** 页面模型 */
  poolId = '' // 新拼场带入poolId，用来区分同一个skuid下加入拼场场次id，来自货架页面
  poolInfo: any = null // 拼场信息
  isPinProduct = false // 是否是拼场商品
  unitType = 0 // 按桌拼场还是按人拼场，按桌预订拼场（金额不随数量变化）：1 按人预订拼场（金额随数量变化）：2
  pinTipsList = [] // 拼场信息提示
  backRoomMode = 0 // 拼场类型 0-不可拼不可包 拼场——1 包场——2
  isPinTipsShow = false // 是否展示拼场信息提示
  pinBookingTitleDesc = '拼场预订' // 拼场预订的标题文案
  blockBookingTitleDesc = '包场预订' // 包场预订的标题文案

  refundable = true // 是否可退款
  bizType: number | null = null // 预订bizType
  acceptRuleDesc = '' // 接单规则文案
  productAdditionalInfo: { text?: string; type?: string }[][] = [] // 商品详细信息

  // todo 没用到？
  submitForm = {
    userMobile: '',
    gender: '',
    quantity: 1, // 到店人数默认为1
    name: '',
    remark: ''
  } // 下单页的信息选择模型

  // todo 无用
  packageItemId = '' // 选择的套餐的skuid，来自货架页面
  // todo 无用
  packageQuantity: any
  purchaseNotes?: Array<any>

  submitFormBid = ''

  // 标价为原价的时间选择模块用的数据
  originalPriceTimeSelectData?: any = undefined
  // 标价为会员价的时间选择模块用的数据
  premiumPriceTimeSelectData?: any = undefined
  // 当前下单页是否选择了预订时间
  isTimeSelected: boolean = false
  // 支付底bar上面的说明文案
  bottomBannerTextParts: BottomBannerTextParts = {}
  // 选中的productItemId
  selectedProductItemId: string
  // 选中的到店时间
  selectedArriveTime: number
  // 未选择时间的情况，左下角价格数据（由货架接口出）
  bottomPriceData: any = undefined
  // 是否跨天
  isCrossDay: boolean = false

  /**
   * 初始化业务模块
   */
  // async initBusinessModule() {
  //   super.initBusinessModule()
  // }

  /**
   * 是否为按桌预订模式
   */
  get isTableBookingMode() {
    return this.unitType == BOOKING_BY_TABLE
  }

  /**
   * 是否为按人预订模式
   */
  get isPersonBookingMode() {
    return this.unitType == BOOKING_BY_PERSON
  }

  /**
   * 当前是否选中了拼场Tab
   */
  get isPoolMode() {
    return this.backRoomMode == POOL_MODE
  }

  /**
   * 当前是否选中了包场Tab/当前是否是包场模式
   */
  get isBookAllMode() {
    return this.backRoomMode == BOOK_ALL_MODE
  }

  /**
   * 是否展示拼场提示信息
   */
  get showPinTips() {
    return this.isPoolMode
  }

  /**
   * 手机号配置
   */
  get mobileConfig() {
    return {
      traKey: 'mobile',
      masked: true,
      value: this.userInfo.mobile,
      virtualNumber: this.virtualNumberInfo.show,
      useVirtualNumber: this.virtualNumberInfo.use
    }
  }

  /**
   * 姓名配置
   */
  get nameConfig() {
    return {
      traKey: 'name',
      title: '姓名',
      type: 'text',
      placeholder: '请输入姓名',
      value: this.userInfo.name
    }
  }

  /**
   * 性别配置
   */
  get genderConfig() {
    let value: number | string = ''
    // gender 1——女士 2——先生
    if (this.userInfo.gender == 1) value = 1
    else if (this.userInfo.gender == 2) value = 0
    else value = ''
    return {
      traKey: 'gender',
      title: '性别',
      options: [
        { id: 2, text: '先生' },
        { id: 1, text: '女士' }
      ],
      value
    }
  }

  /**
   * 数量选择配置
   */
  get quantityConfig() {
    const { minCount, maxCount } = this.productInfo
    const packMinCount =
      this.bookAll && this.poolInfo.packMinCount
        ? this.poolInfo.packMinCount || 1
        : minCount || 1
    const packMaxCount =
      this.bookAll && this.poolInfo.packMaxCount
        ? this.poolInfo.packMaxCount || 1
        : maxCount
    return {
      traKey: 'quantity',
      title: '数量',
      min: this.isBookAllMode ? packMinCount : minCount,
      max: this.isBookAllMode ? packMaxCount : maxCount,
      value: this.quantity
    }
  }

  /**
   * 附加信息
   */
  get productAdditional() {
    const { skuName } = this.productInfo
    const { purchaseTimeStr } = this.timeInfo
    if (skuName && purchaseTimeStr) {
      return [[{ text: skuName }, { type: 'split' }, { text: purchaseTimeStr }]]
    } else if (!skuName && !purchaseTimeStr) {
      return []
    } else {
      return [[{ text: skuName ? skuName : purchaseTimeStr }]]
    }
  }

  /**
   * 预订下单页预订须知
   */
  get bookingRuleInfo() {
    return {
      title: '预订须知：',
      ruleList: this.isPinProduct
        ? this.pinBookingRuleList
        : this.bookingRuleList
    }
  }

  /**
   * 普通预订商品预订须知列表
   */
  get bookingRuleList() {
    let res = []
    if(this.acceptRuleDesc) res.push([{ text: this.acceptRuleDesc }])
    if(this.purchaseNotes) res = res.concat(this.purchaseNotes)
    return res
    // return this.acceptRuleDesc ? [[{ text: this.acceptRuleDesc }]] : []
  }

  /**
   * 拼/包场预订商品预订须知列表
   */
  get pinBookingRuleList() {
    const { aheadArriveTimeStr } = this.timeInfo
    // 提前到店时间
    const aheadRuleList = aheadArriveTimeStr
      ? [
          [
            { text: '开场前' },
            { text: `${aheadArriveTimeStr}分钟`, strong: true },
            { text: '凭手机号码入场' }
          ]
        ]
      : []
    return aheadRuleList
  }

  /**
   * 预订下单页退款规则
   */
  get refundRuleInfo() {
    let cur = []
    if (
      ((this.poolInfo && this.poolInfo.backRoomType == 4) ||
        (this.poolInfo && this.poolInfo.backRoomType == 5)) &&
      this.isBookAllMode
    ) {
      // 包场场景下的退款规则
      // 2021.03.29 酒水套餐场景下新增一个模式，【支持拼场】的【酒水套餐】商品从POI页跳转过来，会携带backRoomMode=2这个参数
      if (this.poolInfo.packRefundTips && this.poolInfo.packRefundTips.length) {
        const packRefundTips = this.poolInfo.packRefundTips
          .map(JSON.parse)
          .map((item: any[]) => {
            item.forEach((q: { textsize: string; textcolor: string }) => {
              q.textsize = '1.2rem'
              if (q.textcolor === '#1BC2B0') q.textcolor = '#fe8c00'
            })
            return item
          })
        cur = packRefundTips
      }
    } else if (
      this.poolInfo &&
      this.poolInfo.refundTips &&
      this.poolInfo.refundTips.length
    ) {
      // 拼场模式下的退款规则
      const refundTips = this.poolInfo.refundTips
        .map(JSON.parse)
        .map((item: any[]) => {
          item.forEach((q: { textsize: string; textcolor: string }) => {
            q.textsize = '1.2rem'
            if (q.textcolor === '#1BC2B0') q.textcolor = '#fe8c00'
          })
          return item
        })
      cur = refundTips
    } else {
      // 普通预订下的退款规则
      if (!this.refundable) {
        // 不可退款的业务
        cur = [[{ text: '预订成功后不可退款' }]]
      } else {
        if (!this.isOverRefundTime && !this.refundRule.refundDate) {
          cur = [
            [
              { text: `${this.hoursBeforeDesc}`, strong: true },
              { text: '取消可退款' }
            ]
          ]
        } else if (this.isOverRefundTime && !this.refundRule.refundDate) {
          cur = [
            [
              { text: '已过最晚可退款时间，预订成功后' },
              { text: '不可退款', strong: true }
            ]
          ]
        } else if (this.refundRule.refundDate) {
          cur = [
            [
              { text: this.refundRule.refundDate, strong: true },
              { text: '均可消费或退款' }
            ]
          ]
        }
      }
    }

    return {
      title: '退款规则：',
      ruleList: cur
    }
  }

  /**
   * 是否超过了退款时间
   */
  get isOverRefundTime() {
    const { arriveTimeStamp } = this.timeInfo
    const hoursBefore = this?.refundRule.hoursBefore
      ? parseFloat(String(this.refundRule.hoursBefore))
      : 0
    const currentTimestamp = new Date().valueOf()
    if (!arriveTimeStamp) return false
    // todo 这里宠物寄养预订有个特殊逻辑，之后沉淀在宠物寄养预订的business里
    // if (this.isFosterReverse) return this.currentTimestamp > new Date(new Date(JSON.parse(this.arriveTimeStamp)).toLocaleDateString()).getTime() - hoursBefore*3600*1000 + this.refundTime * 60 * 60 * 1000;
    else
      return arriveTimeStamp - currentTimestamp < hoursBefore * 60 * 60 * 1000
  }

  /**
   * 是否是包场
   */
  get bookAll() {
    return !!(
      this.poolInfo &&
      (this.poolInfo.backRoomType == 4 || this.poolInfo.backRoomType == 5) &&
      this.isBookAllMode
    )
  }

  /**
   * 商品总价 = 商品单价 * 数量
   */
  get originalAmount() {
    if (this.isPoolMode) {
      /**
       * 拼场预订，选择后，数量默认为1，单价取poolInfoData.poolUnitPrice
       * 则totalAmount为50×1 =100，数量增加，价格始终为50
       */
      return Big((this.poolInfo && this?.poolInfo?.poolUnitPrice) || 0)
        .times(this?.productInfo?.minCount || 1)
        .toFixed(2)
    } else {
      /**
       * 包场预订
       */
      if (this.isTableBookingMode) {
        /**
         * 按桌预订
         */
        return String(this?.productInfo?.unitPrice || 0)
      } else {
        /**
         * 按人预订
         */
        return Big(this?.productInfo?.unitPrice || 0)
          .times(this?.quantity || 1)
          .toFixed(2)
      }
    }
  }

  /*
    这里区分两种情况
    1：如果已经有arriveTime，那么计算出具体的时间
    2：如果没有，那么就展示另外一种模板
  */
  get hoursBeforeDesc() {
    const hoursBefore = this.refundRule.hoursBefore
      ? parseFloat(String(this.refundRule.hoursBefore))
      : 0
    // todo 场馆预订的到店时间要用后端返回的arriveDate，后续场馆预订迁移的时候，在场馆预订的business里沉淀
    const { arriveTimeStamp } = this.timeInfo
    const { refundTime } = this.refundRule
    const refundTimeTpl = '<%- refundTime %>前'
    const refundHoursBeforeTpl = '到店时间<%- hoursBefore %>小时前'
    if (arriveTimeStamp) {
      const refundTimeStamp = arriveTimeStamp - hoursBefore * 60 * 60 * 1000
      return _template(refundTimeTpl)({
        refundTime: this.formatTime(
          refundTimeStamp + refundTime * 60 * 60 * 1000
        )
      })
    } else {
      return hoursBefore
        ? _template(refundHoursBeforeTpl)({
            hoursBefore
          })
        : '到达预订时间前'
    }
  }

  /**
   * 备注配置
   */
  get remarkConfig() {
    return {
      traKey: 'remark',
      title: '备注',
      type: 'textarea',
      value: this.userInfo.remark,
      placeholder: this.isPoolMode
        ? '简单介绍自己，让拼场的伙伴认识你'
        : '可将您的其他要求告知商户',
      maxlength: 50,
      showWordLimit: true
    }
  }

  get skuId() {
    return this.productInfo.skuId
  }

  get userMobile() {
    return this.userInfo.mobile
  }
  // ============ 数据模型 end============

  // constructor() {
  //   super()
  // }

  /**
   * 页面初始化
   */
  // async pageInit() {
  //   await super.pageInit()
  // }

  /**
   * 获取预下单请求参数
   */
  getPreorderParam(): PreorderParams {
    const params = super.getPreorderParam()
    const { query } = this.envInfo
    return {
      ...params,
      appPeriodId: query?.appPeriodId,
      appPeriodStr: this?.timeInfo?.appPeriodStr,
      purchaseDate: this.getPurchaseDate(),
      stage: 2, // 固定传2，2代表新下单页，用于后端diff，不需理会
      selectedCard: this.selectedCard ? 1 : 0,
      quantity: this.interactType === InteractType.SELECT_TIME ? 1 : this.quantity,
      sceneType: this.isFirstPreorder ? 0 : 1,
      uuid: this?.envInfo?.uuid,
      appVersion: this.envInfo?.uaInfo?.version,
      productItemId: this.selectedProductItemId,
      arriveTime: this.selectedArriveTime,
      shopIdStr: String(params?.shopId),
      unionId: this?.envInfo?.unionId,
    }
  }
  /**
   * 设置页面下单信息
   * @params data
   */
  setPageData(data: PreorderRespFormated) {
    super.setPageData(data)
    const { query } = this.envInfo
    // this.arriveTimeStamp = +query.arrivetime || +query.arriveTime || undefined
    // this.leaveTimeStamp = +query.leavetime || +query.leaveTime || undefined
    // this.purchaseTimeStamp = +query.purchasedate || +query.purchaseDate || undefined
    this.backRoomMode = query.backRoomMode || 0
    // this.appPeriodId = query.appPeriodId || ''
    // this.appPeriodStr = decodeURIComponent(query.appperiodstr || '')
    this.timeInfo = {
      ...this.timeInfo,
      arriveTimeStamp: this.selectedArriveTime,
      purchaseTimeStamp: this.getPurchaseDate(),
      appPeriodId: query.appPeriodId || '',
      appPeriodStr: decodeURIComponent(query.appperiodstr || '')
    }

    // console.log('data: ', data)
    const {
      poolInfoData = {},
      unitType,
      // shopName,
      // productName,
      // productCode,
      purchaseDateDesc,
      oneClickPayDisplayDTO,
      douHuABTestDTO,
      cooperationBizType,
      aheadArriveTime,
      acceptRule,
      refundRule,
      // productItemName,
      bizType,
      purchaseNotes
      // showVirtualNumber,
    } = data
    // 获取业务类型
    // this.productCode = productCode
    this.bizType = bizType
    // this.skuName = productItemName
    this.cooperationBizType = cooperationBizType
    this.poolInfo = poolInfoData
    this.isPinProduct =
      (this.poolInfo && this.poolInfo.backRoomType === 4) ||
      (this.poolInfo && this.poolInfo.backRoomType === 5) // 设置是否为拼场商品
    this.acceptRuleDesc = (acceptRule && acceptRule.ruleString) || ''
    this.refundable = refundRule && refundRule.refundable
    this.refundRule = refundRule
    this.timeInfo.aheadArriveTimeStr = aheadArriveTime
    this.timeInfo.purchaseTimeStr = purchaseDateDesc
    this.unitType = unitType
    // 设置拼场提示信息
    this.pinTipsList =
      this.poolInfo &&
      this.poolInfo.poolDescList &&
      this.poolInfo.poolDescList.map((item: any) => ({
        richtextlist: [{ text: item }]
      }))
    // 设置商品信息
    // this.shopInfo = {
    //   shopName,
    //   productName,
    // }
    // console.log(this.shopInfo, 'this.shopInfo')
    this.productAdditionalInfo = [[{ text: purchaseDateDesc }]]
    this.purchaseNotes = purchaseNotes
    // 虚拟号
    // this.showVirtualNumber = !!showVirtualNumber
    // this.useVirtualNumber = !!showVirtualNumber
    this.oneClickPayDisplayDTO = oneClickPayDisplayDTO
    // 初始化或更新极速支付模型
    this.fastPay.updateFastPay({
      oneClickPayDisplayDTOInfo: oneClickPayDisplayDTO,
      douHuABTestDTO,
      envInfo: this.envInfo,
      tools: this.tools,
      cid: this.lxInfo.cid
    })
    try {
      // 支付模块曝光
      this.fastPay.fastPayModuleView()
      this.contactInfoModuleView()
      this.virtualNumberModuleView()
    } catch(error) {
      console.log("setPageData打点模块error: ", error)
    }
    // this.resetQuantity() 由于足疗新下单页的存在，这个逻辑不再通用，以后作为业务定制化逻辑来写
  }

  // ============ 操作 start============
  /**
   * 更新到店时间
   * @param {number} value
   */
  handleArriveTimeChange(value: string | number) {
    this.timeInfo.arriveTimeStamp = +value || 0
  }

  /**
   * 修改拼/包场类型
   */
  changePinSelect(value: number) {
    // console.log('value: ', value)
    if (value === 0) {
      // 拼场预订
      this.isPinTipsShow = true
      this.backRoomMode = POOL_MODE
    } else {
      // 包场预订
      this.isPinTipsShow = false
      this.backRoomMode = BOOK_ALL_MODE
    }
    this.resetQuantity()
  }

  /**
   * 初始化/重置数量
   */
  resetQuantity() {
    const packMinCount =
      this.bookAll && this.poolInfo.packMinCount
        ? this.poolInfo.packMinCount || 1
        : this.productInfo.minCount || 1
    const quantity = this.isBookAllMode
      ? packMinCount
      : this.productInfo.minCount
    if (this.quantity === quantity) {
    } else {
      this.quantity = quantity
    }
  }

  /**
   * 下单页表单信息修改
   */
  submitFormChange(key: FORM_KEY | keyof this, item: { value: any }) {
    // 转换数据到submitForm中
    console.log('>>>submitFormChange', key, item)
    switch (key) {
      case FORM_KEY.GENDER:
        this.submitFormBid = 'b_gc_contact_sex_mc'
        this.setUserInfo({
          gender: item.value.id
        })
        break
      case FORM_KEY.REMARK:
        this.submitFormBid = 'b_gc_editmessage_mc'
        this.setUserInfo({
          [key]: item.value
        })
        break
      case FORM_KEY.NAME:
        this.submitFormBid = 'b_gc_contact_name__mc'
        this.setUserInfo({
          [key]: item.value
        })
        break
      case FORM_KEY.MOBILE:
        this.submitFormBid = 'b_gc_contact_phone_mc'
        this.setUserInfo({
          [key]: item.value
        })
        break
      case FORM_KEY.QUANTITY:
        this.quantity = item.value
        this.onQuantityChange(item.value)
        break
      case FORM_KEY.PACKAGE_QUANTITY:
        this.packageQuantity = item.value
        break
      default:
        this.submitFormBid = 'b_gc_editmessage_mc'
        this[key] = item.value
        break
    }
    this.submitFormChangeModuleClick()
  }
  updateQuantity(minCount) {
    // 选择新的时间，需要将数量框重置到最小值
    if(this.interactType === InteractType.SELECT_TIME) this.quantity = minCount
  }

  /**
   * 下单表单信息填写打点
   */
  submitFormChangeModuleClick() {
    lxTrackMGEClickEvent('gc', this.submitFormBid, this.lxInfo.cid, {
      poi_id: this.shopInfo.shopId,
    })
  }
  /**
   * 点击电话号码输入框打点
   */
  phoneInputBoxModuleClick() {
    lxTrackMGEClickEvent('gc', 'b_gc_contact_phone_mc', this.lxInfo.cid, {
      poi_id: this.shopInfo.shopId,
    })
  }

  /**
   * 确认按钮灵犀打点
   */
  handleOrderSubmitLx() {
    const bid = this.envInfo.isMt ? 'b_K3CuB' : 'b_ZWt7y'
    window.LXAnalytics &&
      window.LXAnalytics(
        'moduleClick',
        bid,
        {
          stid: this.envInfo.isMiniprogram ? 1 : 0,
          custom: {
            membercard_type: this.envInfo.query.membercard_type || 0,
            member_profile: this.envInfo.query.member_profile || 0
          }
        },
        null
      )
  }

  /**
   * 获取提交订单参数
   */
  getOrderSubmitParams(): CreateOrderParams {
    this.handleOrderSubmitLx()
    const params = super.getOrderSubmitParams()
    const { gender, mobile = '', name = '', remark = '' } = this.userInfo
    const { quantity = 1 } = this
    const { priceNo, priceVersion } = this.productInfo
    const { appPeriodStr, arriveTimeStamp, purchaseTimeStamp } =
      this.timeInfo
    // 统一预订定制参数
    const { query } = this.envInfo
    const {
      poolId, // 拼场Id
      appPeriodId
    } = query
    const { payType } = this.fastPay
    const res = {
      ...params,
      priceNo: priceNo,
      priceVersion: priceVersion,
      purchaseDate: purchaseTimeStamp,
      arriveTime: arriveTimeStamp,
      appPeriodId: appPeriodId,
      appPeriodStr: appPeriodStr,
      signAgreement: 0, // 是否勾选了协议
      oneClickPayStatus: payType == 1 ? 1 : 0, // 极速支付状态
      gender,
      mobile,
      bookName: name,
      orderRemark: remark,
      quantity,
      poolId: parseInt(poolId) || undefined,
      bookAll: this.bookAll,
      needUseVirtualNumber: Number(this.virtualNumberInfo.use)
    }
    return res
  }

  // getPayCallbackUrl(data: { uniOrderId: any }) {
  //   const { uniOrderId } = data
  //   return `${
  //     this.envInfo.isBeta
  //       ? 'https://g.51ping.com/fuse/SJZYJTCpf'
  //       : 'https://g.dianping.com/fuse/SkRlSFLRG'
  //   }?resulttype=1&orderid=${uniOrderId}&cooperationbiztype=${this.cooperationBizType}&pf=${
  //     this.envInfo.isMt ? 'mt' : 'dp'
  //   }&productid=${this.productInfo.spuId}`
  // }

  getPaymentSetting(data: { uniOrderId: any }) {
    const payCallbackUrl = this.getPayCallbackUrl(data)
    const { cashierType, extraData } = this.fastPay
    this.paymentSetting = {
      callbackUrl: payCallbackUrl,
      cashierType,
      extraData,
      closeCurrentPage: false
    }
  }

  /**
   * 时间戳转换
   */
  formatTime(timestamp: string | number | Date) {
    const today = dayjs()
    const tomorrow = dayjs().add(1, 'day')
    const selectedTime = dayjs(timestamp)
    let timeLabel = ''
    if (selectedTime.isSame(today, 'day')) {
      timeLabel = '今天' + selectedTime.format('(MM-DD) HH:mm')
    } else if (selectedTime.isSame(tomorrow, 'day')) {
      timeLabel = '明天' + selectedTime.format('(MM-DD) HH:mm')
    } else {
      timeLabel = selectedTime.format('ddd(MM-DD) HH:mm')
    }

    return timeLabel
  }

  // 数量框变化
  onQuantityChange(val) {
    this.setBottomBannerTextParts({number: `${val}人`})
    this.interactType = InteractType.CHANGE_QUANTITY
    this.requestPreorder()
  }
  getPurchaseDate() {
    // 兜底，但客户端时间受用户设置影响
    if(!this.selectedArriveTime) {
      return this.getYearMonthDay(undefined).getTime()
    }
    if(this.isCrossDay) {
      return this.getYearMonthDay(this.selectedArriveTime - 1000 * 60 * 60 * 24).getTime()
    }
    return this.getYearMonthDay(this.selectedArriveTime).getTime()
  }
  // 只拿取时间戳里的年月日
  getYearMonthDay(timestamp) {
    if(!timestamp) new Date(new Date().toDateString())
    return new Date(new Date(timestamp).toDateString())
  }

  setTimeInfo(arriveTime) {
    this.timeInfo = {
      ...this.timeInfo,
      // 预订只需要arriveTime
      arriveTimeStamp: arriveTime,
    }
  }

  setIsTimeSelected(val) {
    this.isTimeSelected = val
  }
  
  // 底部栏数据设置
  setBottomBannerTextParts(obj: BottomBannerTextParts) {
    this.bottomBannerTextParts = Object.assign({}, this.bottomBannerTextParts, obj)
  }

  setTimeSelectData(params: any) {}

  /**
   * 预订下单页通用pageView打点
   */
  pageViewLx() {
    const { query } = this.envInfo
    const cid = 'c_gc_pf74xk2c'
    const valLab = {
      cat_id: this.cooperationBizType,
      poi_id: this.shopInfo.shopId,
      product_id: this.productInfo.spuId,
      custom: {
        sku_id: this.productInfo.skuId || query.productitemid || 0,
        member_profile: parseInt(query.member_profile || 0),
        card_type: parseInt(query.card_type || 0)
      }
    }
    window.LXAnalytics && window.LXAnalytics('pageView', valLab, null, cid)
  }

  /**
   * 预订下单页提交订单按钮点击事件打点
   */
  orderSubmitModuleClick() {
    const bid = 'b_gc_wzfeqsyo_mc'
    const { query } = this.envInfo
    const valLab = {
      poi_id: this.shopInfo.shopId || '',
      product_id: this.productInfo.spuId || '',
      custom: {
        member_profile: parseInt(query.member_profile || 0),
        card_type: parseInt(query.card_type || 0)
      },
      abtest: -9999,
      alliance: -9999,
      bussi_id: -9999,
      content_id: -9999,
      module_id: -9999,
      page_source: -9999,
      pool_id: -9999,
      query_id: -9999,
      status: -9999,
    }
    lxTrackMGEClickEvent('gc', bid, this.lxInfo.cid, valLab)
  }

  /**
   * 下单成功后的打点
   */
  handleOrderSubmitLXAnalytics(data: {
    uniOrderId: any
    extraOrderList?: any
  }) {
    // 到综下单打点 - 新打点，关联在统一预订页面
    const { uniOrderId, extraOrderList } = data
    window.LXAnalytics &&
      window.LXAnalytics('order', 'b_gc_l1ec9e5i_bo', uniOrderId, {
        category_id: this.cooperationBizType,
        poi_id: this.shopInfo.shopId || '',
        product_id: this.productInfo.spuId || ''
      })
    // 搭售打点 - 213玩乐卡，65折扣卡，新版只有折扣卡了
    if (extraOrderList && extraOrderList.length) {
      extraOrderList.forEach(
        (extraOrder: { orderBizType: number; uniOrderId: any }) => {
          if (extraOrder.orderBizType == 213 || extraOrder.orderBizType == 65) {
            window.LXAnalytics &&
              window.LXAnalytics(
                'order',
                'b_gc_l1ec9e5i_bo',
                extraOrder.uniOrderId,
                {}
              )
          }
        }
      )
    }
  }

  /**
   * 下单页个人留言模块打点
   */
  remarkModuleViewLx() {
    const bid = 'b_gc_8pp9j6zg_mv'
    window.LXAnalytics && window.LXAnalytics('moduleView', bid)
  }

  /**
   * 个人留言模块点击打点
   */
  remarkModuleCLickLx() {
    const bid = 'b_gc_8pp9j6zg_mc'
    window.LXAnalytics && window.LXAnalytics('moduleClick', bid)
  }


  afterInit() {
    super.afterInit()
    // this.contactInfoModuleView()
    this.orderSubmitModuleView()
    // this.virtualNumberModuleView()
  }

  /**
   * 下单页联系人模块打点
   */
  contactInfoModuleView() {
    lxTrackMGEViewEvent('gc', 'b_gc_contact_mv', this.lxInfo.cid, {
      poi_id: this.shopInfo.shopId || '',
    })
  }

  /**
   * 预订下单页下单按钮出现事件打点
   */
  orderSubmitModuleView() {
    lxTrackMGEViewEvent('gc', 'b_gc_wzfeqsyo_mv', this.lxInfo.cid, {
      abtest: -9999,
      page_source: -9999,
      pool_id: -9999,
    })
  }

  /**
   * 虚拟号模块曝光点
   */
  virtualNumberModuleView() {
    if (this.virtualNumberInfo.show) {
      lxTrackMGEViewEvent('gc', 'b_gc_529cb5de_mv', this.lxInfo.cid, {
        select_status_change: Number(this.virtualNumberInfo.use)
      })
    }
  }

  /**
   * 虚拟号模块点击点
   */
  virtualNumberModuleClick() {
    lxTrackMGEClickEvent('gc', 'b_gc_cfl1sood_mc', this.lxInfo.cid, {
      select_status_change: Number(this.virtualNumberInfo.use)
    })
  }

  /**
   * 打开虚拟号详情页灵犀点击点
   */
  goVirtualNumberDetailModuleClick() {
    lxTrackMGEClickEvent('gc', 'b_gc_vb826m9j_mc', this.lxInfo.cid, {})
  }
  // 时间选择模块曝光点
  timeSelectModuleView() {
  }
  // 时间选择模块tab点击点
  timeSelectTabModuleClick(params: any) {
  }
  // 时间选择模块grid点击点
  timeSelectGridModuleClick(params: any) {
  }

  exitModuleClick() {
  }

  /**
   * 二级券列表曝光点
   */
   couponListModuleViewLx() {
    lxTrackMGEViewEvent('gc', 'b_gc_j2niq4im_mv', this.lxInfo.cid, {
      poi_id: this.shopInfo.shopId || '',
      abtest: this.promoDouHu?.moduleAbInfo4Front,
      product_id: this.selectedProductItemId || '',
    })
  }
  /**
   * 二级券列表点击点
   */
  couponListModuleClickLx() {
    lxTrackMGEClickEvent('gc', 'b_gc_j2niq4im_mc', this.lxInfo.cid, {
      poi_id: this.shopInfo.shopId || '',
      abtest: this.promoDouHu?.moduleAbInfo4Front,
      product_id: this.selectedProductItemId || '',
    })
  }
  /**
   * 会员优惠解释浮层曝光点
   */
  premiumCardPopupModuleViewLx() {
    lxTrackMGEViewEvent('gc', 'b_gc_cvvcf2qv_mv', this.lxInfo.cid, {
      poi_id: this.shopInfo.shopId || '',
      abtest: this.promoDouHu?.moduleAbInfo4Front,
      deal_id: this.selectedProductItemId || '',
    })
  }
  /**
   * 会员优惠解释浮层点击点
   */
  premiumCardPopupModuleClickLx() {
    lxTrackMGEClickEvent('gc', 'b_gc_cvvcf2qv_mc', this.lxInfo.cid, {
      poi_id: this.shopInfo.shopId || '',
      abtest: this.promoDouHu?.moduleAbInfo4Front,
      deal_id: this.selectedProductItemId || '',
    })
  }


  /**
   * 会员卡的曝光点
   */
   premiumCardModuleViewLx() {
    lxTrackMGEViewEvent('gc', 'b_gc_ujwf7vtz_mv', this.lxInfo.cid, {
      select_status: this.cardInfo?.selectedCard || false,
      product_id: this.selectedProductItemId || '',
      user_id: this.envInfo.userId || '',
      abtest: this.promoDouHu?.moduleAbInfo4Front
    })
  }
  /**
   * 会员卡模块的点击灵犀打点
   */
  premiumCardModuleClickLx() {
    lxTrackMGEClickEvent('gc', 'b_gc_ujwf7vtz_mc', this.lxInfo.cid, {
      select_status_change: this.selectedCard ? 1 : 0,
      product_id: this.selectedProductItemId || '',
      user_id: this.envInfo.userId || '',
      abtest: this.promoDouHu?.moduleAbInfo4Front
    })
  }
  /**
   * 获取单个优惠的灵犀打点参数
   */
  promoLxParams(promo) {
    return {
      promotion_id: promo.promoId,
      promotion_title: promo.titleText,
      select_status: promo.selectedState,
      abtest: this.promoDouHu?.moduleAbInfo4Front || -9999
    }
  }
  /**
   * 优惠台曝光灵犀打点
   * 包含立减+券+会员卡折扣
   */
  promoDeskModuleViewLx() {
    try {
      const { promoInfoList } = this.promoDeskInfo
      if (promoInfoList?.length) {
        // 平台立减曝光
        const platformPromo = promoInfoList.find(promo => promo.promoType === PromoType.PLATFORM_PROMO)
        if (platformPromo) {
          lxTrackMGEViewEvent('gc', 'b_gc_xhe1al9r_mv', this.lxInfo.cid, this.promoLxParams(platformPromo))
        }
        // 商家立减曝光
        const shopPromo = promoInfoList.find(promo => promo.promoType === PromoType.MERCHANT_PROMO)
        if (shopPromo) {
          lxTrackMGEViewEvent('gc', 'b_gc_xhe1al9r_mv', this.lxInfo.cid, this.promoLxParams(shopPromo))
        }
        // 平台券曝光
        const platformCoupon = promoInfoList.find(promo => promo.promoType === PromoType.PLATFORM_COUPON)
        if (platformCoupon) {
          lxTrackMGEViewEvent('gc', 'b_gc_3petpoc4_mv', this.lxInfo.cid, this.promoLxParams(platformCoupon))
        }
        // 商家券曝光
        const shopCoupon = promoInfoList.find(promo => promo.promoType === PromoType.MERCHANT_COUPON)
        if (shopCoupon) {
          lxTrackMGEViewEvent('gc', 'b_gc_3petpoc4_mv', this.lxInfo.cid, this.promoLxParams(shopCoupon))
        }
        // 会员卡折扣曝光
        const cardPromo = promoInfoList.find(promo => promo.promoType === PromoType.CARD_PROMO_AFTER_BUY_CARD || promo.promoType === PromoType.CARD_PROMO_BEFORE_BUY_CARD)
        if (cardPromo) {
          lxTrackMGEViewEvent('gc', 'b_gc_k27sro53_mv', this.lxInfo.cid, this.promoLxParams(cardPromo))
        }
      }
    } catch(err) {
      console.log('err: ', err);
    }
  }
  /**
   * 优惠台点击灵犀打点
   * 包含立减+券+会员卡折扣
   */
  promoDeskModuleClickLx(params: any) {
    // 立减
    if (params.promoType === PromoType.PLATFORM_PROMO || params.promoType === PromoType.MERCHANT_PROMO) {
      lxTrackMGEClickEvent('gc', 'b_gc_xhe1al9r_mc', this.lxInfo.cid, {
        abtest: this.promoDouHu?.moduleAbInfo4Front,
        promotion_id: params?.selectedPromoId,
        promotion_title: params?.titleText,
        select_status_change: params?.selectedPromoId ? 1 : 0,
        alliance: -9999,
      })
    }
    // 券
    if (params.promoType === PromoType.PLATFORM_COUPON || params.promoType === PromoType.MERCHANT_COUPON) {
      lxTrackMGEClickEvent('gc', 'b_gc_3petpoc4_mc', this.lxInfo.cid, {
        abtest: this.promoDouHu?.moduleAbInfo4Front,
        promotion_id: params?.selectedPromoId,
        promotion_title: params?.titleText,
        alliance: -9999,
      })
    }
    // 会员卡
    if (params.promoType === PromoType.CARD_PROMO_AFTER_BUY_CARD || params.promoType === PromoType.CARD_PROMO_BEFORE_BUY_CARD) {
      lxTrackMGEClickEvent('gc', 'b_gc_k27sro53_mc', this.lxInfo.cid, {
        abtest: this.promoDouHu?.moduleAbInfo4Front,
        promotion_id: params?.selectedPromoId,
        promotion_title: params?.titleText,
        select_status_change: params?.selectedPromoId ? 1 : 0
      })
    }
  }

}

export default BookingOrderCreate