
import { computed, defineComponent, inject, PropType, ref, vSlots } from '@ss/mtd-adapter'
import MtdPopover from '@components/popover'
import DatePickerSpinner from '../base/spinner'
import useConfig from '@hooks/config'
import { ProvideKey } from '../provide'
import MtdIcon from '@components/icon'
import { DatePickerType } from '../types'

export default defineComponent({
  components: {
    MtdPopover,
    DatePickerSpinner,
    MtdIcon,
  },
  inheritAttrs: true,
  props: {
    datePanelLabel: Object,
    currentView: String,
    datePrefixCls: String,
    type: {
      type: String as PropType<DatePickerType>,
      required: true,
    },
  },
  setup(props) {

    const YEAR_SPAN = 11
    const yearLabel = computed(() => {
      const result = props.datePanelLabel?.labels[0].label // xxxx年
      if ((props.type === 'year' || props.type === 'yearrange') && result) {
        const startYear = Math.floor(parseInt(result) / 10) * 10
        return `${startYear}年 ~ ${startYear + YEAR_SPAN}年`
      }
      return result
    })

    const datePicker = inject(ProvideKey, {} as {
      setHoldOpen: (val: boolean) => void
      appendToContainer: any,
      getPopupContainer: any,
    })
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('date-picker'))
    const visibleYear = ref(false)
    const visibleMonth = ref(false)

    const appendToContainer = datePicker.appendToContainer
    const getPopupContainer = datePicker.getPopupContainer

    return {
      appendToContainer,getPopupContainer,
      visibleYear, visibleMonth, prefix, datePicker, yearLabel,
    }
  },
  methods: {
    setHoldOpen(val: boolean) {
      this.datePicker.setHoldOpen && this.datePicker.setHoldOpen(val)
    },
    handleClickLabel(type: string) {
      if (type === 'year') {
        //this.datePanelLabel?.labels[0].handler()
        this.visibleYear = !this.visibleYear
        this.setHoldOpen(this.visibleYear)
      } else {
        //this.datePanelLabel?.labels[1].handler()
        this.visibleMonth = !this.visibleMonth
        this.setHoldOpen(this.visibleMonth)
      }
    },
    handleClickSpinnerItem() {
      this.visibleYear = false
      this.visibleMonth = false
      this.setHoldOpen(false)
    },
    handleChange(val: number, type: string) {
      if (type === 'year') {
        this.datePanelLabel?.labels[0].handler(val)
      } else {
        this.datePanelLabel?.labels[1].handler(val)
      }
    },
    handleClickoutside() {
      this.visibleYear = false
      this.visibleMonth = false
      this.setHoldOpen(false)
    },
  },
  render() {
    const { 
      appendToContainer,getPopupContainer,
      prefix, currentView, datePrefixCls, datePanelLabel, yearLabel,
    } = this

    const MtdDatePickerSpinner = DatePickerSpinner as any

    const yearSlots = {
      content: () => <div class="demo-popover-content">
        <MtdDatePickerSpinner
          type="year"
          onClick={this.handleClickSpinnerItem}
          onChange={this.handleChange}
        />
      </div>,
    }

    const monthSlots = {
      content: () => <div class="demo-popover-content">
        <MtdDatePickerSpinner
          type="month"
          onClick={this.handleClickSpinnerItem}
          onChange={this.handleChange}
        />
      </div>,
    }

    return <span class={`${prefix}-current`}>

      {/* 展示年的选择 */}
      <mtd-popover
        trigger="click"
        show-arrow={false}
        placement="bottom"
        visible={this.visibleYear}
        ref={'spinneryearPopperRef'}
        popper-class={`${prefix}-spinner-popper`}
        onClickoutside={this.handleClickoutside}
        v-slots={yearSlots}
        {...vSlots(yearSlots)}
        append-to-container={appendToContainer}
        get-popup-container={getPopupContainer}
      >
        {datePanelLabel && <span
          v-show={datePanelLabel.labels[0].type === 'year' || currentView === 'date'}
          class={[datePrefixCls + '-header-label']}
          onClick={() => this.handleClickLabel(datePanelLabel.labels[0].type)}
        >
          {yearLabel}
          <mtd-icon name="sort" />
        </span>
        }
      </mtd-popover>

      {datePanelLabel && currentView === 'date' && <span>
        {datePanelLabel.separator}
      </span>}

      {/* 展示月的选择 */}
      <mtd-popover
        trigger="click"
        show-arrow={false}
        placement="bottom"
        visible={this.visibleMonth}
        ref={'spinnerMonthPopperRef'}
        popper-class={`${prefix}-spinner-popper`}
        onClickoutside={this.handleClickoutside}
        v-slots={monthSlots}
        {...vSlots(monthSlots)}
        append-to-container={appendToContainer}
        get-popup-container={getPopupContainer}
      >
        {datePanelLabel && <span
          v-show={datePanelLabel.labels[1].type === 'year' || currentView === 'date'}
          class={[datePrefixCls + '-header-label']}
          onClick={() => this.handleClickLabel(datePanelLabel.labels[1].type)}
        > {datePanelLabel.labels[1].label}
          <mtd-icon name="sort" />
        </span>
        }
      </mtd-popover>

    </span >
  },
})
