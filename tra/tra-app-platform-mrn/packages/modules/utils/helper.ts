export function numberToWeekDayText(num) {
    const map = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    return map[num]
}
export function numberToTwoDigitNumberText(num) {
    if(num < 10) return `0${num}`
    return `${num}`
}
export function getOwlStartConfig(params) {
    const project = params?.project
    const component = params?.component
    return {
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
        component: component, // 当前所处的组件
        project: project //  必填，Bundle 名称
    }
}
