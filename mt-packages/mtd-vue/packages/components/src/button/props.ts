import { MTDUIComponentSize } from '@components/types'
import { ExtractPropTypes, PropType } from '@ss/mtd-adapter'

export type ButtonHtmlType = 'button' | 'submit' | 'reset';
export const ButtonType = ['default', 'primary', 'success', 'warning', 'danger']
export const ButtonSize = ['large', 'normal', 'small', 'mini']

// 用于组件开发或者二次封装
export const buttonProps = () => ({
  href: String,
  to: [String, Object],
  ghost: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String as PropType<MTDUIComponentSize>,
  },
  htmlType: {
    type: String as PropType<ButtonHtmlType>,
    default: 'button',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: String,
  },
  type: {
    type: String,
  },
  dashed: {
    type: Boolean,
    default: false,
  },
  circle: {
    type: Boolean,
    default: false,
  },
  round: {
    type: Boolean,
    default: false,
  },
})

// 用于业务的使用
export type ButtonProps = Partial<ExtractPropTypes<ReturnType<typeof buttonProps>>>

export default buttonProps