import { Env } from '@nibfe/multi-platform-env/types/mrn'
// import { IcashierType } from '@nibfe/multi-platform-env/types/toolbox-interface'
import { lxTrackMGEClickEvent, lxTrackMGEViewEvent } from '@mrn/mrn-utils'

export interface IOneClickPayDisplayDTOInfo {
  disPlayStatus: number
  needGuideMarkSwitch: string
  guideMessage?: string
  oneClickPaySubTitle: string
  serialCode: string
  defaultPayType: any
  useStatus: boolean
  userChange?: boolean
}

class FastPay {
  moduleReady = false
  /**极速支付参数 */
  payType = 2 // 支付类型原始值，默认为普通支付
  // cashierType: IcashierType = IcashierType.traditionpay // "oneclickpay"极速支付; "traditionpay"普通支付
  cashierType = "traditionpay" // "oneclickpay"极速支付; "traditionpay"普通支付
  extraData = {} // reconfirm: 只有用户未开通，但是自动被打开(用户未点击userChange)才需要二次弹窗。1:弹；0不弹；open_oneClickPay: 是否需要开启极速支付。1: 需要；2:不需要

  oneClickPayDisplayDTOInfo: IOneClickPayDisplayDTOInfo = {
    disPlayStatus: -1,
    needGuideMarkSwitch: '',
    guideMessage: '',
    oneClickPaySubTitle: '',
    serialCode: '',
    defaultPayType: '',
    useStatus: false,
    userChange: false
  } // 极速支付组件模型

  douHuABTestDTO: any = {} // douhu AB Test模型

  // 额外数据
  extraParams: {
    envInfo: Env,
    cid: string
  } = {
    envInfo: {} as Env,
    cid: ''
  }
  // 多端包工具类
  tools: any

  init() {}

  /**
   * 初始化或更新极速支付
   */
  updateFastPay(params: {
    oneClickPayDisplayDTOInfo: IOneClickPayDisplayDTOInfo
    douHuABTestDTO: any
    tools: any
    envInfo: Env,
    cid: string
  }) {
    const { oneClickPayDisplayDTOInfo, douHuABTestDTO, envInfo, tools } = params
    if (oneClickPayDisplayDTOInfo) {
      // 0：不展示任何模块；1：展示极速支付开通引导模块；2：展示支付模块
      const disPlayStatus = oneClickPayDisplayDTOInfo?.disPlayStatus
      const userChange = oneClickPayDisplayDTOInfo?.userChange
      const serialCode = oneClickPayDisplayDTOInfo?.serialCode
      this.oneClickPayDisplayDTOInfo = oneClickPayDisplayDTOInfo
      console.log("oneClickPayDisplayDTOInfo?.defaultPayType ", oneClickPayDisplayDTOInfo?.defaultPayType)
      // 模块未初始化
      if(!this.moduleReady) { 
        // 1: 极速支付 2: 普通支付
        this.payType = oneClickPayDisplayDTOInfo?.defaultPayType || 2
        this.cashierType = (oneClickPayDisplayDTOInfo?.defaultPayType || 2)  == 1 ? 'oneclickpay' : 'traditionpay'
        this.extraData = oneClickPayDisplayDTOInfo?.defaultPayType == 1 ? {
          // 开通极速支付时是否需要二次弹窗，1为需要，2为不需要。
          reconfirm:
            disPlayStatus == 1 && !userChange ? 1 : 0,
          // 是否需要开通极速支付，1为需要开通，0为无需开通。
          open_oneclickpay: disPlayStatus == 1 ? 1 : 0,
          // reconfirm: 1,
          // open_oneclickpay: 1,
          serialCode: serialCode
        } : {}
      // 模块已初始化
      } else {
        this.extraData = this.payType == 1 ? {
          reconfirm:
            disPlayStatus == 1 && !userChange ? 1 : 0,
          open_oneclickpay: disPlayStatus == 1 ? 1 : 0,
          // reconfirm: 1,
          // open_oneclickpay: 1,
          serialCode: serialCode
        } : {}
      }
    }
      
    this.douHuABTestDTO = douHuABTestDTO
    this.extraParams = {
      envInfo,
      cid: params.cid
    }
    this.tools = tools
    if(!this.moduleReady) this.moduleReady = true
  }

  /**
   * 极速支付灰度策略数据
   */
  get douHuABTestStrategy() {
    const douHuABTestDTO = this.douHuABTestDTO || {}
    const douHuTestList = douHuABTestDTO.douHuTestList || []
    const actionType = 'oneClickPay'
    return (
      douHuTestList.filter(
        (item: { actionType: string }) => item.actionType == actionType
      )[0] || {}
    )
  }

  /**
   * 极速支付是否展示
   */
  get isShowFastPay() {
    // 点评10.29.0以下的版本因为没有加混淆规则，导致极速支付时会app crash。需要限制点评版本
    const { envInfo } = this.extraParams
    if(!envInfo) return false
    const { isApp, isDp, uaInfo } = envInfo
    const { version } = uaInfo
    const suitVersion = () => {
      if (isDp && isApp) {
        return version && this.tools.compareVersion(version, '10.29.0') >= 0 ? true : false
      }
      return true
    }
    return suitVersion()
  }

  /**
   * 修改支付类型（极速支付/普通支付切换）
   */
  changePayType({ payType }: { payType: number }) {
    const { needGuideMarkSwitch, disPlayStatus, userChange, serialCode } =
      this.oneClickPayDisplayDTOInfo
    // payTypeStatus: 1极速支付，2普通支付
    // 只有支付方式改变时才触发方法变更
    if (disPlayStatus == 1) {
      // 引导
      lxTrackMGEClickEvent('gc', 'b_gc_2nobxwue_mc', this.extraParams.cid, {
        abtest: this.douHuABTestStrategy.moduleAbInfo4Front
      })
    } else if (disPlayStatus == 2) {
      // 支付选择
      lxTrackMGEClickEvent('gc', 'b_gc_2lssh0h3_mc', this.extraParams.cid, {
        abtest: this.douHuABTestStrategy.moduleAbInfo4Front
      })
        
    }
    if (this.payType == payType) {
      return
    }
    this.payType = payType
    this.cashierType = payType == 1 ? "oneclickpay" : "traditionpay"
    this.extraData =
      payType == 1
        ? {
            reconfirm:
              disPlayStatus == 1 && !userChange ? 1 : 0,
            open_oneclickpay: disPlayStatus == 1 ? 1 : 0,
            // reconfirm: 1,
            // open_oneclickpay: 1,
            serialCode: serialCode
          }
        : {}
    
  }

  /**
   * 极速支付的moduleView打点
   */
  fastPayModuleView() {
    const { disPlayStatus } = this.oneClickPayDisplayDTOInfo
    // 无论组件是否展示，都会上报该abtest标识
    lxTrackMGEViewEvent('gc', 'b_ea8490pq', this.extraParams.cid, {
      abtest: this.douHuABTestStrategy.moduleAbInfo4Front
    })
    if (this.isShowFastPay && disPlayStatus == 1) {
      // 引导场景，未开通极速支付
      lxTrackMGEViewEvent('gc', 'b_gc_2nobxwue_mv', this.extraParams.cid, {
        abtest: this.douHuABTestStrategy.moduleAbInfo4Front
      })
    } else if (this.isShowFastPay && disPlayStatus == 2) {
      // 支付选择类型
      lxTrackMGEViewEvent('gc', 'b_gc_2lssh0h3_mv', this.extraParams.cid, {
        abtest: this.douHuABTestStrategy.moduleAbInfo4Front
      })
    }
  }
}

export default FastPay