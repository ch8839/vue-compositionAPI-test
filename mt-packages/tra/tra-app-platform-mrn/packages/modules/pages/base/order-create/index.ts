import createToolBox from '@nibfe/multi-platform-env'
// import { IcashierType } from '@nibfe/multi-platform-env/types/toolbox-interface'
import Big from 'big.js'
import { pageRouterClose } from '@mrn/mrn-utils'
import _intersection from 'lodash/intersection'
import validator from '../../../utils/validator'
import { BOOKING } from '../../../constants/cooperation-biz-type'
import { lxTrackMGEClickEvent, lxTrackMGEViewEvent, lxTrackOrderEvent } from '@mrn/mrn-utils'
import { moduleRegister } from '@nibfe/tra-app-platform-core'
import { OWL } from '@mrn/mrn-owl'
import KNB from '@mrn/mrn-knb'

import BasePage from '../base-page'
// import type { ObjectType } from 'types/interface'
import FastPay from '../modules/fast-pay'
// import { asyncLock, asyncWrap } from 'utils/decorators'
import { VALIDATE_RULES } from './constant'
import {
  PreorderRespFormated,
  IUserInfo,
  IVirtualNumberInfo,
  PreorderParams,
  PreorderProductInfo,
  PreorderShopInfo,
  InteractType, 
  PromoType, ActionType
} from '../../../services/requests/preorder'
import createPreorderService from '../../../services/page-services/orderCreateCommon'
import { FetchBizError } from '../../../services/utils/error'
import { CreateOrderParams } from '../../../services/requests/createOrder'
import { IParams } from '../../../services/requests/applyPayment'
// import { asyncLock, asyncWrap } from '../../../utils/decorators'
import { ObjectType } from '../../../types/interface'
import { SendOrderUtmParams } from '../../../services/requests/sendOrderUtm'
import { getOwlStartConfig } from '../../../utils/helper'

interface BaseOrderCreate {
  fastPay: FastPay
}

/**
 * 下单页基础页面模型
 */
@moduleRegister(FastPay, 'fastPay')
class BaseOrderCreate extends BasePage {
  // >>>页面逻辑相关模型>>>
  // pageLoading = false
  reloadFlag = Math.random()
  submitLock = false
  cooperationBizType: number | string = BOOKING
  transactionCode = '' // 前端定义的接口token

  userInfo: IUserInfo = {
    mobile: ''
  }

  shopInfo: PreorderShopInfo = {
    shopId: 0,
    shopUuid: '',
    shopName: ''
  }

  virtualNumberInfo: IVirtualNumberInfo = {
    show: false,
    use: false
  }

  productInfo: PreorderProductInfo = {
    maxCount: Number.MAX_VALUE,
    minCount: 1,
    priceNo: '',
    priceVersion: 0,
    productCode: 0,
    // productItemAttrDesc: '',
    productName: '',
    // productPicUrl: '',
    productType: 0,
    unitPrice: 0.01,
    skuId: 0,
    skuName: '',
    spuId: 0,
    spuType: 0,
    suitableShopCount: 1
  }

  /** 数量 */
  quantity = 1

  sourcetype = ''

  /** 城市名称 */
  cityName = ''
  ruleChecked = false

  disablePromodesk = false

  /** 支付参数 */
  paymentSetting: {
    callbackUrl: string
    cashierType: string
    extraData: Record<string, any>
    closeCurrentPage: boolean
  } = {
    callbackUrl: '',
    cashierType: '',
    extraData: {},
    closeCurrentPage: false
  }

  // 用户未开通会员卡的情况下，是否勾选会员卡搭售模块或者用户已是会员的情况下，是否勾选会员优惠
  selectedCard: boolean = false
  // 是否为首次请求preorder接口（与后端入参sceneType相关）
  isFirstPreorder: boolean = true
  // 用户在单次交互中勾选的优惠类型
  selectedPromoType: string = undefined
  // 用户在单次交互中勾选的优惠id
  selectedPromoId: string = undefined
  // 金额明细
  amountDetail: any = undefined
  // 优惠明细
  promoDeskInfo: any = undefined
  // 卡明细
  cardInfo: any = undefined
  // 是否处于灰度内
  isGray: boolean = false
  // 初始进入下单页浮层时是否展示会员价(入口为会员价是展示，入口为预订价时不展示)
  showPremiumPrice: boolean = false
  // 表示哪种交互下请求的preorder接口
  interactType: InteractType = undefined
  // 优惠感知斗斛数据
  promoDouHu = null
  // 页面起始时间
  pageStartTime = 0
  // 下单事件BO点的bid
  orderEventBid?: string

  // 支付相关的参数
  oneClickPayDisplayDTO?: any
  constructor() {
    super()
    // this.cardDesk
  }

  // ============ getter ============
  /**
   * 获取验证规则
   */
  get validateRules() {
    return VALIDATE_RULES
  }
  /**
   * 不计算优惠，服务费等价格的总价
   * 商品总价 = 商品单价 * 数量
   */
  get originalAmount() {
    return Big(this.productInfo.unitPrice || 0)
      .times(this.quantity || 0)
      .toFixed(2)
  }

  /**
   * 订单总价 = 商品总价 - 优惠金额
   */
  get orderAmount() {
    const bigAmount = Big(this.originalAmount)
      .times(this.cardDesk.discountStatus ? this.cardDesk.discountPercent : 1) // 权益台折扣
      .minus(this.promoDesk.promoAmount || 0)
    return bigAmount.gt(0) ? bigAmount.toFixed(2) : '0.01'
  }

  /**
   * 附加费，包含卡费、服务费等
   */
  get additionalAmount(): string | number {
    return this.cardDesk.discountStatus ? this.cardDesk.discountPrice : 0
  }

  /**
   * 最终展示的总价
   * 页面展示总价 = 订单总价 + 附加费
   */
  get totalAmount() {
    return Big(this.orderAmount).add(this.additionalAmount).toFixed(2)
  }

  /**
   * 附加信息
   */
  get productAdditional(): { text?: string; type?: string }[][] {
    return []
  }

  get utmFamily() {
    const query = this.envInfo.query || {}
    const utmFamily: ObjectType<string | undefined> = {}
    Object.keys(query).forEach(k => {
      if (k.startsWith('utm_') && query[k]) utmFamily[k] = query[k]
    })
    return utmFamily
  }

  // ============ 数据模型 end============

  services!: ReturnType<typeof createPreorderService> // 请求服务

  // 新增init生命周期
  async init() {
    await this.beforeInit()
    await this.pageInit()
    await this.afterInit()
  }

  async beforeInit() {
    this.pageStartTime = new Date().getTime()
    this.tools = createToolBox()
    await this.tools.mtCheckSession({
      success: async () => {
        // 因为mrn里没有强制reload页面的逻辑，所以需要在登录的回调事件里重新触发init事件
        await this.init()
      },
      fail: () => {
        this.$toast('请先登录')
        // 关闭当前页面
        this.closePage()
      }
    })
    this.envInfo = await this.tools.ready()
    console.log('this.envInfo: ', this.envInfo);
    this.createService()
  }

  createService() {
    this.services = createPreorderService()
  }

  /**
   * 页面初始化，共 7 步
   * 1.验证登录
   * 2.准备环境信息
   * 装载服务
   * 3.获取下单信息请求参数
   * 4.调用获取下单信息服务
   * 5.根据服务返回设置页面信息
   * 6.初始化业务模块
   * 7.关闭页面 loading
   * 8.页面pageView打点
   */
  async pageInit() {
    try {
      // await checkLogin()
      await this.prepareEnv()
      // this.services = serviceFactory(this.transactionCode) // 装载服务
      const requestParams = this.getPreorderParam()
      console.log('requestParams: ', requestParams)
      const responseData = await this.preorder(requestParams)
      console.log('responseData: ', responseData)
      this.finishPage()
      this.setPageData(responseData)
    } catch(err) {
      console.log('err: ', err);
    } finally {
      this.turnOffPageLoading()
    }
  }

  afterInit() {
    this.pageViewLx()
    this.initBusinessModule()
  }

  /**
   * 初始化页面环境
   */
  async prepareEnv() {
    // this.envInfo = await ready()
    const { query } = this.envInfo
    console.log('query: ', query);
    this.sourcetype = query.sourcetype || ''
    this.disablePromodesk = query.disablepromodesk === 'true'
  }

  /**
   * 获取预下单请求参数
   */
  getPreorderParam(): PreorderParams {
    const { query, lat, lng } = this.envInfo
    return {
      productItemId: query?.productItemId || query?.productitemid, // 商品skuId
      shopId: query?.shopId || query?.shopid, // 商户id
      shopIdStr: String(query?.shopId || query?.shopid), // 商户id字符串形式
      shopuuid: query?.shopuuid, // 点评商户id
      cityId: this?.envInfo?.cityId, // 城市id
      channel: this?.envInfo?.channel, // 下单软件平台，后期改为 enum
      platform: this?.envInfo?.platform, // 下单终端平台，后期改为 enum
      clientType: this?.envInfo?.clientType, // 下单客户端类型，后期改为 enum
      clientVersion: this?.envInfo?.uaInfo?.version, // 下单客户端类型版本
      uuid: this?.envInfo?.uuid || query?.uuid, // 设备id
      token: this.envInfo?.token || query?.token, // 用户令牌 token
      openId: this?.envInfo?.openId, // 小程序用户id
      cooperationBizType: this.cooperationBizType, // 业务类型
      lat, // 维度
      lng // 经度
    }
  }

  /**
   * 调用服务获取下单页信息
   */
  async preorder(params: PreorderParams) {
    return this.services.preorder(params).catch((error: FetchBizError) => {
      console.log('error: ', error)
      const msg = (error && error.msg) || '获取商品信息失败'
      console.error(msg, error)
      this.$toast(msg)
      if (error.code === 403) {
        this.login()
      }
      // 取消加载态
      this.turnOffPageLoading()
      throw error
    })
  }

  /**
   * 设置页面下单信息
   * @params data
   */
  setPageData(data: PreorderRespFormated) {
    this.setProductInfo(data.productInfo)
    this.setShopInfo(data.shopInfo)
    this.setUserInfo(data.userInfo)
    this.virtualNumberInfo = data.virtualNumberInfo
    this.updateQuantity(data?.productInfo?.minCount || 1)
    this.cityName = data.cityName
    // 金额明细
    this.amountDetail = data.amountDetailVO
    // 优惠台信息
    this.promoDeskInfo = data.promoDeskVO
    // 优惠台曝光打点
    this.promoDeskModuleViewLx()
    if(data.cardInfoVO && !this.showPremiumPrice) {
      // 会员卡曝光点
      this.premiumCardModuleViewLx()
    }
    // 交易后端的卡信息
    this.cardInfo = data?.cardInfoVO
    // 卡的勾选状态或会员优惠的勾选状态
    // 已开通会员卡的情况下，preorder接口必定不返回卡信息，此时需要去优惠项里找到会员优惠查看是否勾选
    if(this.showPremiumPrice && !data?.cardInfoVO) {
      const cardPromoAfterBuy = data?.promoDeskVO?.promoInfoList?.find((promoInfo)=>{
        return promoInfo.promoType === PromoType.CARD_PROMO_AFTER_BUY_CARD
      })
      if(cardPromoAfterBuy) this.setSelectedCard(cardPromoAfterBuy.selectedState || false)
      else this.setSelectedCard(false)
    }
    // 未开通会员卡的情况
    else this.setSelectedCard(data?.cardInfoVO?.selectedState || false)
  }
  // 处理数量的逻辑在预订下单页有定制
  updateQuantity(minCount) {
    this.quantity = minCount
  }

  /**
   * 初始化业务模块
   */
  async initBusinessModule() {
  }

  /**
   * 更改商品数量
   * @param val
   */
  handleQuantityChange(val: number) {
    this.quantity = val
  }

  /**
   * 勾选协议状态改变
   * @param val
   */
  handleRuleChange(val: boolean) {
    this.ruleChecked = val
  }

  /**
   * 点击提交订单
   */
  // TODO asyncWrap和asyncLock有点问题，先注释了
  // @asyncLock
  // @asyncWrap('togglePageLoading')
  async handleOrderSubmit() {
    this.togglePageLoading()
    // if (this.submitLock) {
    //   return
    // }
    try {
      // 提交订单按钮点击打点
      this.orderSubmitModuleClick()
      // 验证数据模型，不是验证提交数据
      const validateResult = this.validateSubmitParams()
      if (validateResult) {
        this.validateFail(validateResult)
        return
      }
      const params = this.getOrderSubmitParams()
      console.log('params: ', params)
      // this.setSubmitLock(true)
      // this.turnOnPageLoading()
      const data = await this.submitOrder(params)
      if (data) {
        await this.orderSubmitSuccess(data)
        // 上报下单任务完成时间
        this.uploadOrderSubmitFinishCost()
      }
    } catch (error: any) {
      console.error(error)
      // 一些特殊情况，不弹toast
      if (error.type !== 'cancel') {
        this.$toast(error.msg || '下单失败，请稍后再试')
      }
      throw error
    } finally {
      // this.setSubmitLock()
      this.turnOffPageLoading()
    }
  }

  /**
   * 获取提交订单参数
   */
  getOrderSubmitParams() {
    const params: CreateOrderParams = {
      // 业务信息
      cooperationBizType: this.cooperationBizType,
      productItemId: this.productInfo.skuId,
      shopId: this.shopInfo.shopId,
      shopuuid: this.shopInfo.shopUuid,
      quantity: this.quantity,
      cx: this.envInfo.cx,
      unitPrice: this.productInfo.unitPrice || null,
      // 用户信息
      mobile: this.userInfo.mobile,
      token: this.envInfo.token || '',
      openId: this.envInfo.query.openId,
      uuid: this.envInfo.uuid,
      // 环境信息
      cityId: this.envInfo.cityId,
      channel: this.envInfo.channel,
      platform: this.envInfo.platform,
      clientType: this.envInfo.clientType,
      clientVersion: this.envInfo.uaInfo.version || 0,
      osName: this.envInfo.uaInfo.os,
      appId:
        this.envInfo.miniprogramConfig && this.envInfo.miniprogramConfig.appId,
      cipher: this?.promoDeskInfo?.promoCipher,
      encryptedPromoString: this?.promoDeskInfo?.promoCipher,
      vipCardNo: this.selectedCard ? this?.cardInfo?.vipCardId : undefined
      // sourcetype: this.sourcetype || '',
    }
    return params
  }

  /**
   * 验证下单参数
   * TODO: 现在的继承方式对验证扩展有点困难
   * @param {*} params
   */
  validateSubmitParams() {
    // 直接把整个实例传入validator进行验证
    return validator(this.validateRules, this)
  }

  /**
   * 下单参数验证失败
   * @param failRule
   */
  validateFail(failRule: { message: string }) {
    this.$toast(failRule.message)
  }

  /**
   * 获取支付完成的回调url
   * @param
   */
  getPayCallbackUrl(data: any) {
    const { uniOrderId, env } = data
    return `${
      env
        ? 'https://g.51ping.com/fuse/SJZYJTCpf'
        : 'https://g.dianping.com/fuse/SkRlSFLRG'
    }?resulttype=1&orderid=${uniOrderId}&cooperationbiztype=${
      this.cooperationBizType
    }&pf=${this.envInfo.isMt ? 'mt' : 'dp'}&productid=${this.productInfo.spuId}`
  }

  /**
   * 获取支付配置
   */
  getPaymentSetting(data: { uniOrderId: string }) {
    const payCallbackUrl = this.getPayCallbackUrl(data)
    this.paymentSetting = {
      ...this.paymentSetting,
      callbackUrl: payCallbackUrl
    }
  }

  /**
   * 提交订单
   * @param {object} params
   */
  submitOrder(params: CreateOrderParams) {
    return this.createOrder(params).then(data => {
      console.log("submitOrder data: ", data)
      // this.handleOrderSubmitLXAnalytics()
      // const newParams = Object.assign({}, params, {
      //   uniOrderId: data.uniOrderId,
      // })
      if (this.envInfo.isMtGroupMini) {
        this.sendUtmSource({
          ...this.utmFamily,
          uniOrderId: data.uniOrderId
        })
      }
      return this.applyPayment({
        ...params,
        uniOrderId: data.uniOrderId,
        sourcetype: this.sourcetype || ''
      })
    })
  }

  createOrder(params: CreateOrderParams) {
    return this.services.createOrder(params).then(data => data.data)
  }

  applyPayment(params: IParams) {
    return this.services.applyPayment(params).then(res => {
      const { code, data, msg } = res
      if (!res || !data) {
        Promise.reject({ msg: '申请支付失败' })
      }
      switch (code) {
        case 200:
          this.getPaymentSetting(data)
          return data
        case 403:
          this.login()
          break
        case 408:
          return this.$dialog
            .confirm({
              className: 'morph-dialog',
              message: '当前优惠已不可用，是否继续？',
              confirmButtonText: '继续',
              cancelButtonText: '取消'
            })
            .then(() => {
              params.uniOrderId = data.uniOrderId || params.uniOrderId
              return this.originalPayment(params)
            })
            .catch(e => {
              if (e === 'cancel') {
                return Promise.reject({
                  type: 'cancel',
                  msg: '不进行原价支付'
                })
              }
              return Promise.reject(e)
            })
        case 412:
          return Promise.reject({
            msg: msg || '库存不足，请退出重试'
          })
        default:
          return Promise.reject({
            msg: msg || '下单失败，请退出重试'
          })
      }
    })
  }

  /**
   * 原价支付
   * @param {*} data
   */
  originalPayment(params: IParams) {
    // 小程序多2个参数
    if (this.envInfo.isMiniprogram) {
      params.appId = this.envInfo.miniprogramConfig?.appId || ''
      params.openId = this.envInfo.openId || ''
    }
    return this.services.originalPayment(params).then(({ code, data }) => {
      switch (code) {
        case 200:
          return data
        case 403:
          this.login()
          break
        default:
          return Promise.reject({
            msg: '下单失败，请退出重试'
          })
      }
    })
  }

  /**
   * 订单提交成功处理
   * @param {*} applypayRes
   */
  orderSubmitSuccess(applypayRes: { payParams: any; token: any, uniOrderId: string }) {
    this.orderEventLx({order_id: applypayRes?.uniOrderId, poi_id: this.shopInfo?.shopId, product_id: this.productInfo?.spuId, category_id: this.cooperationBizType})
    console.log('this.paymentSetting: ', this.paymentSetting)
    const { callbackUrl, cashierType, extraData, closeCurrentPage } =
      this.paymentSetting
    // 旧的applypayment接口还有一层payParams，新的没有
    const payParams = applypayRes.payParams || applypayRes
    if (!payParams || !payParams.needRedirect) {
      this.tools.openLink(callbackUrl)
      return
    }
    const cashierParams = {
      tradeno: payParams.tradeNO,
      payToken: payParams.payToken,
      wxPayUrl: payParams.wxPayUrl,
      token: applypayRes.token || this.envInfo?.token || '',
      callbackUrl: callbackUrl || '',
      closeCurrentPage, // 是否关闭当前页面，只有在app里生效
      // 极速支付参数
      cashier_type: cashierType,
      extra_data: extraData
    }
    const { disPlayStatus } = this.oneClickPayDisplayDTO
    if(cashierType === 'oneclickpay') {
      const { serialCode } = extraData
      if(!serialCode) {
        console.log("极速支付入参serialCode为空或不存在")
        const uploadError = new Error('极速支付入参serialCode为空或不存在')
        uploadError.level = 'error'
        uploadError.category = 'ajaxError'
        uploadError.customData = {
          params: cashierParams,
          query: this.envInfo.query,
        }
        console.log("极速支付入参serialCode为空或不存在 owlconfig: ", this.owl.config.get())
        this?.owl?.error?.pushError(uploadError, true)
      }
      // 引导极速支付开通的情况
      if(disPlayStatus == 1) {
        console.log("引导极速支付开通，reconfirm和open_oneclickpay值不正确")
        const { reconfirm, open_oneclickpay } = extraData
        if(!(reconfirm === 1 && open_oneclickpay === 1)) {
          const uploadError = new Error('引导极速支付开通入参reconfirm和open_oneclickpay值不正确')
          uploadError.level = 'error'
          uploadError.category = 'ajaxError'
          uploadError.customData = {
            params: cashierParams,
            query: this.envInfo.query,
          }
          this?.owl?.error?.pushError(uploadError, true)
        }
      }
    }
    // 注意：KNB 官方推荐，注册之前先反注册一下该通知，避免重复注册 KNB.unsubscribe（https://km.sankuai.com/docs/knbdoc/page/445658955）
    KNB.unsubscribe({
      action: `cashier_callback_result_${payParams.tradeNO}`, //取消该所有事件的订阅
      success: function(){},
      fail: function(){}
    });
    
    KNB.subscribe({
      action: `cashier_callback_result_${payParams.tradeNO}`,
      handle: function(data){
        // data.value: success | fail | cancel
        console.log("监听收银台结果: ", data.value)
      },
      success: function(data){
    
      }, 
      fail: function(){
        console.log("收银台支付错误")
        this.reportCashierError(cashierParams)
      }
    })
    this.tools.mtRequestPayment(cashierParams)
  }

  // 上报收银台报错
  reportCashierError(cashierParams) {
    try {
      const uploadError = new Error('收银台支付失败')
      uploadError.level = 'error'
      uploadError.category = 'ajaxError'
      uploadError.customData = {
        params: cashierParams,
        query: this.envInfo.query,
      }
      this?.owl?.error?.pushError(uploadError, 1)
    } catch(error) {
      console.log("上报收银台报错失败", err)
      const uploadError = new Error('上报收银台报错失败')
      uploadError.level = 'error'
      uploadError.category = 'ajaxError'
      uploadError.customData = {
        params: cashierParams,
        query: this.envInfo.query,
        errName: error.name,
        errMsg: error.message,
      }
      this?.owl?.error?.pushError(uploadError, 1)
    }
  }

  /**
   * 设置请求锁
   * @param {boolean} lock
   */
  // setSubmitLock(lock = false) {
  //   this.submitLock = lock
  // }

  login() {
    if (this.tools.mtLogin) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      this.tools.mtLogin({
        success: () => {
          window.location.reload()
        },
        fail: () => {
          console.log('fail');
        }
      })
    }
  }
  // 未登录情况下退出当前下单页
  closePage() {
    setTimeout(() => {
      pageRouterClose()
    }, 1000)
  }

  // 关闭透明容器
  closeContainer() {
    pageRouterClose()
  }

  setSelectedCard(val) {
    this.selectedCard = val
  }
  /**
   * 以下是交互触发的钩子函数
   */

  // 勾选会员卡和取消勾选会员卡触发的函数
  onCardSelectStatusChange(selectStatus) {
    this.setSelectedCard(selectStatus)
    this.premiumCardModuleClickLx()
    this.interactType = InteractType.CHANGE_CARD_STATUS
    this.requestPreorder({operatorPromoType: PromoType.CARD_PROMO_BEFORE_BUY_CARD})
  }
  // 券二级列表弹窗点击确定时或立减优惠勾选反勾选时触发
  onPromoDeskChange(params: any) {
    console.log("onPromoDeskChange: ", params)
    this.selectedPromoId = params?.selectedPromoId
    this.interactType = InteractType.SELECT_PROMO
    // 已开通会员卡，勾选或反勾选会员优惠的情况
    if(params?.operatorPromoType === PromoType.CARD_PROMO_AFTER_BUY_CARD) {
      if(params?.selectedPromoId) this.setSelectedCard(true)
      else this.setSelectedCard(false)
    }
    // operatorPromoType为当前用户交互操作的优惠类型
    this.requestPreorder({operatorPromoType: params?.operatorPromoType})
  }
  async requestPreorder(extraParams: any = undefined) {
    try {
      const promoExtMap = {
        pagesource: "3", // 透传给营销的参数，3代表填单页
        promosource: this.showPremiumPrice && this.cardInfo ? "2" : undefined // 透传给营销的参数，2代表入口为会员价，且用户未开通会员卡
      }
      const promoDeskJson = this.isFirstPreorder ? JSON.stringify({ promoExtMap}) : JSON.stringify(this.getPreorderPromoDeskParams({operatorPromoType: extraParams?.operatorPromoType, promoExtMap}))
      const requestParams = { ...this.getPreorderParam(), promoDeskJson: promoDeskJson } 
      console.log("请求preorder接口参数: ", requestParams)
      if(!requestParams.productItemId) return
      this.turnOnPageLoading()
      const responseData = await this.preorder(requestParams)
      console.log("请求preorder接口完成")
      if(this.isFirstPreorder) this.isFirstPreorder = false
      this.setPageData(responseData)
    } catch(error) {
      console.log("requestPreorder请求prorder接口失败：", error)
      const uploadError = new Error('requestPreorder请求prorder接口报错')
      uploadError.level = 'error'
      uploadError.category = 'ajaxError'
      uploadError.customData = {
        params: error?.info?.params,
        message: error?.info?.err?.message,
        requestUrl: error?.info?.requestUrl,
        query: this.envInfo.query,
        data: error?.info?.data,
        code: error?.info?.err?.code,
      }
      this?.owl?.error?.pushError(uploadError, 1)
    } finally {
      this.turnOffPageLoading()
    }
  }
  /**
   * 以上是交互触发的钩子函数
   */

  getPreorderPromoDeskParams(params: any) {
    const { operatorPromoType, promoExtMap } = params
    console.log("getPreorderPromoDeskParams this.promoDeskInfo: ", this.promoDeskInfo)
    // 改变数量框数量和点击时间grid触发的preorder请求只需传以下参数即可
    if(this.interactType === InteractType.CHANGE_QUANTITY || this.interactType === InteractType.SELECT_TIME) {
      return {
        promoExtMap
      }
    }
    // 当前优惠台优惠的选择状态
    const promoSnapshotList = this.promoDeskInfo?.promoInfoList?.reduce((list, item) => {
      // 复选框优惠只有一个promoId
      if(item.actionType === ActionType.CHECK_BOX) {
        return list.concat({
          promoId: item.promoId,
          promoType: item.promoType,
          selectedState: operatorPromoType === item.promoType ? (this.selectedPromoId === item.promoId ? 1 : 0) : item.selectedState
        })
      // 带弹窗的优惠有多个promoId
      } else if(item.actionType === ActionType.REDIRECT) {
        const availableCouponList = item?.availableCouponList || []
        return list.concat(availableCouponList.map((availableCoupon)=>{
          return {
            promoId: availableCoupon.promoId,
            promoType: item.promoType,
            selectedState: operatorPromoType === item.promoType ? (this.selectedPromoId === availableCoupon.promoId ? 1 : 0) : availableCoupon.selectedState
          }
        }))
      // 无任何交互的优惠
      } else if(item.actionType === ActionType.NONE) {
        // 搭售场景下，勾选和反勾选会员卡走以下分支
        if (operatorPromoType === item.promoType && operatorPromoType === PromoType.CARD_PROMO_BEFORE_BUY_CARD) {
          return list.concat({
            promoId: item.promoId,
            promoType: item.promoType,
            // 相反操作
            selectedState: item.selectedState ? 0 : 1
          })
        }
        return list.concat({
          promoId: item.promoId,
          promoType: item.promoType,
          selectedState: item.selectedState
        })
      }
    }, [])
    return {
      promoSnapshotList,
      operatorPromoType,
      promoExtMap
    }
  }

  uploadOrderSubmitFinishCost() {
    try {
      const cost = new Date().getTime() - this.pageStartTime
      // 延时1秒是为了保证在此之前配置为“rn_gc_bookingpedicure”的owl上报动作全部完成
      setTimeout(()=>{
        this.uploadToTraWeb(cost)
      }, 1000)
    } catch(err) {
      console.log('下单任务完成时间上报错误: ', err);
      const uploadError = new Error('下单任务完成时间上报错误')
        uploadError.level = 'error'
        uploadError.category = 'jsError'
        uploadError.customData = {
          errName: err.name,
          errMsg: err.message,
          biz: this?.owlConfig?.project
        }
      this?.owl?.error?.pushError(uploadError, true)
    }
  }
  uploadToTraWeb(cost) {
      // 下列代码后，当前this.owl实例配置会被覆盖（mrn owl自身的代码问题，只存在一个owl配置），如需上报到别的bundle，需要参考下列代码换owl配置
      new OWL(getOwlStartConfig({project: 'com.sankuai.gcfe.tra.appplatformweb', component: ''}))
      const metric = this.owl?.newMetrics()
      const tags = this.getUploadOrderSubmitFinishCostTags()
      metric.setTags(tags)
      metric.setMetrics('order_submit_time_cost', cost)
      metric.report()
      setTimeout(() => {
        // 切回原来bundle的配置
        new OWL(getOwlStartConfig({
          component: this?.owlConfig?.component, // 当前所处的组件
          project: this?.owlConfig?.project //  必填，Bundle 名称
        }))
      }, 2000);
  }
  getUploadOrderSubmitFinishCostTags() {
    const tags: Record<string, any> = {}
    return tags
  }
  /**
   * 下单成功后的打点
   */
  handleOrderSubmitLXAnalytics(..._args: any[]) {}

  /**
   * 页面pageView打点
   */
  pageViewLx() {}

  /**
   * 提交订单按钮点击事件打点
   */
  orderSubmitModuleClick() {}

  setProductInfo(productInfo: Partial<PreorderProductInfo>) {
    this.productInfo = { ...this.productInfo, ...productInfo }
  }

  setShopInfo(shopInfo: Partial<PreorderShopInfo>) {
    this.shopInfo = { ...this.shopInfo, ...shopInfo }
  }

  setUserInfo(userInfo: Partial<IUserInfo>) {
    this.userInfo = { ...this.userInfo, ...userInfo }
  }

  /**
   * 虚拟号变化时触发
   */
  toggleProtect() {
    this.virtualNumberInfo.use = !this.virtualNumberInfo.use
    this.virtualNumberModuleClick()
  }

  /**
   * 虚拟号触发变化时的点击点
   */
  virtualNumberModuleClick() {}

  /**
   * 打开虚拟号详情页灵犀点击点
   */
  goVirtualNumberDetailModuleClick() {}

  sendUtmSource(utmAndOrderId: SendOrderUtmParams) {
    return this.services.sendOrderUtm(utmAndOrderId)
  }

  promoDeskModuleClickLx(params: any) {}
  premiumCardModuleClickLx() {}
  premiumCardModuleViewLx() {}
  promoDeskModuleViewLx() {}
  douhuModuleView(bid, moduleAbInfo4Front) {
    lxTrackMGEViewEvent('gc', bid, this.lxInfo.cid, {
      abtest: moduleAbInfo4Front
    })
  }
  // 下单BO事件打点
  orderEventLx(params: any) {
    try {
      const {poi_id, product_id, category_id, order_id } = params
      lxTrackOrderEvent('gc', this.orderEventBid, order_id, {
        poi_id,
        product_id,
        category_id,
        order_id,
      }, {cid: this.lxInfo.cid})
    } catch(err) {
      console.log("下单BO事件打点失败：", err)
        const uploadError = new Error('下单BO事件打点失败')
        uploadError.level = 'info'
        uploadError.customData = {
          errName: err.name,
          errMsg: err.message,
          params
        }
        this?.owl?.error?.pushError(uploadError, 1)
    }
    
  }
  /**
   * 联系人点击点
   */
  
}

export default BaseOrderCreate