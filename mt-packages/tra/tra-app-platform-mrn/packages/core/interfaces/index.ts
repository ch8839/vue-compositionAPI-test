// ===== 基础定义 =====
export interface ClassType<T> extends Function {
  name: string
  new(...args: unknown[]): T
}

interface Env {
  token: string
}

// ===== 页面/模块 =====
// 页面基础接口
export interface IBasePage {
  owl: any
  envInfo: Env
  pageLoading: boolean
  pageReady: boolean
  beforeInit(props: any): void
  pageInit(props: any): void
  afterInit(props: any): void
  // 通用交互能力
  $navigation?: any // todo: navigation
  $toast?: (content: any, options?: any) => any | {
    open: (content: any, options?: any) => any
  }
  $dialog?: {
    open?: (options?: any) => any
    (options?: any): any
    [key: string]: any
  }
  [propName: string]: any
  // ===== 内部使用字段 =====
  // 模块注册
  __modules?: {
    [key: string]: {
      moduleClass: ClassType<IModule>
      args: any[]
    }
  }
}

// 模块基础接口
export interface IModule {
  moduleReady: boolean
  init(...args: any[])
}

// ===== react =====
export declare type IReactComponent<P = any> = React.ClassicComponentClass<P> | React.ComponentClass<P> | React.FunctionComponent<P> | React.ForwardRefExoticComponent<P>;

// ===== others =====
export interface IPageWrapperOptions {
  deps?: string[],
  success?: <T extends IBasePage>(biz: T) => void
  fail?: <T extends IBasePage>(biz: T, error: any) => void
  owlConfig?: Record<string, any>
}

