import { Emitter } from '@utils/mitt'
import { FormRule } from '../form-item/types'

export interface FormProvider {
  showMessage?: boolean
  model: any
  rules?: any
  inline?: boolean
  labelWidth?: number
  labelPosition?: 'top' | 'right'
  firstFields?: boolean | string[]

  emitter: Emitter
}