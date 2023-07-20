import { provide, inject } from '@ss/mtd-adapter'

export const uploaderSymbol = Symbol('uploader')

type UploaderProvider = {
  accept?: string
}

export const useProvider = () => {

  function provideUploader(ins: UploaderProvider) {
    provide<UploaderProvider>(uploaderSymbol, ins)
  }

  function injectUploader() {
    return inject<UploaderProvider | null>(uploaderSymbol, null)
  }

  return {
    provideUploader,
    injectUploader,
  }
}

export default useProvider
