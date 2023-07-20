import TeleportMain from './teleport-main'
import { defineComponent, PropType, getSlotsInRender, createCommentVNode } from '@ss/mtd-adapter'


export default defineComponent({
  name: 'MtdTeleport',
  inheritAttrs: false,
  props: {
    // eslint-disable-next-line vue/require-prop-types
    to: {
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  render() {
    const { to, disabled } = this
    const hasContent = getSlotsInRender(this)
    const teleportNotes = createCommentVNode('teleport content')
    return (hasContent
      ? <TeleportMain
        to={to}
        disabled={disabled}
      >
        {getSlotsInRender(this)}
      </TeleportMain>
      : teleportNotes)
  },
})
