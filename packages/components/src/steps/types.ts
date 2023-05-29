import Steps from './index'
import { CPI } from '@components/types/component'


export type ISteps = InstanceType<typeof Steps>

export interface StepsProvider extends CPI {
  active: number
  status: string
  space: number | string
  direction: string
  dot: boolean
  stepList: any[]
  type: StepType

  updateActive: (v: number) => void
}

export type StepType = 'center' | 'right' | 'navigation'

