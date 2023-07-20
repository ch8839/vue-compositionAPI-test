import { ExtractPropTypes } from '@ss/mtd-adapter'

export const checkboxProps = () => ({
  value: [String, Number, Boolean, Function, Object],
  modelValue: [String, Number, Boolean, Function, Object],
  trueValue: {
    type: [String, Number, Boolean, Function, Object],
    default: true,
  },
  falseValue: {
    type: [String, Number, Boolean, Function, Object],
    default: false,
  },

  size: String,
  disabled: Boolean,
  name: String,
  indeterminate: Boolean,
  label: [String, Number],
  isUnderControl: {
    type: Boolean,
    default: true,
  }, // 该属性的作用是区分开来是否用于checkboxGroup管理，不对外暴露
})

export type CheckboxProps = Partial<ExtractPropTypes<ReturnType<typeof checkboxProps>>>

export default checkboxProps