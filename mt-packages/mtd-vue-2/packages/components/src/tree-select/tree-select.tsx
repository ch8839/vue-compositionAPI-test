import {
  computed,
  defineComponent,
  nextTick,
  PropType,
  reactive,
  toRefs,
  useResetAttrs,
  vueInstance,
  getScopedSlotsInRender,
  toProps,
  vSlots,
  getSlotsInRender,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import { Popper, Reference, Drop } from '@components/popper'
import MtdSelectInput from '@components/select-input'
import MtdTree from '@components/tree'
import { DEFAULT_FIELD_NAMES, TCheckedStrategy, TreeFieldName, TreeNode } from '@components/tree/types'
import { debounce } from '@utils/debounce'
// import MtdMultipleInput from '@components/multiple-input';
import { IPopper } from '@components/popper/types'

import useControlled from '@hooks/controlled'
import { TreeSelectState } from './types'
import { getActivePaths } from '@components/cascader/util'
import { getValue } from '@components/cascader-panel/util'

function getCheckedKeysByValues(values: any[][]): any[] {
  return values.map((value: any[]) => {
    const key = value[value.length - 1]
    return key
  })
}

export default defineComponent({
  name: 'MtdTreeSelect',
  components: {
    Popper,
    Reference,
    Drop,
    MtdSelectInput,
    MtdTree,
  },
  inheritAttrs: true,
  model: {
    prop: 'modelValue',
    event: 'update:modelValue',
  },
  props: {
    icon: {
      type: String,
      default: 'triangle-down',
    },
    data: {
      type: Array,
      default: () => {
        return []
      },
    },
    modelValue: {
      type: Array,
      default: () => {
        return []
      },
    },
    noDataText: String,
    fieldNames: {
      type: Object,
      default: () => {
        return {}
      },
    },
    changeOnSelect: Boolean,
    expandTrigger: String,
    formatter: Function,
    separator: {
      type: String,
      default: ' / ',
    },
    loadData: Function,
    filterable: Boolean,
    debounce: {
      type: Number,
      default: 300,
    },
    filterMethod: Function,
    remote: Boolean,
    remoteMethod: Function,
    noMatchText: String,
    loading: Boolean,
    loadingText: String,
    disabled: Boolean,
    clearable: Boolean,
    size: String,
    placeholder: {
      type: String,
      default: () => {
        return '请选择'
      },
    },
    popperClass: String,
    placement: {
      type: String,
      default: 'bottom-start',
    },
    visible: Boolean,
    appendToContainer: {
      type: Boolean,
      default: true,
    },
    getPopupContainer: Function,

    multiple: Boolean,
    checkStrictly: Boolean,
    checkedStrategy: {
      type: String as PropType<TCheckedStrategy>,
      default: 'parent',
      validator: (v: string) => {
        return ['all', 'parent', 'children'].indexOf(v) > -1
      },
    },
    maxTagCount: Number,
    popperOptions: Object,
    closeOnSelect: Boolean,
    reserveKeyword: {
      type: Boolean,
      default: true,
    },
    maxCount: {
      type: Number,
    },

  },
  emits: [
    'clickoutside',
    'update:visible',
    'focus',
    'blur',
    'clear',
    'filter',
    'input',
    'change',
    'active-item-change',
    'update:modelValue',
  ],
  setup(props, ctx) {

    const config = useConfig()
    const self = reactive({
      ins: vueInstance(),
      prefix: config.getPrefixCls('tree-select'),
      prefixCascader: config.getPrefixCls('cascader'),
      prefixMTD: config.getPrefix(),
      restAttrs: useResetAttrs(ctx.attrs, true),
    })
    const state: TreeSelectState = reactive({
      inputValue: '',
      expandedValue: props.multiple ? [] : props.modelValue,
      focused: false,
      previousQuery: null,
      filter: '',
      inputWidth: '',
      valueStrs: [],
      debouncedQuery: null,
      isOnComposition: false,

      expandedKeys: [],
      selectedKeys: [],
    })
    const option = computed(() => {
      return {
        label: state.inputValue,
        value: state.inputValue,
      }
    })
    const options = computed(() => {
      return state.valueStrs.map((item: string) => {
        return {
          label: item,
          value: item,
        }
      })
    })
    const m_fieldNames = computed((): TreeFieldName => {
      return {
        ...DEFAULT_FIELD_NAMES,
        ...props.fieldNames,
      }
    })
    const nodeKey = computed(() => m_fieldNames.value.value)
    const hasValue = computed(() => {
      return props.modelValue && props.modelValue.length
    })

    const [visible, setVisible] = useControlled<boolean>('visible', props, ctx)
    const currentPlaceholder = (): string => {
      return !props.filterable || !state.focused
        ? props.placeholder
        : state.valueStrs[0] || props.placeholder
    }

    return {
      ...toRefs(self),
      ...toRefs(state),
      m_visible: visible,
      option, options, nodeKey,
      m_fieldNames, currentPlaceholder, setVisible, hasValue,
    }
  },
  watch: {
    m_visible: {
      immediate: true,
      handler(n) {
        n ? this.handleMenuVisible() : this.handleMenuHidden()
      },
    },
    modelValue: {
      immediate: true,
      handler() {
        /**
         * 保留历史计算结果，所以没有将其作为计算属性
         * 存在远程搜索的情况，在此情况下历史 data 会被重新赋值，如果重新计算会找不到原有对应值
         * */
        this.updateValueStrs()
      },
    },
    valueStrs: {
      immediate: true,
      handler(n, old) {
        if (!this.multiple) {
          if (!old || n[0] !== old[0]) {
            this.setInputValue(n, { force: true })
          }
        } else {
          nextTick(() => {
            this.updatePopper()
          })
        }
      },
    },
    expandedValue() {
      nextTick(() => {
        this.updatePopper()
      })
    },
    data(n, v) {
      if ((!v || !v.length) && (n || n.length)) {
        /**
         * 初始值的情况下，可能存在 value 先赋值， data 后赋值的情况
         * 此情况下前一次的 data 为 undefined、[]
         */
        this.updateValueStrs()
      }
      if (this.m_visible && n !== v) {
        this.expandedValue = this.multiple ? [] : this.modelValue
      }
    },
  },
  created() {
    this.debouncedQuery = !this.debounce
      ? this.handleQuery
      : debounce(this.debounce, this.handleQuery)
  },

  mounted() {
    this.initSelected()
  },
  methods: {
    openMenu() {
      if (!this.m_visible) {
        this.setVisible(true, { emit: true })
      }
    },
    closeMenu() {
      if (this.m_visible) {
        this.setVisible(false, { emit: true })
      }
    },
    handleMenuVisible() {
      this.expandedValue = this.multiple ? [] : this.modelValue
      this.focused = true
      this.setInputValue([''])
      const { selectInputRef } = this.$refs
      if (selectInputRef) {
        this.inputWidth = `${(selectInputRef as any).$el.getBoundingClientRect().width
          }px`
      }
      nextTick(this.scrollMenu)
    },
    handleMenuHidden() {
      this.setInputValue(this.valueStrs)
      this.focused = false
      this.filter = ''
      this.previousQuery = ''
    },
    handleClickoutside(e: Event) {
      if (this.disabled) {
        return
      }
      this.closeMenu()
      this.$emit('clickoutside', e)
      this.$emit('blur', e)
      const { selectInputRef } = this.$refs
      selectInputRef && (selectInputRef as any).blur()
    },
    handleFocus(e: Event) {
      this.focused = true
      this.$emit('focus', e)
    },
    handleClear() {
      // 如果是过滤中点击清空按钮则清空当前搜索条件，否则清空当前值
      if (this.m_visible && this.filterable && this.inputValue) {
        this.setInputValue([''])
        const { selectInputRef } = this.$refs
        selectInputRef && (selectInputRef as any).reset()
      } else {
        this.$emit('clear')
        this.setValue([], [])
      }
    },
    handleInput() {
      if (!this.m_visible) {
        // to fix: https://tt.sankuai.com/ticket/detail?id=5934989
        this.openMenu()
      }
      this.debouncedQuery && this.debouncedQuery(this.inputValue)
    },

    handleInputChange(v: string) {
      this.inputValue = v
      nextTick(this.updatePopper)
      this.handleInput()
    },
    handleComposition(e: CompositionEvent) {
      const { type } = e
      if (type === 'compositionend') {
        this.isOnComposition = false
        // 当混合输入前后值不变时，不会触发后续的 input 事件，所以需要再次触发 query
        this.debouncedQuery && this.debouncedQuery(this.inputValue)
      } else {
        this.isOnComposition = true
      }
    },
    handleInputClick() {
      if (this.disabled) {
        return
      }
      if (!this.m_visible) {
        this.openMenu()
      } else if (!this.filterable) {
        this.closeMenu()
      }
    },
    handleQuery(val: string) {
      if (this.previousQuery === val || this.isOnComposition) {
        return
      }
      this.previousQuery = val
      if (this.remote) {
        this.remoteMethod && this.remoteMethod(val)
      } else {
        this.filter = val
        if (this.filterable) {
          (this.$refs.treeRef as any).filter(val)
        }
      }
      // 如果通过样式修改面板高为不定高后，依赖此方法重新定位
      nextTick(() => {
        this.updatePopper()
      })
      this.$emit('filter', val)
    },

    setValue(values: any[], nodes: TreeNode[]) {
      this.$emit('input', values)
      this.$emit('update:modelValue', values)
      const datas = nodes.map((node) => node.data)
      this.$emit('change', values, datas, nodes)
    },
    setInputValue(values: string[], option: { force?: boolean } = {}) {
      if (this.filterable || option.force) {
        this.inputValue = this.multiple ? '' : values[0]
      }
    },
    setMultipleValue(values: any[], paths: TreeNode[][]) {
      this.$emit('input', values)
      this.$emit('update:modelValue', values)
      const datas = paths.map((path) => {
        return path.map((node) => node.data)
      })
      this.$emit('change', values, datas, paths)
      if (this.filterable) {
        this.focus()
      }
    },
    handleSelect(node: TreeNode) {
      if (this.multiple) {
        return
      }
      if (!this.changeOnSelect && node.hasChildren) {
        return
      }
      const { values, nodes } = getValue(node)
      this.setValue(values, nodes)
      this.closeMenu()
    },
    /* handleClickItem(node: TreeNode) {
      const { values, nodes } = getValue(node)
      this.setValue(values, nodes)
      if (this.closeOnSelect) {
        this.closeMenu()
      }
    }, */
    handleExpandedChange(values: any[], nodes: TreeNode[]) {
      this.expandedValue = values
      const datas = nodes.map((node) => node.data)
      // 展开项发生变化
      this.$emit('active-item-change', datas)
    },
    handleChekced(checkedKeys: any[], checkedObj: {
      node: TreeNode,
      checked: boolean,
      nodes: TreeNode[],
      checkedPaths: TreeNode[][],
      values: any[],
    }) {
      if (!this.multiple) {
        return
      }
      if (!this.reserveKeyword) {
        this.filter = ''
        this.inputValue = ''
      }
      this.setMultipleValue(checkedObj.values, checkedObj.checkedPaths)
    },
    handleTagRemove(tag: string, index: number) {
      const nextValue = [...this.modelValue]
      nextValue.splice(index, 1)
      const { treeRef } = this.$refs
      const nodes = nextValue.map((pathValue) => {
        return (treeRef as any).getNodesByValues(pathValue as any[])
      })
      this.setMultipleValue(nextValue, nodes)
    },
    scrollMenu() {
      const menusRef = this.$refs.menusRef
      if (menusRef) {
        (menusRef as any).scrollIntoView()
      }
    },
    focus() {
      (this.$refs.selectInputRef as any).focus()
      this.openMenu()
    },
    blur() {
      (this.$refs.selectInputRef as any).blur()
    },
    updatePopper() {
      if (this.m_visible) {
        (this.$refs.popperRef as unknown as IPopper).updatePopper()
      }
    },
    updateValueStrs() { // 更新期望有缓存
      const labelField = this.m_fieldNames.label
      const values = this.multiple ? this.modelValue : [this.modelValue]
      this.valueStrs = values.map((value: any) => {
        // 🤡精确匹配问题
        const actived = getActivePaths(this.data, value, this.m_fieldNames)
        const labels = actived.map((item) => item[labelField])
        if (this.formatter) {
          return this.formatter(labels, actived, value)
        }
        return labels.join(`${this.separator}`)
      })
    },

    // 初始化根据value展开并选中节点
    initSelected() {
      if (this.multiple) return
      const targetKey = (this.modelValue as string[])[this.modelValue.length - 1]
      this.selectedKeys = [targetKey]
      this.expandedKeys = [...(this.modelValue as string[])]
    },

    // render function
    renderSelectInput() {

      const selectInputProps = this.multiple
        ? toProps({
          value: this.options,
          readonly: this.disabled || !this.filterable,
          filterable: this.filterable,
          clearable: this.clearable,
          closable: !this.disabled, // 🤡this.closable
          placeholder: this.placeholder,
          ['max-count']: this.maxTagCount,
          icon: this.icon,
          multiple: this.multiple,
          fieldNames: this.m_fieldNames,
        })
        : toProps({
          value: this.option,
          size: this.size,
          placeholder: this.placeholder,
          filterable: this.filterable,
          disabled: this.disabled,
          readonly: !this.filterable,
          clearable: this.clearable,
          icon: this.icon,
          multiple: this.multiple,
          fieldNames: this.m_fieldNames,
        })

      const selectInputListeners = this.multiple
        ? {
          query: this.handleInputChange,
          remove: this.handleTagRemove,
          clear: this.handleClear,
          focus: this.handleFocus,
          click: this.handleInputClick,
          compositionstart: this.handleComposition,
          compositionupdate: this.handleComposition,
          compositionend: this.handleComposition,
        }
        : {
          focus: this.handleFocus,
          click: this.handleInputClick,
          clear: this.handleClear,
          query: this.handleInputChange,
          compositionstart: this.handleComposition,
          compositionupdate: this.handleComposition,
          compositionend: this.handleComposition,
        }
      return <mtd-select-input
        {...selectInputProps}
        ref="selectInputRef"
        on={selectInputListeners}
      />
    },
    renderTree() {
      const $render = getScopedSlotsInRender(this)
      const checkedKeys = this.multiple ? getCheckedKeysByValues(this.modelValue as any) : undefined
      const treeProps = toProps({
        data: this.data,
        fieldNames: this.m_fieldNames,
        loadData: this.loadData,
        'node-key': this.nodeKey,
        'expand-on-click-node': false,
        'check-on-click-node': true,
        'change-on-select': this.changeOnSelect,
        'checked-keys': checkedKeys,
        'check-strictly': this.checkStrictly,
        'checked-strategy': this.checkedStrategy,
        ['expanded-keys']: this.expandedKeys,
        ['selected-keys']: this.selectedKeys,
        checkable: this.multiple,
        filterNodeMethod: this.filterable ? (value: string, data: any, node: TreeNode) => {
          if (!value) return true
          return node.label.indexOf(value) !== -1
        } : undefined,
      })
      const treeListeners = {
        'toggle-checked': this.handleChekced,
        'toggle-selected': this.handleSelect,
        'update:expandedKeys': (val: string[]) => {
          this.expandedKeys = val
        },
        'update:selectedKeys': (val: string[]) => {
          this.selectedKeys = val
        },
        fieldNames: this.m_fieldNames,
      }
      const slots = {
        default: (props: {
          node: TreeNode,
          data: any,
        }) => {
          return $render ? $render({
            node: props.node,
            data: props.node.data,
          }) : <span>{props.node.label}</span>
        },
      }
      return <div class={`${this.prefix}-wrapper`}>
        <mtd-tree
          ref="treeRef"
          style={{ minWidth: this.inputWidth }}
          {...treeProps}
          on={treeListeners}
          v-slots={slots}
          {...vSlots(slots)}
        />
      </div>

    },
  },

  render() {
    const { prefix, prefixMTD, disabled, m_visible, placement, appendToContainer, getPopupContainer, popperOptions,
      size, multiple, popperClass, restAttrs, loading, inputWidth, prefixCascader, hasValue,
    } = this
    return <popper
      popper-disabled={disabled}
      visible={m_visible}
      trigger="click"
      ref="popperRef"
      placement={placement}
      append-to-container={appendToContainer}
      get-popup-container={getPopupContainer}
      popper-options={popperOptions}
      onClickoutside={this.handleClickoutside}

      {...restAttrs}
      wrapperTag="div"
      class={{
        [prefix]: true,
        [prefixCascader]: true,
        [`${prefix}-disabled`]: disabled,
        [`${prefix}-${size}`]: size,
        [`${prefix}-selected`]: hasValue,
        focus: m_visible,
      }}
    >
      <reference>
        {this.renderSelectInput()}
      </reference>
      <drop
        useShow={multiple}
        lazy={false}
        classProp={[popperClass, `${prefix}-drop`]}
      >
        {loading ? <div
          class={`${prefixMTD}-cascader-menu-loading`}
          style={{ minWidth: inputWidth, padding: '8px' }}
        >
          {getSlotsInRender(this, 'loading') || <mtd-loading />}
        </div>
          : this.renderTree()
        }
      </drop >
    </popper >
  },
})
