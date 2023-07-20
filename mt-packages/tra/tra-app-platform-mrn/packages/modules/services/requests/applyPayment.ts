import qs from 'qs'
import { Fetch } from '../service-interfaces'
import { Response, IApplyPaymentResponse } from '../interfaces/common'
import { ServiceRequestConfig } from '../factory'

export interface ApplyPayment {
  (fetch: Fetch, params: IParams): Promise<Response<IApplyPaymentResponse>>
}

export interface IParams {
  token: string
  uniOrderId: string
  cooperationBizType: string | number
  channel: string
  platform: string
  cx: string | number
  sourcetype: string
  oneClickPayStatus?: number | boolean
  openId?: string | number
  appId?: string
  clientType?: string
}

export const dztradeGeneralApplyPayment: ApplyPayment = function (
  fetch,
  params
) {
  const url = '/dztrade/groupbuy/online/applypayment'
  const requestParams: IParams = params
  return fetch({
    url,
    params: requestParams,
    method: 'POST',
    headers: { 
      'content-type': 'application/x-www-form-urlencoded',
      mkscheme: 'https'
    },
    // data: qs.stringify(requestParams)
  }).then((res: Response<IApplyPaymentResponse>) => {
    return res
  })
}

/**
 * 原价支付
 */
export const originalPayment = (
  fetch: Fetch<Response<IApplyPaymentResponse>>,
  params: IParams
) => {
  const fetchParams: ServiceRequestConfig = {
    url: '/dzbook/paywithoutoutlet.json2',
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: qs.stringify(params)
  }
  return fetch(fetchParams)
}
