import { Response } from '../interfaces/common'
import { Fetch } from '../service-interfaces'
import { checkRespnse } from '../utils/error'

export interface SendOrderUtmParams {
  [key: string]: string
  uniOrderId: string
}

export function sendOrderUtm(
  fetch: Fetch<Response<void>>,
  params: SendOrderUtmParams
) {
  const url = '/fun/sendOrderUtm.json2'
  return fetch({
    // method: 'post',
    url,
    params
  }).then(res => {
    return checkRespnse(res, {
      url,
      params
    })
  })
}
