import {
  defineComponent,
  computed,
  useResetAttrs,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import MtdPage from './pager'
import MtdOptions from './options'

export default defineComponent({
  name: 'MtdPagination',
  components: {
    MtdPage,
    MtdOptions,
  },
  inheritAttrs: true,
  props: {
    size: {
      type: String,
    },
    unborder: Boolean,
    simple: {
      type: Boolean,
      default: false,
    },
    fullfill: Boolean,
    currentPage: {
      type: Number,
      default: 1,
    },
    pageSize: {
      type: Number,
      default: 10,
    },
    pageSizeOptions: {
      type: Array,
      default: () => [10, 20, 50, 100],
    },
    showSizeChanger: {
      type: Boolean,
      default: false,
    },
    showQuickJumper: {
      type: Boolean,
      default: false,
    },
    total: {
      type: Number,
      default: 0,
    },
    showTotal: {
      type: Boolean,
      default: false,
    },
    pagerCount: Number,
    selectClass: String,
    selectProps: Object,
    simpleReadonly: Boolean,
  },
  emits: ['update:currentPage', 'update:pageSize', 'change'],
  setup(props, { attrs, emit }) {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('pagination'))

    const restAttrs = useResetAttrs(attrs)

    const defaultPageCount = computed(() => {
      const pageCount = Math.ceil(Number(props.total) / Number(props.pageSize))
      if (!isNaN(pageCount) && pageCount > 0) {
        return pageCount
      }
      return 1
    })

    const handleCurrentChange = (val: number) => {
      const page = ~~(val > defaultPageCount.value
        ? defaultPageCount.value
        : val > 1
          ? val
          : 1)
      if (page !== props.currentPage) {
        emit('update:currentPage', page)
        emit('change', page, props.pageSize)
      }
    }

    const defaultCurrentPage = computed(() => {
      if (isNaN(props.currentPage) || props.currentPage < 1) {
        handleCurrentChange(1)
        return 1
      }
      return props.currentPage
    })

    const defaultPageSizeOptions = computed(() => {
      const psizeOptions = props.pageSizeOptions
      if (props.pageSizeOptions.indexOf(props.pageSize) === -1) {
        psizeOptions.unshift(props.pageSize)
      }
      return psizeOptions
    })

    const handleChange = (e: Event) => {
      // ~~value可以代替parseInt(value)
      handleCurrentChange(Number(~~(e.target as HTMLInputElement).value))
    }

    const handleKeyup = (e: KeyboardEvent) => {
      e.keyCode === 13 &&
        handleCurrentChange(Number((e.target as HTMLInputElement).value))
    }

    const handlePageSizeChange = (val: number) => {
      const pageCount = Math.max(
        1,
        Math.ceil(Number(props.total) / Number(val)),
      )
      emit('update:pageSize', val)
      const currentPage =
        pageCount < defaultCurrentPage.value
          ? pageCount
          : defaultCurrentPage.value

      if (currentPage !== defaultCurrentPage.value) {
        emit('update:currentPage', currentPage)
      }
      emit('change', currentPage, val)

      // (pageCount >= this.defaultCurrentPage) &&
      //   this.$emit('change', this.currentPage, val);
    }

    const computedCollection = {
      defaultPageCount, defaultCurrentPage, defaultPageSizeOptions,
    }
    const methodsCollection = {
      handleCurrentChange, handleChange, handleKeyup, handlePageSizeChange,
    }

    return {
      ...computedCollection,
      ...methodsCollection,
      prefix, restAttrs,
    }

  },
  render() {
    const {
      prefix, simple, size, restAttrs, unborder, defaultCurrentPage, defaultPageCount, pagerCount, simpleReadonly,
      showSizeChanger, selectProps, defaultPageSizeOptions, pageSize, selectClass, showQuickJumper, total, showTotal,
      fullfill,
    } = this
    return <div
      class={{
        [prefix]: true,
        [`${prefix}-border`]: !(fullfill || simple || unborder),
        [`${prefix}-simple`]: simple,
        [`${prefix}-fullfill`]: fullfill,
        [`${prefix}-unborder`]: unborder,
        [`${prefix}-${size}`]: size,
      }}
    >
      {showTotal &&
        <span class={`${prefix}-total`}>共{total}条</span>
      }
      <mtd-page
        {...restAttrs}
        unborder={unborder}
        size={size}
        simple={simple}
        currentPage={defaultCurrentPage}
        pageCount={defaultPageCount}
        pagerCount={pagerCount}
        simpleReadonly={simpleReadonly}
        onChange={this.handleCurrentChange}
      />
      {showSizeChanger &&
        <mtd-options
          size={size}
          selectProps={selectProps}
          pageSizeOptions={defaultPageSizeOptions}
          pageSize={pageSize}
          class={selectClass || ''}
          onChange={this.handlePageSizeChange}
        />
      }
      {showQuickJumper &&
        <span class={`${prefix}-jumper`}>
          <span>前往</span>
          <input
            class={`${prefix}-jumper-input`}
            type="number"
            value={defaultCurrentPage}
            onKeyup={this.handleKeyup}
            onBlur={this.handleChange}
          />
        </span>
      }

    </div >
  },
})
