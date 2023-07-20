import { ITabsIns } from './types'
import { provide, inject } from '@ss/mtd-adapter'
export const key = 'tabs'

export const useProvider = () => {

  function provideTab(provideIns: ITabsIns) {
    provide<ITabsIns>(key, provideIns)
  }

  function injectTabs() {
    return inject<ITabsIns | null>(key, null)
  }

  return {
    provideTab,
    injectTabs,
  }
}

export default useProvider
