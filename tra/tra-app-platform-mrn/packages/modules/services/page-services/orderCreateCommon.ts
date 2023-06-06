import serviceFactory from '../factory'
import {
  dztradeGeneralApplyPayment,
  originalPayment
} from '../requests/applyPayment'
import { createOrder } from '../requests/createOrder'
import {
  IVirtualNumberInfo,
  PreorderProductInfo,
  PreorderShopInfo,
  IUserInfo,
  preorder
} from '../requests/preorder'
import { sendOrderUtm } from '../requests/sendOrderUtm'
import { timeSelect } from '../requests/timeSelect'

export type {
  IVirtualNumberInfo,
  PreorderProductInfo,
  PreorderShopInfo,
  IUserInfo
}

const createPreorderService = serviceFactory({
  preorder: preorder,
  createOrder: createOrder,
  applyPayment: dztradeGeneralApplyPayment,
  originalPayment: originalPayment,
  sendOrderUtm: sendOrderUtm,
  timeSelect: timeSelect
})

export default createPreorderService
