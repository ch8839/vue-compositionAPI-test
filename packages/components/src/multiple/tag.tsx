import { useConfig } from '@components/config-provider'
import {
  computed,
  defineComponent,
  classNames, styles,
  getSlotsInRender,
} from '@ss/mtd-adapter'

import MtdTag from '@components/tag'

function isFunction(v: any) {
  return typeof v === 'function'
}

export default defineComponent({
  name: 'MtdSelectTag',
  components: {
    MtdTag,
  },
  inheritAttrs: false,
  props: {
    theme: String,
    size: String,
    option: Object,
    closable: [Boolean, Function],
    disabled: Boolean,
    renderTag: Function,
  },
  emits: ['close'],
  setup(props, { emit }) {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('select'))
    const m_size = computed(() => {
      return props.size
    })

    function handleClose() {
      emit('close', props.option)
    }
    return {
      prefix, m_size, handleClose,
    }
  },
  methods: {
    renderOption(scope: any) {
      const {
        closable, disabled,
        onClose,
      } = scope
      const { theme, m_size } = this
      const m_closable = isFunction(closable) ? closable(this.option) : closable

      return <mtd-tag
        size={m_size}
        theme={theme as any}
        type="pure"
        closable={!disabled && m_closable}
        disabled={disabled}
        onClose={onClose}
      >
        {getSlotsInRender(this)}
      </mtd-tag>
    },
  },
  render() {
    const {
      prefix, renderTag, option,
      size, closable, disabled,
    } = this

    const scope = {
      option, size,
      closable,
      disabled,
      onClose: this.handleClose,
    }

    const render = renderTag || this.renderOption
    return <div
      class={classNames(this, `${prefix}-choice`)}
      style={styles(this)}
    >
      {render(scope)}
    </div>
  },
})
