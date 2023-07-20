import { StepsProvider, StepListProvider } from './types'
import { provide, inject } from '@ss/mtd-adapter'

export const stepsSymbol = Symbol('steps')
export const stepListSymbol = Symbol('stepList')

export const useProvider = () => {

  function provideSteps(ins: StepsProvider) {
    provide<StepsProvider>(stepsSymbol, ins)
  }
  function injectSteps() {
    return inject<StepsProvider>(stepsSymbol)
  }

  function provideStepList(ins: StepListProvider) {
    provide<StepListProvider>(stepListSymbol, ins)
  }
  function injectStepList() {
    return inject<StepListProvider | null>(stepListSymbol, null)
  }


  return {
    provideSteps,
    provideStepList,
    injectSteps,
    injectStepList,
  }
}

export default useProvider