import { Response } from '../interfaces/common'

export class FetchBizError<T = any> extends Error {
  code?: number
  msg?: string
  data?: T
  constructor(errResp: Response<T>, public extra: Record<string, any>) {
    super(errResp.msg)
    this.name = 'FetchBizError'
    this.msg = errResp.msg
    this.code = errResp.code
    this.data = errResp.data
  }

  toString() {
    return `${super.toString()}\n ${JSON.stringify({
      code: this.code,
      data: this.data,
      ...this.extra
    })}`
  }
}

export const checkRespnse = <T>(
  res: Response<T>,
  extra: Record<string, any> = {}
) => {
  if ((res.code && res.code != 200) || !res.data) {
    throw new FetchBizError(res, extra)
  }
  return res
}
