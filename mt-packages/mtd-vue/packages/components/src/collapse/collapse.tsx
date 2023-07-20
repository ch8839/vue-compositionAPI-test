import {
  computed,
  defineComponent,
  PropType,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import { CollapseType } from './types'
import { isArray } from '@utils/type'
import mitt from '@utils/mitt'
import { provideCollapse } from './useCollapse'

export default defineComponent({
  name: 'MtdCollapse',
  inheritAttrs: true,
  model: {
    prop: 'modelValue',
    event: 'update:modelValue',
  },
  props: {
    modelValue: [String, Number, Boolean, Object, Array],
    type: {
      type: String as PropType<CollapseType>,
      default: '',
    },
    rightAlignArrow: Boolean,
    triangleArrow: Boolean,
  },
  emits: ['input', 'change'],
  setup(props, { emit }) {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('collapse'))
    const emitter = mitt()
    const value = computed(() => props.modelValue)
    const rightAlignArrow = computed(() => props.rightAlignArrow)
    const triangleArrow = computed(() => props.triangleArrow)
    provideCollapse({
      value,
      rightAlignArrow,
      triangleArrow,
      emitter,
    })

    // @Created
    emitter.on('itemClick', ([active, value]) => {
      let nextValue
      if (isArray(props.modelValue)) {
        nextValue = active
          ? [...props.modelValue, value]
          : props.modelValue.filter((v: string) => v !== value)
      } else {
        nextValue = active ? value : ''
      }
      emit('input', nextValue)
      emit('update:modelValue', nextValue)
      emit('change', nextValue)
    })
    return {
      prefix,
      emitter,
    }
  },
  render() {
    const {
      prefix, type,
    } = this
    return <div
      class={{
        [prefix]: true,
        [`${prefix}-${type}`]: type,
      }}
    >
      {this.$slots.default}
    </div>
  },
})
