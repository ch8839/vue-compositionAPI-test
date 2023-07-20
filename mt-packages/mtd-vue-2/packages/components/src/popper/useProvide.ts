import { PopperInstance } from './types'
import { provide, inject } from '@ss/mtd-adapter'
export const key = 'popper'

export const useProvider = () => {

  function providePopper(provideIns: PopperInstance) {
    provide<PopperInstance>(key, provideIns)
  }

  function injectPopper() {
    return inject<PopperInstance | null>(key, null)
  }

  return {
    providePopper,
    injectPopper,
  }
}

export default useProvider
