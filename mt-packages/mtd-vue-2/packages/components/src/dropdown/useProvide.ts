import { DropdownProvider } from './types'
import { provide, inject } from '@ss/mtd-adapter'

export const dropdownSymbol = 'mtui-vue/dropdown'

export const useProvider = () => {

  function provideDropdown(provideIns: DropdownProvider) {
    provide<DropdownProvider>(dropdownSymbol, provideIns)
  }

  function injectDropdown() {
    return inject<DropdownProvider | null>(dropdownSymbol, null)
  }

  return {
    provideDropdown,
    injectDropdown,
  }
}

export default useProvider
