import { useConfig } from '@components/config-provider'
import {
  computed,
  defineComponent,
  classNames, styles,
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
  setup(props) {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('select'))
    const _size = computed(() => {
      return props.size === 'small' ? 'small' : 'large'
    })
    return {
      prefix, _size,
    }
  },
  methods: {
    handleClose() {
      this.$emit('close', this.option)
    },
    renderOption(scope: any) {
      const {
        closable, disabled,
        onClose,
      } = scope
      const { theme, _size } = this
      const _closable = isFunction(closable) ? closable(this.option) : closable

      return <mtd-tag size={_size} theme={theme} type="pure"
        closable={!disabled && _closable} disabled={disabled}
        onClose={onClose}>
        {this.$slots.default}
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
