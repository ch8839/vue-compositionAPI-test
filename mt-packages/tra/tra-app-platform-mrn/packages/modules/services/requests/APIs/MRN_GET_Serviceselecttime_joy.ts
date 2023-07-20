/**
 * @apiName serviceselecttime.joy
 * @apiType GET
 * @apiUrl https://mapi.dianping.com/mapi/joy/serviceselecttime.joy
 * @bridgeType mrn
 */
import { mapi } from '@mrn/mrn-utils'
import { JoyServiceSelectDayList } from '../Models/JoyServiceSelectDayList'

interface RequestParams {
  shopid: string // 商户id
  shopuuid?: string // 点评侧shopuuid
  showtype?: number // 时间选择页展示方式，1表示"点评预订"，2表示只展示"会员预订"
  serviceid: number // SPUID
  cityid?: number // 城市 ID
}

interface MapiOptions {
  // 签名，可选，默认true
  signature?: boolean
  // 防刷单，可选，默认false
  fabricate?: boolean
  // 是否支持幂等，可选，POST默认false，GET默认true
  failOver?: boolean
  // 缓存设置，可选，只有get支持，默认不缓存（0：不缓存，其他：缓存）
  cacheType?: number
  // 请求头
  headers?: {
    // 默认请求头
    picasso?: 'no-js'
    'mrn-version'?: ''
    'mrn-project'?: ''
  }
  // 设置压缩
  compress?: boolean
}

// 休娱足疗按摩选择日期时间接口跨平台接口，放“到店综合公共”下面
export function MRN_GET_Serviceselecttime_joy(
  params: RequestParams,
  mapiOptions?: MapiOptions,
): Promise<JoyServiceSelectDayList.t> {
  return mapi({
    url: 'https://mapi.dianping.com/mapi/joy/serviceselecttime.joy',
    method: 'GET',
    params,
    ...mapiOptions,
  })
  .catch((e: any) => {
    e.userInfo = {
      ...e.userInfo,
      requestInfo: {
        url: 'https://mapi.dianping.com/mapi/joy/serviceselecttime.joy',
      },
    }
    throw e
  })
}
