export interface LxOpt {
  /** 对本次事件单独指定的cid */
  cid?: string
  /** 对本次事件单独指定的上报通道 */
  category?: string
}

export const LXAnalytics = (...args: any[]) => {
  if (typeof window === 'undefined') {
    console.warn('请勿在 server 端打点: ', ...args)
    return
  }
  window.LXAnalytics && window.LXAnalytics(...args)
}

export const moduleClick = (
  bid: string,
  lab: Record<string, any> = {},
  opts: LxOpt | null = null
) => {
  LXAnalytics('moduleClick', bid, lab, opts)
}

export interface ClickOpt extends LxOpt {
  /** 参与MV合并的秒数 */
  delay?: number
}

export const moduleView = (
  bid: string,
  lab: Record<string, any> = {},
  opts: ClickOpt | null = null
) => {
  LXAnalytics('moduleClick', bid, lab, opts)
}
