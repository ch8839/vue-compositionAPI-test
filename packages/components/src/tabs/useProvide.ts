import { ITabs } from './types'
import { provide, inject } from '@ss/mtd-adapter'
export const key = 'tabs'

export const useProvider = () => {

  function provideTab(provideIns: ITabs) {
    provide<ITabs>(key, provideIns)
  }

  function injectTabs() {
    return inject<ITabs | null>(key, null)
  }

  return {
    provideTab,
    injectTabs,
  }
}

export default useProvider
