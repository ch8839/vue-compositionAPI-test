import {
  defineComponent,
  PropType,
  computed,
  reactive,
  toRefs,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import MtdButton from '@components/button'
import TransferPanel from '@components/transfer-panel'
import { useAttrs } from '@components/hooks/pass-through'
import MtdIcon from '@components/icon'

export default defineComponent({
  name: 'MtdTransfer',
  components: {
    TransferPanel,
    MtdButton,
    MtdIcon,
  },
  inheritAttrs: true,
  model: {
    prop: 'modelValue',
    event: 'update:modelValue',
  },
  props: {
    data: {
      type: Array as PropType<any[]>,
      default: () => {
        return []
      },
    },
    titles: {
      type: Array as PropType<string[]>,
      default: () => {
        return ['未选', '已选']
      },
    },
    operations: {
      type: Array as PropType<string[]>,
      default: () => {
        return []
      },
    },
    filterPlaceholder: {
      type: String,
      default: '请输入字段名称',
    },
    filterMethod: Function,
    sourceDefaultChecked: {
      type: Array as PropType<any[]>,
      default: () => {
        return []
      },
    },
    targetDefaultChecked: {
      type: Array as PropType<any[]>,
      default: () => {
        return []
      },
    },
    modelValue: {
      type: Array as PropType<any[]>,
      default: () => {
        return []
      },
    },
    filterable: Boolean,
    props: {
      type: Object as PropType<{ [key: string]: string }>,
      default: () => {
        return {
          label: 'label',
          key: 'key',
          disabled: 'disabled',
        }
      },
    },
    targetOrder: {
      type: String,
      default: 'original',
    },
    noMatchText: String,
    noDataText: String,
    pagination: {
      type: Object as PropType<boolean | { pageSize: number }>,
    },
    disableSelectAll: {
      type: String as PropType<'left' | 'right' | 'all'>,
    },
  },
  emits: ['input', 'change', 'select-change'], // 🦋input
  setup(props, { emit }) {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('transfer'))

    const state = reactive({
      leftChecked: [] as any[],
      rightChecked: [] as any[],
    })

    // @Computed
    const dataObj = computed(() => {
      const key = props.props.key
      return props.data.reduce((o, cur) => (o[cur[key]] = cur) && o, {})
    })
    const sourceData = computed(() => {
      return props.data.filter(
        (item) => props.modelValue.indexOf(item[props.props.key]) === -1,
      )
    })
    const targetData = computed(() => {
      if (props.targetOrder === 'original') {
        return props.data.filter(
          (item) => props.modelValue.indexOf(item[props.props.key]) > -1,
        )
      } else {
        return props.modelValue.reduce((arr, cur) => {
          const val = dataObj.value[cur]
          if (val) {
            arr.push(val)
          }
          return arr
        }, [])
      }
    })
    const hasOperations = computed(() => props.operations.length === 2)

    // @Methods
    function onSourceCheckedChange(val: any, movedKeys: any[]) {
      state.leftChecked = val
      if (movedKeys === undefined) return
      emit('select-change', val, 'source')
    }
    function onTargetCheckedChange(val: any, movedKeys: any[]) {
      state.rightChecked = val
      if (movedKeys === undefined) return
      emit('select-change', val, 'target')
    }
    function addToLeft() {
      const currentValue = [...props.modelValue]

      state.rightChecked.forEach((item) => {
        const index = currentValue.indexOf(item)
        if (index > -1) {
          currentValue.splice(index, 1)
        }
      })

      emit('input', currentValue)
      emit('update:modelValue', currentValue)
      emit('change', currentValue, 'source', state.rightChecked)
    }
    function addToRight() {
      let currentValue = props.modelValue.slice()
      const itemsToBeMoved: any[] = []
      const key = props.props.key
      props.data.forEach((item) => {
        const itemKey = item[key]
        if (
          state.leftChecked.indexOf(itemKey) > -1 &&
          !(props.modelValue.indexOf(itemKey) > -1)
        ) {
          itemsToBeMoved.push(itemKey)
        }
      })
      currentValue =
        props.targetOrder === 'unshift'
          ? itemsToBeMoved.concat(currentValue)
          : currentValue.concat(itemsToBeMoved)
      emit('input', currentValue)
      emit('update:modelValue', currentValue)
      emit('change', currentValue, 'target', state.leftChecked)
    }

    const computedCollection = {
      sourceData, targetData, hasOperations,
    }
    const methodsCollection = {
      onSourceCheckedChange, onTargetCheckedChange, addToLeft, addToRight,
    }

    const restProps = useAttrs(props)

    return {
      ...toRefs(state),
      ...computedCollection,
      ...methodsCollection,
      prefix, restProps,
    }
  },
  render() {
    const {
      prefix, filterPlaceholder, operations, sourceData, sourceDefaultChecked, targetData, targetDefaultChecked,
      hasOperations, leftChecked, rightChecked, restProps,
    } = this

    return <div class={prefix}>
      <transfer-panel
        {...restProps}
        panelData={sourceData}
        defaultChecked={sourceDefaultChecked}
        placeholder={filterPlaceholder}
        ref="leftPanel"
        direction="left"
        onChecked-change={this.onSourceCheckedChange}
      >

        {this.$slots.leftFooter &&
          <template slot="footer">
            {this.$slots.leftFooter}
          </template>
        }

      </transfer-panel>

      <div class={`${prefix}-buttons`}>
        <mtd-button
          class={[
            `${prefix}-button`,
            hasOperations ? `${prefix}-button-with-texts` : '',
          ]}
          onClick={this.addToLeft}
          disabled={rightChecked.length === 0}
        >
          <mtd-icon name={'left'} />
          {operations[0] !== undefined &&
            <span>{operations[0]}</span>
          }
        </mtd-button>
        <mtd-button
          class={[
            `${prefix}-button`,
            hasOperations ? `${prefix}-button-with-texts` : '',
          ]}
          onClick={this.addToRight}
          disabled={leftChecked.length === 0}
        >
          {operations[1] !== undefined &&
            <span>{operations[1]}</span>
          }
          <mtd-icon name={'right'} />
        </mtd-button>
      </div>


      <transfer-panel
        {...restProps}
        panelData={targetData}
        defaultChecked={targetDefaultChecked}
        placeholder={filterPlaceholder}
        ref="rightPanel"
        direction="right"
        onChecked-change={this.onTargetCheckedChange}
      >

        {this.$slots.rightFooter &&
          <template slot="footer">
            {this.$slots.rightFooter}
          </template>
        }
      </transfer-panel>
    </div>
  },
})

