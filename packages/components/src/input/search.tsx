import {
  computed,
  defineComponent,
  ref,
  useResetAttrs,
  vSlots, classNames, styles, useClassStyle,
} from '@ss/mtd-adapter'
import MtdInput from '@components/input'
import MtdButton from '@components/button'
import useConfig from '@hooks/config'
import Icon from '@components/icon'

export default defineComponent({
  name: 'MtdInputSearch',
  components: {
    MtdInput,
    MtdButton,
    MtdIcon: Icon,
  },
  inheritAttrs: false,
  model: {
    prop: 'modelValue',
    event: 'update:modelValue',
  },
  props: {
    loading: Boolean,
    enterButton: Boolean,
    modelValue: [String, Number],
  },
  emits: ['input', 'update:modelValue', 'search'],
  setup(props, { attrs, emit }) {
    const config = useConfig()

    const prefix = computed(() => {
      return config.getPrefixCls('input-search')
    })
    const resetAttrs = useResetAttrs(attrs)
    const classStyle = useClassStyle()

    const getIconCls = config.getIconCls

    const inputRef = ref<typeof MtdInput | null>(null)
    const buttonIcon = computed(() => {
      return getIconCls(props.loading ? 'loading' : 'search')
    })
    const handleSerach = () => {
      emit('search', props.modelValue)
    }
    const handleInput = (val: string) => {
      emit('input', val)
      emit('update:modelValue', val)
    }
    return {
      prefix,
      resetAttrs,
      inputRef,
      buttonIcon,
      handleSerach,
      handleInput,
      classStyle,
    }
  },
  render() {
    const { prefix, resetAttrs, buttonIcon, enterButton, loading, modelValue } = this

    const slots = {
      suffix: () => !enterButton ? <mtd-icon
        name="search"
        style="cursor:pointer"
        onClick={this.handleSerach}
      /> : undefined,
    }

    return <div
      class={classNames(this, {
        [prefix]: true,
        [`${prefix}-enter-button`]: enterButton,
      })}
      style={styles(this)}
    >
      <mtd-input
        class={[`${prefix}-input`]}
        style={'width:100%'}
        ref="inputRef"
        {...resetAttrs}
        onEnter={this.handleSerach}
        modelValue={modelValue}
        onInput={this.handleInput}
        loading={loading && !enterButton}
        v-slots={slots}
        {...vSlots(slots)}
      />
      {enterButton &&
        <mtd-button
          class={`${prefix}-button`}
          loading={loading}
          type="primary"
          onClick={this.handleSerach}
          icon={buttonIcon}>
        </mtd-button>
      }
    </div>
  },
})
