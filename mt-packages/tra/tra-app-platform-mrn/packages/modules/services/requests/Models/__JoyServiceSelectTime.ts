import { DzPictureDo } from './DzPictureDo'
import { JoyPromoTag } from './JoyPromoTag'
export interface t {
  vipIcon?: string
  vipPrice?: number
  vipPriceLabelShare?: string
  memberDiscountDesc?: string
  vipPriceLabel?: string
  displayPrice?: string
  promoIcon?: string
  status?: number
  displayTime?: string
  actualTime?: number
  stockDesc?: string
  nextDayText?: string
  price?: number
  tagImg?: DzPictureDo.t
  promoTag?: JoyPromoTag.t
}
