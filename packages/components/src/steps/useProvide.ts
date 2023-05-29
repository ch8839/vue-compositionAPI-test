import { provide, inject, Ref, ComponentPublicInstance } from '@ss/mtd-adapter'
import { StepsProvider } from './types'
import { IStep } from '@components/step/types'

export const stepsSymbol ='mtui-vue/steps'
export const stepListSymbol = 'mtui-vue/stepList'

export const useProvider = () => {

  function provideSteps(ins: StepsProvider) {
    provide<StepsProvider>(stepsSymbol, ins)
  }
  function injectSteps() {
    return inject<StepsProvider>(stepsSymbol)
  }

  function provideStepList(stepList: Ref<IStep[]>) {
    provide<Ref<IStep[]>>(stepListSymbol, stepList)
  }
  function injectStepList() {
    return inject<Ref<IStep[]> | null>(stepListSymbol, null)
  }


  return {
    provideSteps,
    provideStepList,
    injectSteps,
    injectStepList,
  }
}

export default useProvider