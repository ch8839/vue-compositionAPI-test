import { ResultList } from './ResultList'
import { DzPictureDo } from './DzPictureDo'
import { JoyPromoTag } from './JoyPromoTag'
import { JoyServiceSelectTimeList } from './JoyServiceSelectTimeList'
export interface t extends ResultList.t {
  vipDisplayPriceShare?: string
  memberDiscountDesc?: string
  vipIcon?: string
  vipDisplayPrice?: string
  displayPrice?: string
  promoIcon?: string
  maxPrice?: number
  minPrice?: number
  scheduledId?: number
  week?: string
  day?: string
  tagImg?: DzPictureDo.t
  promoTags?: JoyPromoTag.t[]
  list?: JoyServiceSelectTimeList.t[]
  defaultCardInfo?: any
}
