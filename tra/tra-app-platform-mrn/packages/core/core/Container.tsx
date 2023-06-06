import React, { createContext, useContext, useEffect } from 'react'
import { mobserver, generateCore } from './internals'
import { execFuncList, coreError, printer, CONSOLE_TYPE } from '../utils'
import { owl } from '@mrn/mrn-owl'

// interfaces
import { ClassType, IBasePage, IReactComponent, IPageWrapperOptions } from '../interfaces/index'

const CoreContext = createContext({} as IBasePage)

// page访问core
export function useCoreContext() {
  return useContext(CoreContext)
}

export const Bootstrap = <T extends IBasePage>(
  Page: IReactComponent,
  Business: ClassType<T>,
  options: IPageWrapperOptions = {}
): React.FunctionComponent => {

  const CoreContainer = mobserver(function(props: any) {
    if (!Business) {
      coreError('请传入可用业务模型')
    }
    const { deps = [], fail, success, owlConfig={} } = options
     
    const core = generateCore(Business)
    try {
      owl.start({
        devMode: process.env.NODE_ENV !== 'production', // true 为开发模式，上报到 Raptor 测试环境中， false 上报到线上
        debug: false,
        autoCatch: { // 自动捕获
          error: false // 自动捕获 JS 异常并上报，自动捕获之后，Native 侧不会再感知到异常，也不会展示错误页面。 建议不开启
        },
        onErrorPush:function(error){ // 异常上报前的回调，可以做异常的过滤限流等功能。
          console.log('onErrorPush')
          return error
        },
        jsError: { // 0.0.5+ 版本，支持上报 JS异常时上报自定义字段
          customData: {
            appKey: "tra_app_platform_mrn" // DD 中 App 项目代号，用来反解使用，必填，例：http://dd.sankuai.com/apps/android/group/setting
          } // key value 格式
        },
        component: owlConfig?.component, // 当前所处的组件
        project: owlConfig?.project //  必填，Bundle 名称
      })
      core.owl = owl
    } catch(err) {
      core.owl = {}
      console.log("owl初始化失败: ", err)
    }
  
    function accessKey(key) {
      const keyArr = key ? key.split('.') : []
      let curObj = core
      for (let key of keyArr) {
        curObj = curObj[key]
      }
      return curObj
    }
    
    // 页面初始化
    useEffect(() => {
      // 在第一次进入时执行生命周期
      const runLifeCycle = async () => {
        printer(CONSOLE_TYPE.INFO, 'runLifeCycle')
        try {
          await core.beforeInit(props)
          await core.pageInit(props)
        } catch (e: any) {
          core.pageLoading = false
          core.pageReady = false
          execFuncList(fail, e, core)
          return
        }
        core.pageReady = true
        core.pageLoading = false
        core.afterInit(props)
        execFuncList(success, core)
      }
      runLifeCycle()
    }, deps.map(accessKey)) // 如果deps内的数据有变化，页面会重新执行完整生命周期

    return (
      <CoreContext.Provider value={core}>
        <Page {...props} />
      </CoreContext.Provider>
    )
  })
  return CoreContainer
}
