import { ExtractPropTypes } from '@ss/mtd-adapter'

export const radioGroupProps = () => ({
  modelValue: {
    type: [String, Number, Boolean, Function, Object, Array],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  name: String,
  size: {
    type: String,
    default: 'normal',
  },
  label: [String, Number],
})

export type RadioGroupProps = Partial<ExtractPropTypes<ReturnType<typeof radioGroupProps>>>

export default radioGroupProps