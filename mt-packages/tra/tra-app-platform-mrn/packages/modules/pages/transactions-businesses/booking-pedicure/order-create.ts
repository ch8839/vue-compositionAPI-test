import BookingOrderCreate from '../../transactions/booking/order-create'
import { IJsonText } from '../../../services/interfaces/common'
import { PreorderRespFormated, InteractType } from '../../../services/requests/preorder'
import KNB from '@mrn/mrn-knb'
import { lxTrackMGEClickEvent, lxTrackMGEViewEvent } from '@mrn/mrn-utils'
import { numberToWeekDayText, numberToTwoDigitNumberText } from '../../../utils/helper'
interface TimeSelectData {
  duration?: string
  timeSelectList?: Array<any>
  defaultBottomBannerText?: string
  serviceTitle?: string
  nowTimeStamp?: number
  cardTypeOcean?: number,
  shelfTypeOcean?: number,
  memberProfileOcean?: number,
}

class PedicureBookingOrderCreate extends BookingOrderCreate {
  // 标价为原价的时间选择模块用的数据
  originalPriceTimeSelectData?: TimeSelectData = undefined
  // 标价为会员价的时间选择模块用的数据
  premiumPriceTimeSelectData?: TimeSelectData = undefined
  // 足疗预订下单BO事件的bid
  orderEventBid = 'b_g_bo_2015110600000008'

  // 页面灵犀打点：https://ocean.sankuai.com/config/#/demand/program/edit?flowId=40115&action=detail
  lxInfo = {
    cid: 'c_gc_i7obu3qh',
  }

  async pageInit() {
    try {
      // await checkLogin()
      await this.prepareEnv()
      this.owlConfig = {project: 'rn_gc_bookingpedicure', component: 'booking_pedicure_order_create'}
      // this.services = serviceFactory(this.transactionCode) // 装载服务
      const requestParams = this.getTimeSelectDataParams()
      console.log('货架的requestParams: ', requestParams)
      const responseData = await this.getTimeSelectData(requestParams)
      console.log('货架的responseData: ', responseData)
      if(!responseData) throw new Error("货架数据请求错误，pageInit报错")
      this.finishPage()
      // 货架返回的卡信息
      const defaultCardInfo = (responseData?.list?.length > 0 && responseData?.list[0].defaultCardInfo) || null
      try {
        // 会员卡曝光点
        if(defaultCardInfo) this.premiumCardModuleViewLx()
      } catch(err) {
        console.log("会员卡曝光点打点失败：", err)
        const uploadError = new Error('会员卡曝光点打点失败')
        uploadError.level = 'info'
        uploadError.customData = {
          errName: err.name,
          errMsg: err.message,
        }
        this?.owl?.error?.pushError(uploadError, 1)
      }
      this.cardInfo = defaultCardInfo
      // 用户已开通会员卡的情况，默认选择会员优惠，selectedCard视为true
      if(this.showPremiumPrice && !defaultCardInfo) this.setSelectedCard(true)
      // 用户未开通会员卡的情况
      else this.setSelectedCard(defaultCardInfo?.selectedCard || false)
      this.setTimeSelectData({responseData, isPremiumPrice: this.showPremiumPrice})
      try {
        this.modalModuleView()
        this.timeSelectModuleView()
      } catch(err) {
        console.log("浮层或时间选择模块曝光点打点失败：", err)
        const uploadError = new Error('浮层或时间选择模块曝光点打点失败')
        uploadError.level = 'info'
        uploadError.customData = {
          errName: err.name,
          errMsg: err.message,
        }
        this?.owl?.error?.pushError(uploadError, 1)
      }
      const timeSelectData = this.showPremiumPrice ? this.premiumPriceTimeSelectData : this.originalPriceTimeSelectData
      // 底部栏的商品情况和价格展示信息，默认选第一个日期Tab的价格信息
      this.bottomPriceData = timeSelectData?.timeSelectList.length > 0 && timeSelectData?.timeSelectList[0]
    } catch(err) {
      console.log('pageInit报错: ', err);
      const uploadError = new Error('pageInit报错')
        uploadError.level = 'error'
        uploadError.category = 'jsError'
        uploadError.customData = {
          errName: err.name,
          errMsg: err.message,
        }
      this?.owl?.error?.pushError(uploadError, 1)
      this.$toast("页面加载错误, 请退出重新进入")
      throw err
    } finally {
      this.turnOffPageLoading()
    }
  }

  async afterInit() {
    super.afterInit()
    const requestParams = this.getTimeSelectDataParams()
    requestParams.showtype = !this.showPremiumPrice ? 2 : 1
    console.log('afterInit货架的requestParams: ', requestParams)
    const responseData = await this.getTimeSelectData(requestParams)
    console.log('afterInit货架的responseData: ', responseData)
    this.setTimeSelectData({responseData, isPremiumPrice: !this.showPremiumPrice})
  }

  getTimeSelectDataParams() {
    const query = this.envInfo?.query
    const { serviceid = "", shopid = "", showtype = 1 } = query
    this.shopInfo.shopId = shopid
    this.showPremiumPrice = showtype == 2 ? true : false
    const params = {
      "serviceid": serviceid, // 等同于productId
      "shopIdStr": shopid,
      "shopid": shopid,
      "showtype": showtype,
      "floatType": 1,
    }
    return params
  }

  // 请求货架接口
  getTimeSelectData(params) {
    return this.services.timeSelect(params)
      .then(res => {
        return res
      }).catch(error => {
        console.log("请求货架接口/mapi/joy/serviceselecttime.joy错误：", error)
        const uploadError = new Error('请求货架接口/mapi/joy/serviceselecttime.joy错误')
        uploadError.level = 'error'
        uploadError.category = 'ajaxError'
        // 接口报错的数据结构
        uploadError.customData = {
          params: error?.info?.params,
          message: error?.info?.err?.message,
          requestUrl: error?.info?.requestUrl,
          query: this.envInfo.query,
          data: error?.info?.data,
          code: error?.info?.err?.code,
        }
        this?.owl?.error?.pushError(uploadError, 1)
        return null
      }) 
  }

  setPageData(data: PreorderRespFormated) {
    super.setPageData(data)
    const { douHuTestList } = data?.douHuABTestDTO
    const promoDouHu = douHuTestList.find((item)=>{return item.actionType === 'reservePromoShow'})
    if(!promoDouHu) return
    this.douhuModuleView('b_gc_klhn8qjm_mv', promoDouHu?.moduleAbInfo4Front)
    this.promoDouHu = promoDouHu
    this.isGray = /^exp\d+_b$/.test(promoDouHu.strategyId) ? true : false
  }
  // 关闭透明容器
  closeContainer() {
    super.closeContainer()
    // 修复预订浮层退出后，商户页导航栏右侧错乱的问题，商户页前端wangzhenxing03要求加的逻辑
    KNB.publish({
      type: 'native',
      action: 'gc_bookingpedicure_close',
      data: {
          unionId: this?.envInfo?.query?.unionId
      },
      success: function () {},
      fail: function () {}
    })
  }

  setTimeSelectData(params: any) {
    const { responseData, isPremiumPrice } = params
    // afterInit里请求货架报错
    if(!responseData) {
      // 预订价入口，会员价数据请求失败
      if(isPremiumPrice) this.premiumPriceTimeSelectData = this.originalPriceTimeSelectData
      // 会员价入口，预订价数据请求失败
      else this.originalPriceTimeSelectData = this.premiumPriceTimeSelectData
      return
    }
    const res = {
      timeSelectList: responseData?.list,
      duration: responseData?.duration,
      defaultBottomBannerText: responseData?.title,
      serviceTitle: responseData?.serviceTitle,
      nowTimeStamp: responseData?.nowTimeStamp,
      // 以下都是打点用参数
      cardTypeOcean: responseData?.cardTypeOcean,
      shelfTypeOcean: responseData?.shelfTypeOcean,
      memberProfileOcean: responseData?.memberProfileOcean,
    }
    if(isPremiumPrice) {
      this.premiumPriceTimeSelectData = res
    } else {
      this.originalPriceTimeSelectData = res
    }
  }

  // 用户选择小时分钟维度的时间点时触发
  async onClickTime(params) {
    try {
      const { arriveTime, productItemId, nextDayText, index, time, duration } = params
      // 选择新的时间点
      this.setTimeInfo(arriveTime)
      this.selectedProductItemId = productItemId
      this.selectedArriveTime = arriveTime
      this.interactType = InteractType.SELECT_TIME
      // 是否跨天：表现在时间方块左上角是否有“次日”
      this.isCrossDay = nextDayText ? true : false
      const arriveTimeDateObj = new Date(arriveTime)
      const _bottomBannerTextParts = {
        week: numberToWeekDayText(arriveTimeDateObj.getDay()),
        day: `${numberToTwoDigitNumberText(arriveTimeDateObj.getMonth()+1)}.${numberToTwoDigitNumberText(arriveTimeDateObj.getDate())}`,
        time,
        duration,
      }
      this.timeSelectGridModuleClick({index, arriveTime})
      await this.requestPreorder()
      this.setBottomBannerTextParts({..._bottomBannerTextParts, number: `${this.quantity}人`})
      this.setIsTimeSelected(true)
    } catch(err) {
      console.log("点击足疗预订浮层时间块报错: ", err)
      const uploadError = new Error('点击足疗预订浮层时间块报错')
      uploadError.level = 'error'
      uploadError.category = 'jsError'
      uploadError.customData = {
        errName: err.name,
        errMsg: err.message,
      }
      this?.owl?.error?.pushError(uploadError, 1)
    }
  }
  
  // 用户切换日期Tab时触发
  onChangeDateTab(params: any) {
    const { index, bookingDate } = params
    // 货架数据
    let { bottomPriceData } = params
    this.setTimeInfo(undefined)
    this.setIsTimeSelected(false)
    // 用户未开通会员卡，会员价为入口时，切换日期的时候，自动勾选会员卡，选用会员价货架数据
    if(this.showPremiumPrice && this.cardInfo) {
      this.setSelectedCard(true)
      const timeSelectData = this.showPremiumPrice ? this.premiumPriceTimeSelectData : this.originalPriceTimeSelectData
      bottomPriceData = timeSelectData?.timeSelectList.length > 0 && timeSelectData?.timeSelectList[index]
    }
    this.bottomPriceData = bottomPriceData
    // 因为此时会回到货架，所以卡信息也切换到对应日期tab的卡信息
    this.cardInfo = bottomPriceData?.defaultCardInfo
    try {
      this.timeSelectTabModuleClick({index, bookingDate})
    } catch(err) {
      console.log("预订浮层日期Tab点击点报错: ", err)
      const uploadError = new Error('预订浮层日期Tab点击点报错')
      uploadError.level = 'error'
      uploadError.category = 'jsError'
      uploadError.customData = {
        errName: err.name,
        errMsg: err.message,
      }
      this?.owl?.error?.pushError(uploadError, 1)
    }
    this.interactType = InteractType.SELECT_DAY
    this.selectedProductItemId = ""
  }

  getUploadOrderSubmitFinishCostTags() {
    const tags = super.getUploadOrderSubmitFinishCostTags()
    tags.category = 'mrn足疗预订'
    return tags
  }
  
  // 时间选择模块曝光点
  timeSelectModuleView() {
    if(this?.usedTimeSelectData?.timeSelectList?.length === 0) return
    lxTrackMGEViewEvent('gc', 'b_gc_b_w6ZIh_mv', this.lxInfo.cid, {
      poi_id: this.shopInfo.shopId || '',
    })
  }
  // 时间选择模块tab点击点
  timeSelectTabModuleClick(params: any) {
    const { index, bookingDate } = params
    const bookingDateObj = new Date(bookingDate)
    lxTrackMGEClickEvent('gc', 'b_w6ZIh', this.lxInfo.cid, {
      poi_id: this.shopInfo.shopId || '',
      Booking_select_Date: bookingDateObj.toLocaleDateString(),
      index,
      Booking_select_detaillable: -9999,
      Booking_select_detailtime: -9999,
    })
  }
  // 时间选择模块grid点击点
  timeSelectGridModuleClick(params: any) {
    const { index, arriveTime } = params
    const arriveTimeDateObj = new Date(arriveTime)
    lxTrackMGEClickEvent('gc', 'b_VOGCH', this.lxInfo.cid, {
      poi_id: this.shopInfo.shopId || '',
      Booking_select_Date: arriveTimeDateObj.toLocaleDateString(),
      Booking_select_detailtime: arriveTimeDateObj.toLocaleTimeString(),
      Booking_select_detailtime_index: index,
      Booking_select_detaillable: -9999
    })
  }
  // 右上角浮层的x点击点
  exitModuleClick() {
    const arriveTime = this.selectedArriveTime
    const arriveTimeDateObj = new Date(arriveTime)
    lxTrackMGEClickEvent('gc', 'b_gc_close_windows_mc', this.lxInfo.cid, {
      poi_id: this.shopInfo.shopId || '',
      Booking_select_Date: arriveTimeDateObj.toLocaleDateString(),
      Booking_select_detailtime: arriveTimeDateObj.toLocaleTimeString(),
      Booking_select_detaillable: -9999
    })
  }

  // 浮层曝光点
  modalModuleView() {
    lxTrackMGEViewEvent('gc', 'b_qrMeS', this.lxInfo.cid, {
      spu_id: this.shopInfo.shopId || '',
      shelf_type: this.usedTimeSelectData.shelfTypeOcean,
      card_type: this.usedTimeSelectData.cardTypeOcean,
      member_profile: this.usedTimeSelectData.memberProfileOcean,
    })
  }
  /**
   * 预订下单页退款规则
   */
  get refundRuleInfo() {
    let cur: IJsonText[][] = []
    if (!this.isOverRefundTime) {
      const hoursBefore = this.refundRule.hoursBefore
        ? parseFloat(String(this.refundRule.hoursBefore))
        : 0
      // const hoursBefore = this.hoursBefore ? parseFloat(this.hoursBefore) : 0
      let hoursBeforeStr = '预订时间'
      if (this.timeInfo.arriveTimeStamp) {
        const refundTimeStamp =
          this.timeInfo.arriveTimeStamp - hoursBefore * 60 * 60 * 1000
        hoursBeforeStr = this.formatTime(
          refundTimeStamp + this.refundRule.refundTime * 60 * 60 * 1000
        )
      } else {
        if (hoursBefore) {
          hoursBeforeStr = `到店时间${hoursBefore}小时`
        }
      }
      cur = [
        [
          { text: '预订成功后，平台' },
          { text: '暂不支持修改订单', strong: true },
          { text: '，如您有时间调整等需求，请联系商家进行协商' }
        ],
        [
          { text: `${hoursBeforeStr}`, strong: true },
          { text: '前支持随时申请免审核退款' }
        ],
        [
          { text: `${hoursBeforeStr}`, strong: true },
          { text: '后申请退款需商户审核同意' }
        ]
      ]
    } else {
      cur = [
        [
          { text: '预订成功后，平台' },
          { text: '暂不支持修改订单', strong: true },
          { text: '，如您有时间调整等需求，请联系商家进行协商' }
        ],
        [
          { text: '已过最晚免审核退款时间，预订成功后' },
          { text: '申请退款需商户审核同意', strong: true }
        ]
      ]
    }

    return {
      title: '退款规则：',
      ruleList: cur
    }
  }

  /**
   * 数量选择配置
   */
   get quantityConfig() {
    const res = super.quantityConfig
    res.title = '人数'
    return res
   }

   get usedTimeSelectData() {
    if(this.selectedCard) {
      return this.premiumPriceTimeSelectData
    }
    return this.originalPriceTimeSelectData
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
}

export default PedicureBookingOrderCreate