import { env } from '@mrn/mrn-utils'
export const isDp = env.appID === '1' || env.platform === 'dpmp'
// export const isDp = env.appID === '10' || env.platform === 'mtmp'
export const isMt = env.appID === '10' || env.platform === 'mtmp'
export const isWx =
  env.platform === 'wechat' ||
  env.platform === 'mtmp' ||
  env.platform === 'dpmp'

export function skuDefaultPriceString(skuInfo: any) {
  const priceList = (skuInfo?.skuList || []).map(sku => sku.price)
  const priceMin = Math.min(...priceList)
  const priceMax = Math.max(...priceList)
  const defaultPrice =
    priceMin !== priceMax && priceList.length
      ? `${priceMin}-${priceMax}`
      : priceMin
  return defaultPrice
}
