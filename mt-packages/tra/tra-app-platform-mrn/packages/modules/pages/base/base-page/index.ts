import IcreateToolBox, { Env } from '@nibfe/multi-platform-env/types/mrn'
import { RRCLoading } from 'react-native-overlayer'

interface BasePage {
  $toast: any
  $dialog: any
  pageLoading: boolean
  pageReady: boolean
  owl: any
}

class BasePage {
  envInfo: Env = {} as Env
  tools!: ReturnType<typeof IcreateToolBox>

  lxInfo?: Record<string, string>

  // 对应bundle的owl配置
  owlConfig?: any

  beforeInit() {}
  pageInit() {}
  afterInit() {}
  pageDestory() {}

  constructor() {
    this.pageReady = false
    this.pageLoading = true
  }

  /**
   * 完成页面加载，这里因为使用了最佳实践的MCPage，页面第一次加载时需要把pageReady绑定在MCPage上
   */
  finishPage() {
    this.pageReady = true
  }

  /**
   * 打开页面加载 Loading
   */
  turnOnPageLoading() {
    // this.pageLoading = true
    RRCLoading.show()
  }

  /**
   * 关闭页面加载 Loading
   */
  turnOffPageLoading() {
    // this.pageLoading = false
    RRCLoading.hide()
  }

  togglePageLoading() {
    RRCLoading.show()
  }

  /**
   * 页面pageView打点
   */
  pageViewLx() {}
}

export default BasePage