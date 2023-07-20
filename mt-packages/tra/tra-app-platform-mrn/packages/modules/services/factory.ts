import qs from 'qs'
import { request, env, mapi } from '@mrn/mrn-utils'

const DOMAIN_MAPI_DP_PROD = 'https://mapi.dianping.com',
  DOMAIN_M_DP_PROD = 'https://m.dianping.com'

function getHost(type = 'mapi') {
  let API_DOMAIN = ''

  // 默认取mapi的域名
  if (type === 'm') {
    API_DOMAIN = DOMAIN_M_DP_PROD
  } else {
    API_DOMAIN = DOMAIN_MAPI_DP_PROD
  }
  return API_DOMAIN
}

export interface ServiceRequestConfig {
  // post请求如果是application/x-www-form-urlencoded，将此参数设置为form，其他情况不用设置
  contentType?: string
  // 单位 s
  timeout?: number
  // 是否支持幂等，可选，POST默认false，GET默认true
  failOver?: boolean
  // 用于区分是哪个业务的请求，这个参数用于辅助定制网络拦截和网络回调
  mrnChannel?: string
  // 请求头
  headers?: { [key: string]: any }
  options?: {
    disableShark?: boolean
    registerCandyHost?: boolean
    interceptors?: any[]
  }
  // 请求路径path
  url?: string
  // 请求参数
  params?: any
  data?: any
  // 请求host类型
  hostType?: string
  // 请求域名
  baseURL?: string
  // 请求方式
  method?: string
  // 是否是移动之家上定义的接口，移动之家定义的接口走mapi请求，否则走request请求
  isMapi?: boolean
}

export class BaseService {
  __requestOptions = {}

  constructor() {
    this.setDefaultRequestOptions()
  }

  // 设置请求默认参数
  setDefaultRequestOptions() {
    const options: ServiceRequestConfig = {
      baseURL: 'https://mapi.dianping.com',
      method: 'GET',
      options: {
        interceptors: ['prenetwork']
      },
      isMapi: false
    }
    this.__requestOptions = options
  }

  // 获取Mapi的请求url
  getMapiRequestUrl({url, hostType}) {
    if (url.includes('http')) {
      return url
    } else {
      return `${getHost(hostType)}${url}`
    }
  }

  __fetch(options: ServiceRequestConfig) {
    const { hostType, headers, method, data, isMapi, url } = options
    console.log('data: ', data);

    if (
      method === 'post' &&
      headers['content-type'] === 'application/x-www-form-urlencoded'
    ) {
      // post请求如果是application/x-www-form-urlencoded，将此参数设置为form，其他情况不用设置
      options.contentType = 'form'
      // params
      if (isMapi) {
        options.params = data
      }
    }

    if (isMapi) {
      const requestConfig = {
        ...this.__requestOptions,
        ...options,
        url: this.getMapiRequestUrl({url, hostType}),
      }
      console.log('requestConfig: ', requestConfig);
      return mapi(requestConfig).then(res => {
        return res
      }).catch(err => {
        err = {
          title: '接口异常',
          category: 'ajaxError',
          info: {
            err,
            requestUrl: options.url || '',
            params: options.params || '',
            data: options.data || ''
          }
        }
        throw err
      })
    }

    const __requestConfig = {
      ...this.__requestOptions,
      baseURL: getHost(hostType),
      ...options
    }

    console.log('__requestConfig: ', __requestConfig);

    return request(__requestConfig)
      .then(res => {
        return res.data
      })
      .catch(err => {
        err = {
          title: '接口异常',
          category: 'ajaxError',
          info: {
            err,
            requestUrl: options.url || '',
            params: options.params || '',
            data: options.data || ''
          }
        }
        throw err
      })
  }
}

type Fn = (...args: any[]) => any

type RemoveFirstParam<T> = T extends (first: any, ...args: infer U) => infer P
  ? (...args: U) => P
  : never

type RemoveFirst<T extends Record<string, Fn>> = {
  [key in keyof T]: RemoveFirstParam<T[key]>
}

type ServiceCreator<
  U extends Fn,
  T extends Record<string, U>
> = () => BaseService & RemoveFirst<T>

const PROTECTED_NAMES = ['fetch']

export default function serviceFactory<
  U extends Fn,
  T extends Record<string, U>
>(requests: T): ServiceCreator<U, T> {
  return function createService() {
    const service = new BaseService() as BaseService & RemoveFirst<T>
    const fetch = service.__fetch.bind(service)

    const requestNames = Object.keys(requests)
    for (let i = 0; i < requestNames.length; i++) {
      const name = requestNames[i]
      if (PROTECTED_NAMES.indexOf(name) !== -1) {
        console.error('请求函数不能为下列名称', PROTECTED_NAMES)
        break
      }
      const wrapFn = (...args: any[]) => {
        return requests[name](fetch, ...args)
      }
      Object.defineProperty(service, name, {
        value: wrapFn,
        enumerable: false,
        configurable: true,
        writable: true
      })
    }
    return service
  }
}
