import BookingOrderCreate from '../../transactions/booking/order-create'
import dayjs from 'dayjs'
import { IJsonText } from '../../../services/interfaces/common'
import { PreorderRespFormated } from '../../../services/requests/preorder'
class SnapshotBookingOrderCreate extends BookingOrderCreate {
  // async prepareEnv() {
  //     // this.envInfo = await ready()
  //     await super.prepareEnv()
  //     await
  //   }

  getPurchaseDate() {
    const { query } = this.envInfo
    const timeSlot = decodeURIComponent(query.timeslot || '')
    let arriveTime = query.arriveTime || query.arrivetime || query.day || null
    if (!arriveTime && timeSlot) {
      const timeSlotMoment = dayjs(timeSlot, 'YYYY-MM-DD HH:mm')
      if (timeSlotMoment.isValid()) {
        arriveTime = timeSlotMoment.valueOf()
      }
    }
    // return Object.assign({}, params, {
    //     arriveTime,
    //     leaveTime: +query.leavetime || +query.leaveTime || null,
    //   purchaseDate: +query.purchasedate || +query.purchaseDate || null,
    //   appPeriodId: this.appPeriodId,
    //   appPeriodStr: this.appPeriodStr,
    // })
    let purchaseDate
    if (
      query.crossday === 'true' ||
      (parseInt(query.nextday) > 0 && query.appId)
    ) {
      // 库存时间等于到店时间减一天
      const purchase = parseInt(arriveTime) - 1000 * 60 * 60 * 24
      purchaseDate = new Date(purchase).getTime()
      /**
       * 特殊逻辑，临时调用业务接口获取正确 skuid
       * TODO 待业务 ios 问题修复后下线
       */
      //   try {
      //     productItemId = await getTempSkuId(this, productItemId, arriveTime, token)
      //   } catch (e) {}
    } else {
      if (arriveTime) {
        purchaseDate = new Date(parseInt(arriveTime)).getTime()
      } else {
        purchaseDate = Date.now()
      }
    }
    return purchaseDate
  }

  setPageData(data: PreorderRespFormated) {
    super.setPageData(data)
    this.timeInfo.purchaseTimeStamp = this.getPurchaseDate()
  }

  /**
   * 获取预下单请求参数
   */
  getPreorderParam() {
    const params = super.getPreorderParam()
    return {
      ...params,
      purchaseDate: this.getPurchaseDate()
    }
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
}

export default SnapshotBookingOrderCreate
