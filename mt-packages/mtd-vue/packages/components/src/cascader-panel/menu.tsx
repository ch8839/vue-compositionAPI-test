import {
  defineComponent,
  PropType,
  classNames, styles,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import MtdIcon from '@components/icon'
import { Node } from '@components/cascader/types'
import CascaderMenuItem from './menu-item'
import { getListeners, useAttrs, useListeners } from '@components/hooks/pass-through'
export default defineComponent({
  name: 'CascaderMenu',
  components: {
    CascaderMenuItem, MtdIcon,
  },
  inheritAttrs: false,
  props: {
    nodes: {
      type: Array as PropType<Node[]>,
      required: true,
    },
    noDataText: String,
    noMatchText: String,
    filtered: Boolean,
    menuWidth: String,
    value: [String, Number, Object],
  },
  setup(props, { attrs, emit }) {
    const config = useConfig()
    const prefix = config.getPrefixCls('cascader-menu')
    const restAttrs = useAttrs(attrs)
    const listeners = getListeners()
    const restListeners = useListeners(listeners.value)

    const handleExpand = (node: Node) => {
      emit('expand', node)
    }

    return {
      prefix,
      restAttrs,
      restListeners,
      handleExpand,
    }
  },
  computed: {

    isEmpty(): boolean {
      return !this.nodes.length
    },
    selfStyles(): Object {
      if (this.filtered) {
        return {
          'min-width': this.menuWidth,
        }
      }
      return {}
    },
  },
  render() {
    const { prefix, isEmpty, selfStyles, nodes, value, filtered,
      noMatchText, noDataText, restAttrs, restListeners,
    } = this

    const $render = this.$scopedSlots.default

    return <ul
      class={classNames(this, {
        [prefix]: true,
        [`${prefix}-empty'`]: isEmpty,
        [`${prefix}-filtered`]: filtered,
      })}
      style={styles(this, selfStyles)}
    >
      {nodes.map((node: Node, $index: number) => <cascader-menu-item
        key={$index}
        node={node}
        value={value}
        filtered={filtered}
        {...restAttrs}
        {...restListeners}
        scopedSlots={{
          default: (props: {
            node: Node,
            data: any,
          }) => {
            return $render && $render({
              node: props.node,
              data: props.node.data,
            })
          },
        }}
      >
      </cascader-menu-item>)}
      {isEmpty && <li class={`${prefix}-empty-item`}>
        {this.$slots.empty || <span>
          <mtd-icon name={'info-circle'} class={`${prefix}-empty-icon}`} />
          {filtered ? noMatchText : noDataText}
        </span>}
      </li>}
    </ul >
  },
})
