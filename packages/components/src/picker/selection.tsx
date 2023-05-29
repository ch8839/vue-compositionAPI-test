import MtdIcon from '@components/icon'
import MtdButton from '@components/button'
import { computed, ref, defineComponent, vSlots, getScopedSlotsInRender, getAllScopedSlots } from '@ss/mtd-adapter'
import RenderedResult from './rendered'

export default defineComponent({
  name: 'MtdPickerSelection',
  components: {
    MtdIcon,
    MtdButton,
    RenderedResult,
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
  emits: ['click', 'clear'],
  setup(props) {
    const hovering = ref(false)
    const hoveringIcon = ref(false)
    const showClear = computed(() => {
      return props.clearable && props.hasSelected && (hoveringIcon.value || props.focused)
    })

    return {
      hovering, showClear, hoveringIcon,
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
  render() {
    const {
      prefix, value, placeholder,
      hasSelected, icon, type,
      showClear, disabled, size,
    } = this
    const renderIcon = getScopedSlotsInRender(this, 'icon')
    const scopedSlots = getAllScopedSlots(this)

    const Comp: any = type === 'button' ? MtdButton : 'div'

    return <Comp
      type="text"
      onClick={this.handleClick}
      size={size}
      onMouseenter={this.enter}
      onMouseleave={this.leave}
      class={`${prefix}-selection`}
      style={'display:inline-flex'}
    >
      <RenderedResult
        prefix={prefix}
        placeholder={placeholder}
        hasSelected={hasSelected}
        value={value}
        {...vSlots(scopedSlots)}
        v-slots={scopedSlots}
      />
      {<span
        class={`${prefix}-icon`}
        onMouseenter={this.enterIcon}
        onMouseleave={this.leaveIcon}
      >
        {!disabled && showClear
          ? <mtd-icon
            class={`${prefix}-clear`}
            name="error-circle"
            onClick={this.clear}
          />
          : ((renderIcon && renderIcon()) || <MtdIcon name={icon} />)}
      </span>}
    </Comp>
  },
})
