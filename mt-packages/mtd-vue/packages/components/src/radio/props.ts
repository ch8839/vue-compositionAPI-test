import { ExtractPropTypes } from '@ss/mtd-adapter'

export const radioProps = () => ({
  value: {
    type: [String, Number, Boolean, Function, Object, Array, Symbol],
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

export type RadioProps = Partial<ExtractPropTypes<ReturnType<typeof radioProps>>>

export default radioProps