import {
  defineComponent,
  PropType,
  computed,
  reactive,
  watch,
  toRefs,
  ref, classNames, styles,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import MtdCheckboxGroup from '@components/checkbox-group'
import MtdCheckbox from '@components/checkbox'
import MtdInput from '@components/input'
import MtdPagination from '@components/pagination'

import { isFunction, isBoolean, isArray } from '@utils/type'

export default defineComponent({
  name: 'MtdTransferPanel',
  components: {
    MtdCheckboxGroup,
    MtdCheckbox,
    MtdInput,
    MtdPagination,
  },
  inheritAttrs: false,
  props: {
    panelData: {
      type: Array as PropType<any[]>,
      default: () => {
        return []
      },
    },
    placeholder: String,
    title: String,
    filterable: Boolean,
    format: {
      type: Object,
      default: () => {
        return {}
      },
    },
    filterMethod: Function,
    defaultChecked: Array as PropType<any[]>,
    props: {
      type: Object as PropType<{ [key: string]: string }>,
      default: () => {
        return {}
      },
    },
    noMatchText: {
      type: String,
      default: () => {
        return '暂无搜索结果'
      },
    },
    noDataText: {
      type: String,
      default: () => {
        return '暂无数据'
      },
    },
    pagination: {
      type: Object as PropType<boolean | { pageSize: number }>,
    },
    direction: {
      type: String,
      required: true,
    },
    disableSelectAll: {
      type: String as PropType<'left' | 'right' | 'all'>,
    },
  },
  emits: ['checked-change'],
  setup(props, { emit, slots }) {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('transfer-panel'))
    const prefixTransfer = computed(() => config.getPrefixCls('transfer'))

    const state = reactive({
      checked: [] as any[],
      selected: [] as any[],
      allChecked: false,
      query: '',
      checkChangeByUser: true,
    })

    // @Computed
    const filter = computed<Function | undefined>(() => {
      return isFunction(props.filterMethod)
        ? props.filterMethod
        : (query: string, item: any) => {
          const label = item[labelProp.value] || item[keyProp.value].toString()
          return label.toLowerCase().indexOf(query.toLowerCase()) > -1
        }
    })
    const filteredData = computed<any[]>(() => {
      if (!props.filterable) {
        return props.panelData
      }
      return props.panelData.filter((item) => {
        return filter.value?.(state.query, item)
      })
    })
    const checkableData = computed(() => filteredData.value.filter((item) => !item[disabledProp.value]))
    const checkedSummary = computed<string>(() => {
      const checkedLength = state.checked.length
      const dataLength = props.panelData.length
      const { noChecked, hasChecked } = props.format
      if (noChecked && hasChecked) {
        return checkedLength > 0
          ? hasChecked
            .replace(/\${checked}/g, checkedLength)
            .replace(/\${total}/g, dataLength)
          : noChecked.replace(/\${total}/g, dataLength)
      } else {
        return `${checkedLength}/${dataLength}`
      }
    })
    const isIndeterminate = computed(() => {
      const checkedLength = state.checked.length
      return checkedLength > 0 && checkedLength < checkableData.value.length
    })
    const hasNoMatch = computed(() => state.query.length > 0 && filteredData.value.length === 0)
    const checkboxDisabled = computed(() => !props.panelData.length
      || hasNoMatch.value
      || props.disableSelectAll && props.disableSelectAll === props.direction
      || props.disableSelectAll === 'all',
    )
    const labelProp = computed(() => props.props.label || 'label')
    const keyProp = computed(() => props.props.key || 'key')
    const disabledProp = computed(() => props.props.disabled || 'disabled')
    const hasFooter = computed(() => !!slots.footer)

    // @Watch
    watch(() => state.checked, (val: any[], oldVal: any[]) => {
      updateAllChecked()
      if (state.checkChangeByUser) {
        const movedKeys = val
          .concat(oldVal)
          .filter((v) => val.indexOf(v) === -1 || oldVal.indexOf(v) === -1)
        emit('checked-change', val, movedKeys)
      } else {
        emit('checked-change', val)
        state.checkChangeByUser = true
      }
    })
    watch(() => props.panelData, () => {
      const checked: any[] = []
      const filteredDataKeys = filteredData.value.map(
        (item) => item[keyProp.value],
      )
      state.checked.forEach((item) => {
        if (filteredDataKeys.indexOf(item) > -1) {
          checked.push(item)
        }
      })
      state.checkChangeByUser = false
      state.checked = checked
    })
    watch(checkableData, () => { updateAllChecked() })
    watch(() => props.defaultChecked, (val?: any[], oldVal?: any[]) => {
      if (
        oldVal && val &&
        val.length === oldVal.length &&
        val.every((item) => oldVal.indexOf(item) > -1)
      )
        return
      const checked: any[] = []
      const checkableDataKeys = checkableData.value.map(
        (item) => item[keyProp.value],
      )
      val?.forEach((item) => {
        if (checkableDataKeys.indexOf(item) > -1) {
          checked.push(item)
        }
      })
      state.checkChangeByUser = false
      state.checked = checked
    }, { immediate: true })

    // @Function
    function updateAllChecked() {
      const checkableDataKeys = checkableData.value.map(
        (item) => item[keyProp.value],
      )
      state.allChecked =
        checkableDataKeys.length > 0 &&
        checkableDataKeys.length >= state.checked.length &&
        checkableDataKeys.every((item) => state.checked.indexOf(item) > -1)
    }
    function handleAllCheckedChange(value: boolean) {
      state.allChecked = value // v-model
      state.checked = value
        ? checkableData.value.map((item) => item[keyProp.value])
        : []
    }
    function setQuery(v: string) {
      state.query = v
    }
    function setChecked(v: any[]) {
      state.checked = v
    }

    const computedCollection = {
      checkboxDisabled, checkedSummary, isIndeterminate, hasNoMatch, hasFooter,
      filteredData, disabledProp, labelProp, keyProp,
    }
    const methodsCollection = {
      handleAllCheckedChange,
      setQuery, setChecked,
    }

    // Feat: 处理分页的逻辑
    const currentPage = ref(1)
    const curPageSize = computed(() => (props.pagination && !isBoolean(props.pagination))
      ? props.pagination.pageSize
      : 10,
    )
    const filteredDataLen = computed(() => filteredData.value.length)
    const _filteredData = computed(() => {
      if (!props.pagination) {
        return filteredData.value
      }
      return pagination(currentPage.value, curPageSize.value, filteredData.value)
    })
    function pagination(page: number, pageSize: number, array: any[]) {
      const offset = (page - 1) * pageSize
      return (offset + pageSize >= array.length)
        ? array.slice(offset, array.length)
        : array.slice(offset, offset + pageSize)
    }
    const featPager = {
      currentPage, curPageSize, _filteredData, filteredDataLen,
    }

    // Feat: 处理自定义渲染内容
    // 勾选一组条目
    function doSelect(keys: string | string[], selected: boolean) {
      setCheckedOnSelf(keys, selected)
    }
    // 手动控制
    function setCheckedOnSelf(keys: string | string[], selected: boolean) {
      const arrKeys = isArray(keys) ? keys : [keys]
      if (selected) {
        state.checked = Array.from(new Set([...arrKeys]))
      } else {
        state.checked = state.checked.filter((key: string) => {
          return arrKeys.indexOf(key) > -1
        })
      }
    }
    const featRenderSelf = {
      doSelect,
    }


    return {
      ...toRefs(state),
      ...computedCollection,
      ...methodsCollection,
      ...featPager, ...featRenderSelf,
      prefix, prefixTransfer,
    }
  },
  render() {
    const {
      prefix, allChecked, isIndeterminate, checkedSummary, hasFooter, query, checkboxDisabled,
      placeholder, noMatchText, noDataText, filterable, hasNoMatch, panelData, checked, _filteredData,
      disabledProp, labelProp, keyProp, filteredDataLen, pagination, direction,

    } = this

    const $render = this.$parent.$scopedSlots.default
    const $renderChildren = this.$parent.$scopedSlots.children

    const renderContent = () => {
      return $renderChildren
        && $renderChildren({
          filteredData: _filteredData,
          direction: direction,
          selectedKeys: checked,
          onItemSelect: this.doSelect,
        })
        || <mtd-checkbox-group
          modelValue={checked}
          onChange={this.setChecked}
          v-show={!hasNoMatch && panelData.length > 0}
          class={{
            'is-filterable': filterable,
            [`${prefix}-list`]: true,
          }}
        >
          {_filteredData.map((item) => <mtd-checkbox
            class={`${prefix}-item`}
            disabled={item[disabledProp]}
            value={item[keyProp]}
            key={item[keyProp]}
          >
            {(!$render && item)
              ? <span>{item[labelProp]}</span>
              : $render && $render({
                row: item,
              })
            }

          </mtd-checkbox>)
          }
        </mtd-checkbox-group >
    }


    return <div
      class={classNames(this, prefix)}
      style={styles(this)}
    >

      {/* 头部 */}
      <p class={`${prefix}-header`}>
        <mtd-checkbox
          value={allChecked}
          onChange={this.handleAllCheckedChange}
          indeterminate={isIndeterminate}
          disabled={checkboxDisabled}
        >
          {`${checkedSummary} 项`}
        </mtd-checkbox>
        {/* <span class={`${prefixTransfer}-sum`}>{checkedSummary}</span> */}
        <div class={`${prefix}-separation`} />
      </p>

      {/* 身体 */}
      <div class={[`${prefix}-body`, { 'with-footer': hasFooter }]}>

        {/* 身体 -- 搜索框 */}
        {filterable &&
          <mtd-input
            class={`${prefix}-filter`}
            modelValue={query}
            onInput={this.setQuery}
            suffix-icon="search"
            placeholder={placeholder}
            clearable={true}
          />
        }

        {/* 身体 -- 内容 */}
        {panelData.length > 0 && renderContent()}

        <p class={`${prefix}-empty`} v-show={hasNoMatch}>
          {noMatchText}
        </p>
        <p
          class={`${prefix}-empty`}
          v-show={panelData.length === 0 && !hasNoMatch}
        >
          {noDataText}
        </p>

        {/* 身体 -- 分页器 */}
        <div class={`${prefix}-pagination`} v-show={pagination}>
          <mtd-pagination
            total={filteredDataLen}
            current-page={this.currentPage}
            page-size={this.curPageSize}
            on={{
              ['update:currentPage']: (v: number) => { this.currentPage = v },
            }}
            simple
          />
        </div>
      </div >

      {/* 穿梭框足部 */}
      {hasFooter &&
        <div class={`${prefix}-footer`}>
          {this.$slots.footer}
        </div>
      }
    </div >
  },
})
