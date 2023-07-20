import { MTDUIComponentSize } from '@components/types'
import { ExtractPropTypes, PropType } from '@ss/mtd-adapter'
import { InputGenre, InputStatus } from './types'

export const inputProps = () => ({
  type: {
    type: String,
    default: 'text',
  },
  genre: {
    type: String as PropType<InputGenre>,
    default: '',
  },
  size: {
    type: String as PropType<MTDUIComponentSize>,
    default: '',
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  modelValue: [String, Number],
  prefixIcon: String,
  suffixIcon: String,
  loading: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  noReadonlyClass: {
    type: Boolean,
    default: false,
  },
  clearableOnReadonly: { // 当 readonly 时是否可以清空，仅作用于内部模拟 input
    type: Boolean,
    default: false,
  },
  maxLength: Number,
  showCount: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String as PropType<InputStatus>,
  },
  hasFeedback: Boolean,
})

export type InputProps = Partial<ExtractPropTypes<ReturnType<typeof inputProps>>>

export default inputProps