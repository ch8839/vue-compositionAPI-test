import {
  computed,
  defineComponent,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import MtdCollapseTransition from '@components/transitions/collapse-transition'
import MtdLoading from '@components/loading'
import MtdIcon from '@components/icon'
import { useCollapse } from '@components/collapse/useCollapse'

export default defineComponent({
  name: 'MtdCollapseItem',
  components: {
    MtdCollapseTransition,
    MtdLoading,
    MtdIcon,
  },
  inheritAttrs: true,
  props: {
    title: String,
    value: [String, Number, Object, Array, Symbol],
    disabled: Boolean,
    loading: Boolean,
  },
  emits: [],
  setup(props) {
    const config = useConfig()
    const prefixCollapse = computed(() => config.getPrefixCls('collapse'))
    const prefix = computed(() => config.getPrefixCls('collapse-item'))

    const { active, rightAlignArrow, triangleArrow, emitItemClick } = useCollapse(props)
    const arrowDirection = computed(() => rightAlignArrow.value ? 'left' : 'right')
    const iconStyle = computed(() => {
      const style: any = {}
      style[rightAlignArrow.value ? 'right' : 'left'] = 0
      return style
    })
    const handleClick = () => {
      if (props.disabled) return
      emitItemClick()
    }

    return {
      prefix, prefixCollapse, active, arrowDirection, triangleArrow, iconStyle,
      handleClick,
    }
  },

  render() {
    const {
      prefix, prefixCollapse, active, disabled, title, arrowDirection, triangleArrow, iconStyle, loading,
    } = this
    return <div
      class={{
        [prefix]: true,
        [`${prefix}-active`]: active,
        [`${prefix}-collapse`]: !active,
        [`${prefix}-disabled`]: disabled,
      }}
    >

      <div class={`${prefix}-header ${prefix}-header-${arrowDirection}`} onClick={this.handleClick}>
        <mtd-icon
          name={triangleArrow ? `triangle-${arrowDirection}` : `${arrowDirection}-thick`}
          class={[`${prefixCollapse}-arrow`, `${prefixCollapse}-arrow-${arrowDirection}`]}
          style={iconStyle}
        />
        {this.$slots.title || title}
      </div>

      <mtd-collapse-transition>
        <div v-show={active} class={`${prefix}-wrapper`}>
          {!loading
            ? <div class={`${prefix}-content`}>
              {this.$slots.default}
            </div>
            : <div class={`${prefix}-loading`}>
              <mtd-loading />
            </div>
          }
        </div>
      </mtd-collapse-transition>

    </div >
  },
})
