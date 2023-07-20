import {
  defineComponent,
  computed,
  getSlotsInRender, classNames, styles,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import MtdCascaderMenus from './cascader-menus'
import { Node } from '@components/cascader/types'


export default defineComponent({
  name: 'MtdDropdownMenu',
  components: {
    MtdCascaderMenus,
  },
  inheritAttrs: false,
  props: {
    size: {
      type: String,
      required: false,
    },
    model: {
      type: String,
      default: 'normal',
    },
    data: Array,
    expandTrigger: String,
    value: [String, Number, Object],
  },
  emits: [
    'select',
  ],
  setup(props, { emit }) {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('dropdown-menu'))

    function handleSelect(values: any[], nodes: Node[]) {
      emit('select', values, nodes)
    }

    return {
      prefix, handleSelect,
    }
  },
  render() {
    const { prefix, size, model, data, expandTrigger } = this
    const renderFun = () => {
      switch (model) {
        case 'cascader':
          return <mtd-cascader-menus
            class={classNames(this, `${prefix}-cascader`)}
            style={styles(this)}
            data={data}
            trigger={expandTrigger}
            onSelect={this.handleSelect}
          />
        default:
          return <ul
            class={classNames(this, {
              [prefix]: true,
              [`${prefix}-${size}`]: size,
            })}
            style={styles(this)}
          >
            {getSlotsInRender(this)}
          </ul>
      }
    }

    return renderFun()
  },
})
