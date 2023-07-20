import {
  defineComponent,
  PropType,
  computed,
  toRefs,
  reactive,
  ref,
  watch,
  Fragment,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import MtdDropdown from '@components/dropdown'
import MtdCheckboxGroup from '@components/checkbox-group'
import MtdCheckbox from '@components/checkbox'
import MtdIcon from '@components/icon'
import { ITable } from '../types'
import { IColumn } from '@components/table-column/types'
import { IDropdown } from '@components/dropdown/types'
import vueInstance from '@components/hooks/instance'
import { getParentIns } from '@components/__utils__/vnode'
import { useListeners } from '@components/hooks/pass-through'


export default defineComponent({
  name: 'FilerPanel',
  components: {
    MtdDropdown,
    MtdCheckboxGroup,
    MtdCheckbox,
    Fragment,
    MtdIcon,
  },
  props: {
    column: {
      type: Object as PropType<IColumn>,
      required: true,
    },
    fixed: Boolean,
    disabled: Boolean,
    slots: Object,
  },
  emits: [],
  setup(props, ctx) {
    const { slots } = ctx
    const config = useConfig()
    const prefixTable = computed(() => config.getPrefixCls('table'))
    const prefixDropdown = computed(() => config.getPrefixCls('dropdown-menu'))
    const ins = vueInstance()

    const dropdownRef = ref<IDropdown | null>(null)

    const state = reactive({
      value: props.column.filteredValue || [], // 保存用户在点击确定或关闭下拉前的操作值
    })

    // @Computed
    const table = computed<ITable>(() => {
      // $parent is table-header;
      return (getParentIns(ins) as any).table
    })
    const visible = computed<boolean>(() => {
      return !props.disabled && props.column.filterDropdownVisible
    })

    const filtered = computed<boolean>(() => state.value && state.value.length)
    const multiple = computed<boolean>(() => props.column.filterMultiple)
    const showActions = computed<boolean>(() => multiple.value || props.column.showFilterActions)

    // @Watch
    watch(() => props.column.filteredValue, (filteredValue) => {
      if (state.value !== filteredValue) {
        state.value = filteredValue
        table.value.store.computedFilteredData()
      }
    })

    watch(visible, (nVisible) => {
      if (!nVisible && state.value !== props.column.filteredValue) {
        table.value.store.computedFilteredData()
      }
    })

    // @Methods
    function handleScroll() {
      updatePopper()
    }
    function updateFilteredValue(filteredValue: any) {
      if (props.column.filteredValue !== filteredValue) {
        props.column.updateFilteredValue(filteredValue)
        state.value = props.column.filteredValue
        table.value.store.computedFilteredData()
        const { filters, sortOrder, sortingColumn } = table.value.store.states
        const { prop, order } = sortOrder || {}
        table.value.emitter.emit('change', filters || {}, {
          prop,
          order,
          column: sortingColumn,
        })
      }
    }
    function close() {
      props.column.updateFilterDropdownVisible(false)
    }
    function handleVisibleChange(visible: boolean) {
      props.column.updateFilterDropdownVisible(visible)
      if (!visible) {
        confirmFilter({ closed: false })
      }
    }
    function confirmFilter(options?: { closed: boolean }) {
      const { closed = true } = options || {}
      closed && close()
      // todo: 可判断是否变更后在更新
      updateFilteredValue(state.value)
    }
    function clearFilter(options?: { closed: boolean }) {
      const { closed = true } = options || {}
      closed && close()
      updateFilteredValue([])
    }
    function handleSelect(value: any) {
      state.value = value
    }
    function selectSingleValue(value: any) {
      state.value = [value]
      confirmFilter()
    }
    function updatePopper() {
      dropdownRef.value && dropdownRef.value.updatePopper()
    }

    const computedCollection = {
      multiple, visible, filtered, showActions,
    }
    const methodsCollection = {
      clearFilter, handleSelect, selectSingleValue, confirmFilter, handleScroll,
    }

    const dropdownListeners = useListeners({
      ['update:visible']: handleVisibleChange,
    })

    // @ScopedSlots
    const slotsFilterIcon = () => slots['filter-icon'] && slots['filter-icon']({
      active: visible.value,
      filtered: filtered.value,
    })
    const slotsFilterDropdown = () => slots['filter-dropdown'] && slots['filter-dropdown']({
      confirm: confirmFilter,
      clear: filtered.value,
      setSelected: handleSelect,
      selectedValue: state.value,
    })

    return {
      ...toRefs(state),
      ...computedCollection,
      ...methodsCollection,
      prefixTable, prefixDropdown,
      dropdownRef,
      dropdownListeners,
      slotsFilterIcon,
      slotsFilterDropdown,
    }

  },
  render() {
    const {
      value, dropdownListeners, visible, disabled, prefixTable, prefixDropdown, multiple, column, showActions,
    } = this

    return <mtd-dropdown
      trigger="click"
      placement="bottom-end"
      visible={visible}
      disabled={disabled}
      {...dropdownListeners}
      ref={'dropdownRef'}
    >
      <div
        class={{
          [`${prefixTable}-column-filter-trigger`]: true,
          hover: visible,
          [`${prefixTable}-column-filter-trigger-filtered`]: value && value.length,
        }}
        onClick={(e: Event) => e.stopPropagation()}
      >
        {this.slotsFilterIcon() || <mtd-icon name={'filter'} />}
      </div >

      <template slot="dropdown">
        {this.slotsFilterDropdown() || <div class={`${prefixTable}-filter-panel-dropdown`}>

          {multiple
            ? <mtd-checkbox-group
              modelValue={value}
              onInput={(v: any[]) => { this.value = v }}
              class={`${prefixTable}-filter-checkbox-group`}
            >
              {column.filters.map(filter => <mtd-checkbox
                key={filter.value}
                class={`${prefixDropdown}-item`}
                value={filter.value}
              >
                {filter.text}
              </mtd-checkbox>)}
            </mtd-checkbox-group>
            : <div>
              {column.filters.map(filter => <div
                key={filter.value}
                class={{
                  [`${prefixDropdown}-item`]: true,
                  [`${prefixDropdown}-item-selected`]: filter.value === value[0],
                }}
                onClick={this.selectSingleValue.call(null, filter.value)}
              >
                <span>{filter.text}</span>
              </div>)}
            </div >
          }

          <div class={`${prefixTable}-filter-footer`} v-show={showActions}>
            <a class={`${prefixTable}-filter-footer-confirm`} onClick={this.confirmFilter}>确定</a>
            <a class={`${prefixTable}-filter-footer-cleara`} onClick={this.clearFilter}>重置</a>
          </div >

        </div>}
      </template >
    </mtd-dropdown >
  },
})
