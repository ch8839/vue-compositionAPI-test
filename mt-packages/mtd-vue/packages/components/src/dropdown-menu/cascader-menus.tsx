import {
  defineComponent,
  computed,
  ref, classNames, styles,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import MtdCascaderPanel from '@components/cascader-panel'
import { Node } from '@components/cascader/types'
import useDropdownProvide from '@components/dropdown/useProvide'

export default defineComponent({
  name: 'MtdCascaderMenus',
  components: {
    MtdCascaderPanel,
  },
  inheritAttrs: false,
  props: {
    data: Array,
    trigger: {
      type: String, // hover / click
      default: 'hover',
    },
  },
  emits: [
    'select',
  ],
  setup(props, { emit }) {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('cascader-menu'))

    const expandedValue = ref<any[]>([])
    const { injectDropdown } = useDropdownProvide()
    const dropdown = injectDropdown()

    function handleExpandedChange(values: any[], nodes: Node[]) {
      expandedValue.value = values
      emit('expanded-change', values, nodes)
    }

    function handleSelect(values: any[], nodes: Node[]) {
      emit('select', values, nodes)
      dropdown && dropdown.emitter.emit('itemClick')
    }
    return {
      prefix, expandedValue,
      handleExpandedChange, handleSelect,
    }
  },
  render() {
    const { trigger, expandedValue, data } = this
    return <mtd-cascader-panel
      class={classNames(this)}
      style={styles(this)}
      options={data}
      expanded-value={expandedValue}
      expand-trigger={trigger}
      onExpanded-change={this.handleExpandedChange}
      onSelect={this.handleSelect}
    />
  },
})
