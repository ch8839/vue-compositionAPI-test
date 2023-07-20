interface IConfig {
  appKey?: string
  platform?: number
  shopId: string | number
  dpShopUuid: string
  orderId: string
  orderSt: string
}

// type Key = keyof any
// interface Object<T> {
//   [P in Key]: T
// }

export type ObjectType<T> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [P in keyof any]: T
}
;('')
export interface IEnv<T extends ObjectType<string> = ObjectType<string>> {
  query: T
  cx: string
  token: string
  openId: string
  uuid: string
  // 环境信息
  cityId: number
  channel: string
  platform: string
  clientType: string
  lat: number
  lng: number
  [index: string]: any
}
