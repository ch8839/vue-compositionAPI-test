import {
  Ref,
} from '@ss/mtd-adapter'
export interface StepsProvider {
  active: number
  status: string
  space: number | string
  direction: string
  dot: boolean
  stepList: Step[]
  type: StepType

  updateActive: (v: number) => void
}

export type StepListProvider = Ref<Step[]>

export type StepType = 'center' | 'right' | 'navigation'

export interface Step {
  index: number
  _status: string

  setIndex: (n: number) => void
}