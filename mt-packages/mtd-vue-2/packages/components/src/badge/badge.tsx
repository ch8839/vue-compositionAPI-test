import { defineComponent, computed, PropType, getSlotsInRender } from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import { BadgeStatus } from './types'
import { isNumber } from '@utils/type'

export default defineComponent({
  name: 'MtdBadge',
  inheritAttrs: true,
  props: {
    value: [String, Number],
    dot: { type: Boolean, default: false },
    max: Number,
    hidden: { type: Boolean, default: false },
    status: String as PropType<BadgeStatus>,
  },
  setup(props) {
    const text = computed(() => {
      if (props.dot) return
      if (isNumber(props.value) && isNumber(props.max)) {
        return props.max < props.value ? `${props.max}+` : props.value
      }
      return props.value
    })
    const rounded = computed(() => String(text.value).length === 1)
    const config = useConfig()
    const prefix = config.getPrefixCls('badge')
    return {
      prefix,
      text,
      rounded,
    }
  },
  render() {
    const { text, rounded, prefix } = this
    const { hidden, dot, status } = this.$props
    return (
      <div class={prefix}>
        {getSlotsInRender(this)}
        {(text || text === 0 || dot) && (
          <span
            class={[
              `${prefix}-text`,
              {
                [`${prefix}-position`]: !!getSlotsInRender(this),
                [`${prefix}-dot`]: dot,
                [`${prefix}-hidden`]: hidden,
                [`${prefix}-rounded`]: rounded,
                [`${prefix}-${status!}`]: status,
              },
            ]}
          >
            {text}
          </span>
        )}
      </div>
    )
  },
})
