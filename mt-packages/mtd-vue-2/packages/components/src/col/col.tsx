import { defineComponent, computed, getSlotsInRender } from '@ss/mtd-adapter'
import { useRowContext } from '@components/row'
import useConfig from '@components/hooks/config'
import { isNumber, isObject } from '@utils/type'

export default defineComponent({
  name: 'MtdCol',
  inheritAttrs: true,
  props: {
    span: {
      type: Number,
      default: 24,
    },
    tag: {
      type: String,
      default: 'div',
    },
    offset: Number,
    pull: Number,
    push: Number,
    xs: [Number, Object],
    sm: [Number, Object],
    md: [Number, Object],
    lg: [Number, Object],
    xl: [Number, Object],
    xxl: [Number, Object],
  },
  setup(props) {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('col'))
    const row = useRowContext()
    const gutter = computed(() => (row ? row.gutter : 0))
    const style = computed(() => {
      if (gutter.value) {
        const padding = gutter.value / 2 + 'px'
        return {
          paddingLeft: padding,
          paddingRight: padding,
        }
      }
      return {}
    })
    const classList = computed(() => {
      const classList: string[] = [];
      ['span', 'offset', 'pull', 'push'].forEach((prop: string) => {
        const propValue = (props as any)[prop as any]
        if (propValue || propValue === 0) {
          classList.push(
            prop !== 'span'
              ? `${prefix.value}-${prop}-${propValue}`
              : `${prefix.value}-${propValue}`,
          )
        }
      });
      ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'].forEach((size: string) => {
        const sizeValue: number | object | undefined = (props as any)[size]
        if (isNumber(sizeValue)) {
          classList.push(`${prefix.value}-${size}-${sizeValue}`)
        } else if (isObject(sizeValue)) {
          Object.keys(sizeValue).forEach((prop: string) => {
            const value = (sizeValue as any)[prop]
            classList.push(
              prop !== 'span'
                ? `${prefix.value}-${size}-${prop}-${value}`
                : `${prefix.value}-${size}-${value}`,
            )
          })
        }
      })
      return classList
    })

    return {
      prefix,
      gutter,
      classList,
      style,
    }
  },
  render() {
    const { prefix, tag, classList, style } = this
    const Component = tag as any
    return <Component
      class={[prefix, classList]}
      style={style}
    >
      {getSlotsInRender(this)}
    </Component>
  },
})
