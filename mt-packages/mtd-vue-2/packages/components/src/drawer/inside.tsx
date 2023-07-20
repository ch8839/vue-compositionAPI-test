import {
  defineComponent,
  PropType,
  computed,
  getSlotsInRender,
} from '@ss/mtd-adapter'
import { DrawerPlacement } from './types'
import { isNumber } from '@utils/type'
import useConfig from '@hooks/config'
import MtdIcon from '@components/icon'
export default defineComponent({
  name: 'DrawerInside',
  components: {
    MtdIcon,
  },
  inheritAttrs: true,
  props: {
    title: String,
    width: {
      type: [Number, String],
      default: 400,
    },
    height: {
      type: [Number, String],
      default: 400,
    },
    closable: {
      type: Boolean,
      default: true,
    },
    placement: {
      type: String as PropType<DrawerPlacement>,
      default: 'right',
    },
    zIndex: {
      type: [Number, String],
      required: true,
    },
  },
  emits: ['close'],
  setup(props, { emit }) {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('drawer'))

    const isVertical = computed(
      () => ['left', 'right'].indexOf(props.placement) > -1,
    )
    const drawerStyle = computed(() => {
      const style: Record<string, string | number> = {
        zIndex: props.zIndex,
      }
      if (isVertical.value) {
        style.width = isNumber(props.width) ? `${props.width}px` : props.width
      } else {
        style.height = isNumber(props.height)
          ? `${props.height}px`
          : props.height
      }
      return style
    })
    const handleClickClose = () => emit('close')

    return {
      prefix,
      isVertical,
      drawerStyle,
      handleClickClose,
    }
  },
  render() {
    const {
      prefix, placement, drawerStyle, closable, title,
    } = this
    return <div
      class={{
        [prefix]: true,
        [`${prefix}-${placement}`]: true,
      }}
      style={drawerStyle}
    >
      <div class={`${prefix}-header-wrapper`}>
        {(title || getSlotsInRender(this, 'title')) && <div class={`${prefix}-header`}>
          {getSlotsInRender(this, 'title') || title}
        </div>}
        {closable && <div class={`${prefix}-close`} onClick={this.handleClickClose}>
          <mtd-icon name={'close'} />
        </div>}
      </div>
      <div class={`${prefix}-content`}>
        {getSlotsInRender(this)}
      </div>
      <div class={`${prefix}-footer`}>
        {getSlotsInRender(this, 'footer')}
      </div>
    </div >
  },
})
