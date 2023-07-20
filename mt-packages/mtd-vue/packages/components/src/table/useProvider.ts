import { Emitter } from '@utils/mitt'
import { Ref, ref, provide, inject } from '@ss/mtd-adapter'
import { ITable } from './types'

export const tableSymbol = Symbol('table')

export const useProvider = () => {

  function provideTable(ins: ITable) {
    provide<ITable>(tableSymbol, ins)
  }

  function injectTable() {
    return inject<ITable | null>(tableSymbol, null)
  }

  return {
    provideTable,
    injectTable,
  }
}

export default useProvider