import { Emitter } from '@utils/mitt'
import { FormRule } from '../form-item/types'

export interface FormProvider {
  disabled: any
  showMessage?: boolean
  model: any
  rules?: any
  inline?: boolean
  labelWidth?: number
  labelSuffix?: string
  labelPosition?: 'top' | 'right'
  firstFields?: boolean | string[]

  emitter: Emitter
  contentDisplay: string
}