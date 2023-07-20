import { FormProvider } from './types'
import { provide, inject } from '@ss/mtd-adapter'

export const formSymbol = Symbol('dropdown')

export const useProvider = () => {

  function provideForm(ins: FormProvider) {
    provide<FormProvider>(formSymbol, ins)
  }

  function injectForm() {
    return inject<FormProvider>(formSymbol) as FormProvider
  }

  return {
    provideForm,
    injectForm,
  }
}

export default useProvider
