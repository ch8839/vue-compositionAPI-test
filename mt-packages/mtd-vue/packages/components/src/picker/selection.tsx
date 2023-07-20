import { useConfig } from '@components/config-provider'
import MtdIcon from '@components/icon'
import { computed, ref, defineComponent } from '@ss/mtd-adapter'
import RenderedResult from './rendered'

export default defineComponent({
  name: 'MtdPickerSelection',
  components: {
    MtdIcon,
  },
  props: {
    icon: String,
    placeholder: {
      type: String,
      default: '请选择',
    },
    prefix: {
      type: String,
      required: true,
    },
    value: [Object, Array], // any || any[]
    clearable: Boolean,
    focused: Boolean,
    isSelectAll: Boolean,
    hasSelected: Boolean,
    disabled: Boolean,
    type: {
      type: String,
      default: 'button',
    },
    size: String,
  },
  setup(props) {
    const config = useConfig()
    const prefixMTD = computed(() => config.getPrefix())
    const hovering = ref(false)
    const hoveringIcon = ref(false)
    const showClear = computed(() => {
      return props.clearable && props.hasSelected && (hoveringIcon.value || props.focused)
    })

    return {
      hovering, showClear, hoveringIcon, prefixMTD,
    }
  },

  methods: {
    enter() {
      this.hovering = true
    },
    enterIcon() {
      this.hoveringIcon = true
    },
    leave() {
      this.hovering = false
    },
    leaveIcon() {
      this.hoveringIcon = false
    },
    handleClick() {
      if (!this.disabled) {
        this.$emit('click')
      }
    },
    clear(e: Event) {
      if (!this.disabled) {
        e.stopPropagation()
        this.$emit('clear')
      }
    },
    renderSelected() {
      const { value } = this
      return Array.isArray(value) ? value.join(',') : (value as any).toString()
    },
  },
  render(h) {
    const {
      prefix, value, placeholder, prefixMTD,
      hasSelected, icon, type,
      showClear, disabled, size,
    } = this
    const {
      icon: $renderIcon,
    } = this.$scopedSlots

    const Comp = type === 'button' ? `${prefixMTD}-button` : 'div'

    return <Comp
      type="text"
      onClick={this.handleClick}
      size={size}
      onMouseenter={this.enter}
      onMouseleave={this.leave}
      class={`${prefix}-selection`}
      style={'display:inline-flex'}
    >
      {h(RenderedResult, {
        scopedSlots: this.$scopedSlots,
        props: {
          prefix,
          placeholder,
          hasSelected,
          value,
        },
      })}
      {<span
        class={`${prefix}-icon`}
        onMouseenter={this.enterIcon}
        onMouseleave={this.leaveIcon}
      >
        {!disabled && showClear ? <mtd-icon class={`${prefix}-clear`} name="error-circle"
          onClick={this.clear}
        /> : (($renderIcon && $renderIcon({})) || <i class={icon} />)}
      </span>}
    </Comp>
  },
})
