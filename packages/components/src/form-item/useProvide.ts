import { FormItemProvider } from './types'
import { provide, inject } from '@ss/mtd-adapter'

export const formItemSymbol = 'mtui-vue/form-item'

export const useProvider = () => {

  function provideFormItem(ins: FormItemProvider) {
    provide<FormItemProvider>(formItemSymbol, ins)
  }

  function injectFormItem() {
    return inject<FormItemProvider | null>(formItemSymbol, null)
  }

  return {
    provideFormItem,
    injectFormItem,
  }
}

export default useProvider
