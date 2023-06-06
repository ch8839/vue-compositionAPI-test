import { ResultList } from './ResultList'
import { JoyServiceSelectDay } from './JoyServiceSelectDay'
export interface t extends ResultList.t {
  shelfTypeOcean?: number
  memberProfileOcean?: number
  cardTypeOcean?: number
  custDiscountDesc?: string
  cardDesc?: string
  discountDesc?: string
  priceTypeDesc?: string
  duration?: string
  serviceId?: number
  title?: string
  serviceTitle?: string
  buttonText?: string
  buttonUrl?: string
  list?: JoyServiceSelectDay.t[]
}
