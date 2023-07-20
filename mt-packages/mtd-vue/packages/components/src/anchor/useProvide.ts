import { Emitter } from '@utils/mitt'
import { provide, inject } from '@ss/mtd-adapter'

export const anchorSymbol = Symbol('anchor')

export type AnchorProvider = {
  currentLink: string
  scrollOffset: number
  emitter: Emitter
}

export const useProvider = () => {

  function provideAnchor(ins: AnchorProvider) {
    provide<AnchorProvider>(anchorSymbol, ins)
  }

  function injectAnchor() {
    return inject<AnchorProvider | null>(anchorSymbol, null)
  }

  return {
    provideAnchor,
    injectAnchor,
  }
}

export default useProvider
