import { Emitter } from '@utils/mitt'
import { provide, inject, ComponentPublicInstance } from '@ss/mtd-adapter'
import { IAnchor } from './types'

export const anchorSymbol = 'mtui-vue/anchor'

export type AnchorProvider = {
  currentLink: string
  scrollOffset: number
  emitter: Emitter
}

export const useProvider = () => {

  function provideAnchor(ins: ComponentPublicInstance) {
    provide<ComponentPublicInstance>(anchorSymbol, ins)
  }

  function injectAnchor() {
    return inject<IAnchor | null>(anchorSymbol, null)
  }

  return {
    provideAnchor,
    injectAnchor,
  }
}

export default useProvider
