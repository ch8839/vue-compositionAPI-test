import { Response, Channel } from '../interfaces/common'
import { Fetch } from '../service-interfaces'
import { JoyServiceSelectDayList } from './Models/JoyServiceSelectDayList'
import { timeSelectDataMock } from '../mocks/booking_create_order'

export interface timeSelectRequestParams {
  shopid: string // 商户id
  shopuuid?: string // 点评侧shopuuid
  showtype?: number // 时间选择页展示方式，1表示"点评预订"，2表示只展示"会员预订"
  serviceid: number // SPUID
  cityid?: number // 城市 ID
}

export function timeSelect(
  fetch: Fetch<JoyServiceSelectDayList.t>,
  params: timeSelectRequestParams
): Promise<JoyServiceSelectDayList.t> {
  const fetchPatams = {
    url: '/mapi/joy/serviceselecttime.joy',
    params: params,
    headers: {
      mkscheme: 'https'
    },
    isMapi: true,
  }
  // return new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     resolve(timeSelectDataMock)
  //   }, 1000)
  // }) 
  return fetch(fetchPatams).then(data => data)
}
