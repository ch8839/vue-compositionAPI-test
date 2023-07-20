import TeleportMain from './teleport-main'
import { defineComponent, PropType } from '@ss/mtd-adapter'

export default defineComponent({
  name: 'MtdTeleport',
  inheritAttrs: false,
  props: {
    to: {
      type: [Object, String] as PropType<HTMLElement | string | HTMLBodyElement>,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  render(h) { // 🤡写明原因
    const { to, disabled } = this.$props
    const hasContent = this.$slots.default
    const teleportNotes = h('', {})
    teleportNotes.text = 'teleport content'
    return (hasContent
      ? <TeleportMain
        to={to}
        disabled={disabled}
      >
        {this.$slots.default}
      </TeleportMain>
      : teleportNotes)
  },
})
