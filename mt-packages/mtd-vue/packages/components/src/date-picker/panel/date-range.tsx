import { computed, defineComponent, PropType, reactive, ref, toRefs, watch, classNames, styles } from '@ss/mtd-adapter'

import DateTable from '../base/date-table'
import YearTable from '../base/year-table'
import MonthTable from '../base/month-table'
import TimePicker from '@components/time-picker'
import Confirm from '../base/confirm'
import PickerInput from '@components/time-picker/time-picker-input'

import DatePickerPanel from './date'
import DatePickerWeekPanel from './week'

import {
  DEFAULT_FORMATS,
  TYPE_VALUE_RESOLVER_MAP,
  initTimeDate,
  formatDateLabels,
  max,
} from '@utils/date'
import datePanelLabel from './date-panel-label'

import { withProps, withEmits, usePanelMixin, PanelMixinProps, PanelMixinCtx } from './usePanelMixin'
import DateProps from './date-panel-props'
import locale from '@components/time-picker/locale'
import dayjs, { Dayjs } from 'dayjs'
import { useAttrs } from '@components/hooks/pass-through'
import { ICell } from '../types'
import { useConfig } from '@components/config-provider'
import { isArray } from '@components/__utils__/type'

const dateSorter = (a: Dayjs | undefined, b: Dayjs | undefined) => {
  if (!a || !b) return 0
  return a.toDate().getTime() - b.toDate().getTime()
}

type PanelType = 'left' | 'right';

export default defineComponent({
  name: 'RangeDatePickerPanel',
  components: {
    DateTable,
    YearTable,
    MonthTable,
    TimePicker,
    Confirm,
    datePanelLabel,
    PickerInput,
    DatePickerPanel,
    DatePickerWeekPanel,
  },
  inheritAttrs: false,
  props: {
    ...withProps,
    ...DateProps,
    value: {
      type: Array as PropType<Dayjs[]>,
      default: () => {
        return []
      },
    },
    splitPanels: {
      type: Boolean,
      default: false,
    },
    defaultTime: {
      type: Array as PropType<string[]>,
      default: () => {
        return []
      },
    },
    visible: Boolean,
    focusSide: String,
    weekStart: {
      type: Number,
      default: 1,
      validator: (v: number) => {
        return v >= 0 && v <= 6
      },
    },
  },
  emits: [...withEmits, 'change', 'pick-range', 'focusOtherSide'],
  setup(props, ctx) {
    const config = useConfig()
    const [minDate, maxDate] = props.value.map((date) => date || initTimeDate())
    const leftPanelDate = props.startDate || minDate || dayjs()
    const timePickerAttrs = useAttrs(props.timePickerOptions)

    const prefixCls = computed(() => config.getPrefixCls('picker-panel'))
    const datePrefixCls = computed(() => config.getPrefixCls('date-picker'))

    const state = reactive({
      rangeState: { //from 的值一定比 to 早
        from: props.value[0] as Dayjs | undefined,
        to: props.value[1] as Dayjs | undefined,
        selecting: minDate && !maxDate,
      },
      currentView: props.selectionMode || 'range',
      leftPickerTable: `${props.selectionMode}-table`,
      rightPickerTable: `${props.selectionMode}-table`,
      leftPanelDate: leftPanelDate,
      rightPanelDate: leftPanelDate,
      t: locale.t,
    })

    const datetimerangeState = {
      datetimerangeFlag: ref(false),
      isShowLeftTable: computed(() => !(props.type === 'datetimerange' && props.focusSide === 'right')),
      isShowRightTable: computed(() => !(props.type === 'datetimerange' && props.focusSide === 'left')),
      _splitPanels: computed(() => props.type === 'datetimerange' || props.splitPanels),
    }

    // use in datetimerange
    const hasValue = computed(() => isArray(props.value) && !!props.value[0] && !!props.value[1])
    const rangePass = ref(true)
    watch(hasValue, (v: boolean) => {
      rangePass.value = v
    }, { immediate: true })

    const isNeedRange = computed(() => {
      if (props.type === 'datetimerange') {
        if (hasValue.value || rangePass.value) {
          return true
        } else {
          return false
        }
      } else {
        return true
      }
    })

    return {
      timePickerAttrs, hasValue, isNeedRange, rangePass,
      prefixCls, datePrefixCls,
      ...datetimerangeState,
      ...toRefs(state),
      ...usePanelMixin(props as PanelMixinProps, ctx as PanelMixinCtx),
    }
  },

  computed: {
    classes(): any[] {
      const { prefixCls, datePrefixCls } = this
      return [
        `${prefixCls}-body-wrapper`,
        `${datePrefixCls}-with-range`,
        {
          [`${prefixCls}-with-sidebar`]: this.shortcuts.length,
          [`${datePrefixCls}-with-week-numbers`]: this.showWeekNumbers,
        },
      ]
    },
    panelBodyClasses(): any[] {
      const { prefixCls } = this
      return [
        prefixCls + '-body',
        {
          [prefixCls + '-body-time']: this.showTime,
          [prefixCls + '-body-date']: !this.showTime,
        },
      ]
    },
    leftDatePanelView(): string {
      return this.leftPickerTable.split('-').shift()!
    },
    rightDatePanelView(): string {
      return this.rightPickerTable.split('-').shift()!
    },
    timeDisabled(): boolean {
      return !(this.value[0] && this.value[1])
    },
    preSelecting(): { left: boolean; right: boolean } {
      const tableType = `${this.currentView}-table`

      return {
        left: this.leftPickerTable !== tableType,
        right: this.rightPickerTable !== tableType,
      }
    },
    panelPickerHandlers(): { left: Function; right: Function } {
      return {
        left: this.preSelecting.left
          ? this.handlePreSelection.bind(this, 'left')
          : this.handleRangePick,
        right: this.preSelecting.right
          ? this.handlePreSelection.bind(this, 'right')
          : this.handleRangePick,
      }
    },
    leftTime(): Date | undefined {
      return this.value[0] ? this.value[0].toDate() : undefined
    },
    leftInput(): string | number {
      return this.formatDate(this.value[0]) || ''
      //   : '';
    },
    rightTime(): Date | undefined {
      return this.value[1] ? this.value[1].toDate() : undefined
    },
    rightInput(): string | number {
      return this.formatDate(this.value[1]) || ''
      //   : '';
    },
    isWeek() {
      return (this as any).type === 'weekrange'
    },
  },
  watch: {
    value(newVal: Dayjs[]) {
      this.handleValueChange(newVal)
    },
    currentView(currentView) {
      const leftMonth = this.leftPanelDate.month()
      const rightMonth = this.rightPanelDate.month()
      const isSameYear =
        this.leftPanelDate.year() === this.rightPanelDate.year()

      if (currentView === 'date' && isSameYear && leftMonth === rightMonth) {
        this.changePanelDate('right', 'month', 1)
      }
      if (currentView === 'month' && isSameYear) {
        this.changePanelDate('right', 'year', 1)
      }
      if (currentView === 'year' && isSameYear) {
        this.changePanelDate('right', 'year', 10)
      }
    },
    selectionMode(type) {
      this.currentView = type || 'range'
    },
    // focusedDate (date) {
    //   this.setPanelDates(date || new Date());
    // },
  },
  created() {
    // 根据当前值设置左右面板
    this.setPanelDates(this.leftPanelDate)
  },
  methods: {
    // eslint-disable-next-line
    handleValueChange(newVal: Dayjs[]) {

      this.rangeState = {
        from: this.value[0],
        to: this.value[1],
        selecting: false,
      }

      // set panels positioning
      this.setPanelDates(this.startDate || this.value[0] || dayjs())
      // this.leftPanelDate = newVal[0]
      // this.rightPanelDate = newVal[1]

    },
    reset() {
      this.currentView = this.selectionMode
      this.leftPickerTable = `${this.currentView}-table`
      this.rightPickerTable = `${this.currentView}-table`
    },
    resetData() {
      this.rangeState = {
        from: this.value[0],
        to: this.value[1],
        selecting: false,
      }
    },
    setPanelDates(leftPanelDate: Dayjs) {
      this.leftPanelDate = leftPanelDate
      let rightPanelDate
      if (this.type !== 'datetimerange') {
        if (this.currentView === 'year') {
          rightPanelDate = leftPanelDate.add(12, 'year')
        } else if (['month', 'quarter', 'halfyear'].indexOf(this.currentView) > -1) {
          rightPanelDate = leftPanelDate.add(1, 'year')
        } else {
          rightPanelDate = leftPanelDate.add(1, 'month')
        }

        this.rightPanelDate = this._splitPanels && this.value[1]
          ? max(this.value[1], rightPanelDate)
          : rightPanelDate
      } else {
        this.value[1] ? this.rightPanelDate = this.value[1] : this.leftPanelDate
      }

    },
    panelLabelConfig(direction: PanelType) {
      const locale = this.t('el.locale')
      const datePanelLabel = this.t('el.datepicker.datePanelLabel')
      const handler = (type: string) => {
        const fn =
          type === 'month' ? this.showMonthPicker : this.showYearPicker
        return () => fn(direction)
      }

      const date = (this as any)[`${direction}PanelDate`]
      const { labels, separator } = formatDateLabels(
        locale,
        datePanelLabel,
        date,
      )

      return {
        separator: separator,
        labels: labels.map((obj: any) => {
          obj.handler = handler(obj.type)
          return obj
        }),
      }
    },
    prevYear(panel: PanelType) {
      const increment = this.currentView === 'year' ? -10 : -1
      this.changePanelDate(panel, 'year', increment)
    },
    nextYear(panel: PanelType) {
      const increment = this.currentView === 'year' ? 10 : 1
      this.changePanelDate(panel, 'year', increment)
    },
    prevMonth(panel: PanelType) {
      this.changePanelDate(panel, 'month', -1)
    },
    nextMonth(panel: PanelType) {
      this.changePanelDate(panel, 'month', 1)
    },
    changePanelDate(
      panel: PanelType,
      type: 'year' | 'month' | 'date',
      increment: number,
      updateOtherPanel = true,
    ) {
      const current = (this as any)[`${panel}PanelDate`];
      (this as any)[`${panel}PanelDate`] = current.add(increment, type)

      if (!updateOtherPanel) return

      if (this._splitPanels) {
        // change other panel if dates overlap
        const otherPanel = panel === 'left' ? 'right' : 'left'
        if (panel === 'left' && this.leftPanelDate >= this.rightPanelDate) {
          this.changePanelDate(otherPanel, type, 1)
        }
        if (panel === 'right' && this.rightPanelDate <= this.leftPanelDate) {
          this.changePanelDate(otherPanel, type, -1)
        }
      } else {
        // keep the panels together
        const otherPanel = panel === 'left' ? 'right' : 'left'
        const otherCurrent = (this as any)[`${otherPanel}PanelDate`];
        (this as any)[`${otherPanel}PanelDate`] = otherCurrent.add(
          increment,
          type,
        )
      }
    },
    showYearPicker(panel: PanelType) {
      (this as any)[`${panel}PickerTable`] = 'year-table'
    },
    showMonthPicker(panel: PanelType) {
      (this as any)[`${panel}PickerTable`] = 'month-table'
    },
    handlePreSelection(panel: PanelType, value: Dayjs) {
      (this as any)[`${panel}PanelDate`] = value
      const currentViewType = (this as any)[`${panel}PickerTable`]
      if (currentViewType === 'year-table') {
        (this as any)[`${panel}PickerTable`] = 'month-table'
      } else {
        (this as any)[`${panel}PickerTable`] = `${this.currentView}-table`
      }

      if (!this._splitPanels) {
        const otherPanel = panel === 'left' ? 'right' : 'left';
        (this as any)[`${otherPanel}PanelDate`] = value
        this.changePanelDate(otherPanel, 'month', 1, false)
      }
    },

    setDefaultTime(day: Dayjs, oldDay?: Dayjs, defaultTime?: string) {
      const time = (defaultTime || '0:0:0').split(':')
      const hours = oldDay ? oldDay.hour() : time[0]
      const mins = oldDay ? oldDay.minute() : time[1]
      const sec = oldDay ? oldDay.second() : time[2]
      return day
        .hour(hours as number)
        .minute(mins as number)
        .second(sec as number)
        .millisecond(0)
    },

    handleRangePick(val: Dayjs, isEmitChange = false) {

      if (this.type === 'datetimerange') {
        this.handleRangePickDatetime(val, isEmitChange)
        return
      }

      if (this.rangeState.selecting) {
        const [minDate, maxDate] = [this.rangeState.from!, val].sort(
          dateSorter,
        )
        const dates = [minDate, maxDate].map((date, i) => {
          return this.setDefaultTime(
            date,
            this.value[i],
            this.defaultTime[i],
          )
        })
        this.rangeState = {
          from: dates[0],
          to: dates[1],
          selecting: false,
        }

        this.$emit('change', dates)

      } else {
        val = this.setDefaultTime(val, this.value[0], this.defaultTime[0])

        this.rangeState = {
          from: val,
          to: undefined,
          selecting: true,
        }
        this.$emit('pick-range', [val])
      }
    },

    handleRangePickDatetime(val: Dayjs, isEmitChange = false) {

      // from 是另外一个未打开面板的值
      /* if (!this.rangeState.from) {
        val = this.setDefaultTime(val, this.value[0], this.defaultTime[0])

        this.rangeState = {
          from: val,
          to: undefined,
          selecting: true,
        }
        this.$emit('pick-range', [val])
      } else { */
      if (isEmitChange) {
        if (!this.rangeState.from && !this.rangeState.to) {
          const now = dayjs()
          this.rangeState = {
            from: now,
            to: now,
            selecting: false,
          }
        }
        this.$emit('change', [this.rangeState.from, this.rangeState.to])
      }

      if (this.focusSide === 'left') {
        const to = this.rangeState.to
        if (to) {
          this.rangeState = {
            from: to,
            to: undefined,
            selecting: true,
          }
        } else {
          this.rangeState = {
            from: val,
            to: undefined,
            selecting: true,
          }
        }
      }



      if (!this.isNeedRange) {
        return
      }

      this.rangeState.to = val

      const [minDate, maxDate] = [this.rangeState.from!, this.rangeState.to!].sort(
        dateSorter,
      )
      const dates = [minDate, maxDate]
      this.rangeState = {
        from: dates[0],
        to: dates[1],
        selecting: false,
      }

    },
    handleChangeRange(val: Dayjs) {
      if (!this.isNeedRange) {
        return
      }
      this.rangeState.to = val
    },

    hanldeLeftTimeChange(time: Date) {

      const left = this.rangeState.from!
      const hours = time ? time.getHours() : 0
      const mins = time ? time.getMinutes() : 0
      const sec = time ? time.getSeconds() : 0
      const from = left.hour(hours).minute(mins).second(sec)
      // this.rangeState.from = from;
      let to = this.rangeState.to
      if (to && from.isAfter(to)) {
        to = from.clone()
      }

      this.$emit('change', [from, to])
    },
    hanldeRightTimeChange(time: Date) {

      const right = this.rangeState.to!
      const hours = time ? time.getHours() : 0
      const mins = time ? time.getMinutes() : 0
      const sec = time ? time.getSeconds() : 0
      const to = right.hour(hours).minute(mins).second(sec)
      let from = this.rangeState.from!
      if (from.isAfter(to)) {
        from = to.clone()
      }
      this.$emit('change', [from, to])
    },
    formatDate(
      val: Dayjs | undefined,
      format?: string,
      options?: any,
    ): string | number | undefined {
      const type = 'date'
      const defaultFormat = DEFAULT_FORMATS[type]
      const f = (format || defaultFormat).split(' ')[0]
      const defaultOption = { weekStart: this.weekStart }
      const formatter = (
        TYPE_VALUE_RESOLVER_MAP[type] || TYPE_VALUE_RESOLVER_MAP['default']
      ).formatter
      return formatter(val && [val], f, options || defaultOption)
    },

    handleConfirmInRange(date: Dayjs) {

      if (!this.isNeedRange) {
        // 切换到另外一个面板,同时解锁range功能
        this.rangePass = true
        this.$emit('focusOtherSide')
      } else {
        this.handleRangePick(date, true)
      }
    },

    handleCancel() {
      this.$emit('cancel')
    },

  },
  render() {
    const {
      $slots,
      classes, shortcuts, panelBodyClasses, leftPanelDate, value, showWeekNumbers, rangeState,
      disabledDate, rightPanelDate, type, selectionMode, isWeek,
      isShowLeftTable, isShowRightTable, prefixCls, weekStart, isNeedRange,
    } = this

    const CompPanel = isWeek ? 'date-picker-week-panel' : 'date-picker-panel'

    const $renderCell = this.$scopedSlots.cell
    return <div
      class={classNames(this, classes)}
      style={styles(this)}
      onMousedown={(e: Event) => e.preventDefault()}>
      {(shortcuts.length || $slots.shortcuts) && <div
        class={[prefixCls + '-sidebar']}
      >
        {$slots.shortcuts || shortcuts.map((shortcut) => <div
          class={[prefixCls + '-shortcut']}
          key={shortcut.text}
          onClick={() => this.handleShortcutClick(shortcut)}
        >
          {shortcut.text}
        </div>)}
      </div>}
      <div class={panelBodyClasses}>
        {/* 左面板 */}
        <div class={[prefixCls + '-content', prefixCls + '-content-left']}>
          <CompPanel
            //table-date={leftPanelDate}
            week-start={weekStart}
            v-show={isShowLeftTable}
            focused-date={leftPanelDate}
            value={value}
            selection-mode={selectionMode}
            range={isNeedRange}
            range-side="left"
            type={type}
            disabled-date={disabledDate}
            range-state={rangeState}
            show-week-numbers={showWeekNumbers}
            onConfirm={this.handleConfirmInRange}
            onCancel={this.handleCancel}
            onChange={this.panelPickerHandlers.left as any}
            onRange={this.handleChangeRange}
            scopedSlots={{
              cell: (scope: { cell: ICell }) => {
                return $renderCell && $renderCell({
                  cell: scope.cell,
                })
              },
            }}
          />
        </div>

        {/* 右面板 */}
        <div class={[prefixCls + '-content', prefixCls + '-content-right']}>
          <CompPanel
            v-show={isShowRightTable}
            week-start={weekStart}
            type={type}
            //table-date={rightPanelDate}
            focused-date={rightPanelDate}
            value={value}
            selection-mode={selectionMode}
            range={isNeedRange}
            range-side="right"
            disabled-date={disabledDate}
            range-state={rangeState}
            show-week-numbers={showWeekNumbers}
            onConfirm={this.handleConfirmInRange}
            onCancel={this.handleCancel}
            onChange={this.panelPickerHandlers.right as any}
            onRange={this.handleChangeRange}
            scopedSlots={{
              cell: (scope: { cell: ICell }) => {
                return $renderCell && $renderCell({
                  cell: scope.cell,
                })
              },
            }}
          />
        </div>
      </div>
    </div >
  },
})
