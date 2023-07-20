import {
  defineComponent,
  PropType,
  ref,
  getScopedSlotsInRender,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import MtdCheckbox from '@components/checkbox'
import { Node } from '@components/cascader/types'
import { useCascaderPanel } from '@components/cascader/hook'
import MtdIcon from '@components/icon'

export default defineComponent({
  name: 'CascaderMenuItem',
  components: {
    MtdCheckbox,
    MtdIcon,
  },
  inheritAttrs: true,
  props: {
    node: {
      type: Object as PropType<Node>,
      required: true,
    },
    value: [String, Number, Object, Array],
    filtered: Boolean,
  },
  emits: ['expand', 'click', 'checked', 'select'],
  setup() {
    const config = useConfig()
    const prefix = config.getPrefixCls('cascader-menu-item')
    const hover = ref(false)
    const menus = useCascaderPanel()
    return {
      prefix, hover, menus,
    }
  },
  computed: {
    selected(): boolean {
      if (this.menus.multiple) {
        return false
      }
      return this.node.value === this.value && this.value !== undefined
    },
    showCheckbox(): boolean {
      return this.menus.showCheckbox
    },
    changeOnSelect(): boolean {
      return this.menus.changeOnSelect
    },
  },
  methods: {
    setExpanded() {
      if (this.node.disabled || !this.node.hasChildren) {
        return
      }
      this.$emit('expand', this.node)
    },

    handleClick() {
      if (this.node.disabled) {
        return
      }
      /**
       * 1. 过滤时点整行选中，非过滤时如果有 checkbox 只能点击 checkbox 选中
       * 2. 如果当前是叶子节点，点击则表示选中
       * 3. 多选时选中逻辑不走此方法逻辑
       */

      if (this.filtered) {
        if (this.showCheckbox) {
          this.handleChecked(true)
        } else {
          this.$emit('select', this.node, { selected: !this.selected })
        }
      } else if (
        this.menus.expandTrigger === 'click' &&
        this.node.hasChildren
      ) {
        this.setExpanded()
      } else if (!this.showCheckbox && !this.node.hasChildren) {
        this.$emit('select', this.node, { selected: !this.selected })
      }
      if (this.changeOnSelect && this.node.hasChildren) {
        this.$emit('click', this.node, { selected: !this.selected })
      }
    },
    // eslint-disable-next-line
    handleChecked(checked: boolean) {
      if (this.node.disabled) {
        return
      }
      this.$emit('checked', this.node, { checked: !this.node.checked })
      if (!this.filtered && this.showCheckbox) {
        this.handleClick()
      }
    },

    handleMouseEnter() {
      if (this.menus.expandTrigger === 'hover') {
        this.setExpanded()
      }
    },
  },
  render() {
    const { prefix, node, selected, showCheckbox } = this
    const $render = getScopedSlotsInRender(this)

    return <li
      class={{
        [prefix]: true,
        [`${prefix}-active`]: selected,
        [`${prefix}-checked`]: node.checked,
        [`${prefix}-disabled`]: node.disabled,
        hover: node.hover,
      }}
      onClick={this.handleClick}
      onMouseenter={this.handleMouseEnter}
    >
      {showCheckbox && <mtd-checkbox
        class={`${prefix}-checkbox`}
        value={node.checked}
        disabled={node.disabled}
        indeterminate={node.indeterminate}
        onClick={(e: Event) => e.stopPropagation()}
        onChange={this.handleChecked}
      />}
      {$render && $render({
        node: node,
        data: node.data,
      })}
      {node.hasChildren && <span class={`${prefix}-expand-icon`}>
        <MtdIcon name={node.loading ? 'loading' : 'right'} />
      </span>}
    </li>

  },
})