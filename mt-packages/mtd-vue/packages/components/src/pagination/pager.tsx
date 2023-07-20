import {
  defineComponent,
  computed,
  Fragment,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import MtdPopper from '@components/popover'
import MtdDropdownMenu from '@components/dropdown-menu'
import MtdDropdownMenuItem from '@components/dropdown-menu-item'
import MtdIcon from '@components/icon'

// 根据首尾数字升恒等差数列数组
function getRangeArr(a: number, b: number) {
  if (a < b) {
    return [...Array(b - a + 1)].map((e, i) => a + i)
  } else {
    return [...Array(a - b + 1)].map((e, i) => a - i)
  }
}

export default defineComponent({
  name: 'Pager',
  components: {
    Fragment,
    MtdPopper,
    MtdDropdownMenu,
    MtdDropdownMenuItem,
    MtdIcon,
  },
  inheritAttrs: true,
  props: {
    simple: Boolean,
    unborder: Boolean,
    fullfill: Boolean,
    size: String,
    currentPage: {
      required: true,
      type: Number,
    },
    pageCount: {
      required: true,
      type: Number,
    },
    simpleReadonly: Boolean,
    pagerCount: {
      type: Number,
      validator: (value: number) => {
        return (
          (value | 0) === value && value > 4 && value < 22 && value % 2 === 1
        )
      },
      default: 7,
    },
  },
  emits: ['change'],
  setup(props, { emit }) {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('pager'))
    const iconPrefix = config.getIconCls
    const prefixPagination = computed(() => config.getPrefixCls('pagination'))

    // @Computed
    // 计算是否显示prev
    const showPrevMore = computed(() => {
      return (
        props.pageCount > props.pagerCount &&
        props.currentPage > (props.pagerCount + 1) / 2
      )
    })
    // 计算是否显示next
    const showNextMore = computed(() => {
      return (
        props.pageCount > props.pagerCount &&
        props.currentPage < props.pageCount - (props.pagerCount - 1) / 2
      )
    })
    const pagers = computed(() => {
      const array = []
      if (!showPrevMore.value && showNextMore.value) {
        for (let i = 2; i < props.pagerCount; i++) {
          array.push(i)
        }
      } else if (showPrevMore.value && !showNextMore.value) {
        const startPage = props.pageCount - (props.pagerCount - 2)
        for (let i = startPage; i < props.pageCount; i++) {
          array.push(i)
        }
      } else if (showPrevMore.value && showNextMore.value) {
        const offset = Math.floor(props.pagerCount / 2) - 1
        const start = props.currentPage - offset
        const end = props.currentPage + offset
        for (let i = start; i <= end; i++) {
          array.push(i)
        }
      } else {
        for (let i = 2; i < props.pageCount; i++) {
          array.push(i)
        }
      }
      return array
    })
    const unBorderClass = computed(() => props.simple || props.unborder)


    // @Methods
    const goTo = (num: number) => {
      const newPage = num > props.pageCount ? props.pageCount : num
      if (newPage !== props.currentPage) {
        emit('change', newPage)
      }
    }
    const prev = () => {
      if (props.currentPage > 1) {
        const page = props.currentPage
        goTo(page - 1)
      }
    }
    const quickPrev = () => {
      const pagerCountOffset = props.pagerCount - 2
      const page = props.currentPage - pagerCountOffset
      goTo(page)
    }
    const next = () => {
      if (props.currentPage < props.pageCount) {
        const page = props.currentPage
        goTo(page + 1)
      }
    }
    const quickNext = () => {
      // 去掉首尾的个数
      const pagerCountOffset = props.pagerCount - 2
      const page = props.currentPage + pagerCountOffset
      goTo(page)
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      e.keyCode === 13 && goTo(Number((e.target as HTMLInputElement).value))
    }
    const handleChange = (val: number) => {
      goTo(val)
    }

    const computedCollection = {
      showPrevMore, showNextMore, pagers, unBorderClass,
    }
    const methodsCollection = {
      goTo, prev, quickPrev, next, quickNext, handleKeyUp, handleChange,
    }


    return {
      ...computedCollection,
      ...methodsCollection,
      prefix, prefixPagination, iconPrefix,
    }

  },
  render() {
    const {
      prefix, unBorderClass, size, currentPage, simple, simpleReadonly, pageCount, unborder, fullfill,
      showPrevMore, pagers, showNextMore, iconPrefix,
    } = this
    return <ul
      class={{
        [prefix]: true,
        [`${prefix}-unborder`]: unBorderClass,
        [`${prefix}-${size}`]: size,
        [`${prefix}-border`]: !(fullfill || simple || unborder),
      }}
    >
      <li
        class={[
          `${prefix}-item`, `${prefix}-prev`, iconPrefix('left-thick'),
          { [`${prefix}-disabled`]: currentPage <= 1 },
        ]}
        onClick={this.prev}
      />

      {simple
        ? <mtd-popover
          disabled={simpleReadonly || pageCount <= 1}
          trigger="hover"
          placement="top"
          show-arrow={false}
          popper-class={`${prefix}-simple-popper`}>
          <li class={`${prefix}-simple-item`} >
            {/* simpleReadonly
            ? <span class={`${prefix}-simple-item-span`}>{currentPage}</span>
            : <input
              class={`${prefix}-simple-input ${prefixPagination}-jumper-input`}
              type="number"
              value={currentPage}
              onKeyup={this.handleKeyUp}
              onBlur={this.handleChange}
            /> */}
            <span class={`${prefix}-simple-item-span`}>{currentPage}</span>
            <span class={`${prefix}-simple-item-span`}> / </span>
            <span class={`${prefix}-simple-item-span`}>{pageCount}</span>
          </li>
          <div slot="content">
            <mtd-dropdown-menu>
              {/* {pageCount > 0 &&
                <mtd-dropdown-menu-item
                  onClick={this.handleChange.bind(null, 1)}
                  selected={currentPage === 1}
                > 1 </mtd-dropdown-menu-item>
              } */}
              {[1, ...pagers, pageCount].map(pager => <mtd-dropdown-menu-item
                onClick={this.handleChange.bind(null, pager)}
                selected={currentPage === pager}
              >
                {pager}
              </mtd-dropdown-menu-item>)
              }
            </mtd-dropdown-menu>
          </div>
        </mtd-popover>

        : <fragment>
          {pageCount > 0 &&
            <li
              class={{
                [`${prefix}-item`]: true,
                [`${prefix}-number`]: true,
                [`${prefix}-active`]: currentPage === 1,
              }}
              onClick={this.goTo.bind(null, 1)}
            >
              1
            </li>
          }

          {showPrevMore &&
            <mtd-popover trigger="hover" placement="top" show-arrow={false} popper-class={`${prefix}-simple-popper`}>
              <li
                class={`${prefix}-item ${prefix}-quickprev`}
                onClick={this.quickPrev}
              >
                <mtd-icon name="ellipsis" />
              </li>

              <div slot="content">
                <mtd-dropdown-menu>
                  {getRangeArr(1, pagers[0]).map(pager => <mtd-dropdown-menu-item
                    onClick={this.handleChange.bind(null, pager)}
                    selected={currentPage === pager}
                  >
                    {pager}
                  </mtd-dropdown-menu-item>)
                  }
                </mtd-dropdown-menu>
              </div>
            </mtd-popover>
          }

          {pagers.map(pager =>
            <li
              class={{
                [`${prefix}-item`]: true,
                [`${prefix}-number`]: true,
                [`${prefix}-active`]: currentPage === pager,
              }}
              onClick={this.goTo.bind(null, pager)}
              key={pager}
            >
              {pager}
            </li>)}

          {showNextMore &&
            <mtd-popover trigger="hover" placement="top" show-arrow={false} popper-class={`${prefix}-simple-popper`}>
              <li
                class={`${prefix}-item ${prefix}-quicknext`}
                onClick={this.quickNext}
              >
                <mtd-icon name="ellipsis" />
              </li >

              <div slot="content">
                <mtd-dropdown-menu>
                  {getRangeArr(pagers[pagers.length - 1], pageCount).map(pager => <mtd-dropdown-menu-item
                    onClick={this.handleChange.bind(null, pager)}
                    selected={currentPage === pager}
                  >
                    {pager}
                  </mtd-dropdown-menu-item>)
                  }
                </mtd-dropdown-menu>
              </div>
            </mtd-popover>
          }

          {pageCount > 1 &&
            <li
              onClick={this.goTo.bind(null, pageCount)}
              class={{
                [`${prefix}-item`]: true,
                [`${prefix}-number`]: true,
                [`${prefix}-active`]: currentPage === pageCount,
              }}
            >
              {pageCount}
            </li >
          }
        </fragment >
      }

      < li
        class={
          [
            `${prefix}-item ${prefix}-next ${iconPrefix('right-thick')}`,
            { [`${prefix}-disabled`]: currentPage === pageCount },
          ]}
        onClick={this.next}
      />
    </ul >
  },
})
