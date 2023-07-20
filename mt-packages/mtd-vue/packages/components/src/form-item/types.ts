import { Emitter } from '@utils/mitt'
import { InputStatus } from '@components/input/types'

export interface FormItemIns extends FormItemProvider {
  validate: (trigger: string, callback: Function) => void
}

export interface FormRule {
  trigger?: 'blur' | 'change'
  enum?: number
  len?: number
  max?: number
  message?: string
  min?: number
  pattern?: RegExp
  required?: boolean
  transform?: Function
  type?: string
  validator?: Function
  whitespace?: boolean
}

export type FormItemStatus = InputStatus | 'validating'

export interface FormItemProvider {
  showMessage: boolean

  form: any
  status?: FormItemStatus
  hasFeedback: boolean
  prop: string

  emitter: Emitter
  isStatusControl: boolean

  resetField: () => void
  clearValidate: () => void

}