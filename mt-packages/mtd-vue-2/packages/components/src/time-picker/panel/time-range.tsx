import {
  computed,
  defineComponent,
  PropType,
  ref,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import TimeSpinner from './time-spinner'
import Locale from '../locale'
import MtdButton from '@components/button'
import { initTimeDate } from '@utils/date'
import { Dayjs } from 'dayjs'

export default defineComponent({
  name: 'RangeTimePickerPanel',
  components: {
    MtdButton,
    TimeSpinner,
  },
  inheritAttrs: true,
  props: {
    steps: {
      type: Array,
      default: () => [],
    },
    format: {
      type: String,
      default: 'HH:mm:ss',
    },
    value: {
      type: Array as PropType<Dayjs[]>,
      required: true,
    },
    disabledHours: {
      type: Array,
      default: () => {
        return []
      },
    },
    disabledMinutes: {
      type: Array,
      default: () => {
        return []
      },
    },
    disabledSeconds: {
      type: Array,
      default: () => {
        return []
      },
    },
    hideDisabledOptions: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['change', 'confirm', 'canel'],
  setup() {
    const config = useConfig()
    const prefixCls = computed(() => config.getPrefixCls('picker-panel'))
    const timePrefixCls = computed(() => config.getPrefixCls('time-picker'))
    const dateStart = ref<Dayjs | undefined>(undefined)
    const dateEnd = ref<Dayjs | undefined>(undefined)
    const t = Locale.t

    return {
      prefixCls, timePrefixCls,
      dateStart, dateEnd, t,
    }
  },
  computed: {
    classes(): any[] {
      const { prefixCls, timePrefixCls } = this
      return [
        `${prefixCls}-body-wrapper`,
        `${timePrefixCls}-with-range`,
        {
          [`${timePrefixCls}-with-seconds`]: this.showSeconds,
        },
      ]
    },
    showSeconds(): boolean {
      return !!(this.format || '').match(/s$/)
    },
    showMinutes(): boolean {
      return !!(this.format || '').match(/m/)
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(dates) {
        this.setDates(dates)
      },
    },
  },
  methods: {
    setDates(dates: Dayjs[]) {
      const [dateStart, dateEnd] = dates.slice()
      this.dateStart = dateStart
      this.dateEnd = dateEnd
    },
    handleConfirm() {
      this.$emit('confirm', [this.dateStart, this.dateEnd])
    },
    handleCancel() {
      this.setDates(this.value)
      this.$emit('canel')
    },
    handleChange(start: Object, end: Object) {
      let dateStart = this.dateStart || initTimeDate()
      let dateEnd = this.dateEnd || initTimeDate()

      // set dateStart
      Object.keys(start).forEach((type) => {
        dateStart = (dateStart as any)[type]((start as any)[type])
      })

      // set dateEnd
      Object.keys(end).forEach((type) => {
        dateEnd = (dateEnd as any)[type]((end as any)[type])
      })
      this.dateStart = dateStart
      this.dateEnd = dateEnd
      this.$emit('change', [dateStart, dateEnd])
    },
    handleStartChange(date: Object) {
      this.handleChange(date, {})
    },
    handleEndChange(date: Object) {
      this.handleChange({}, date)
    },
    updateScroll() {
      (this.$refs.timeSpinner as any).updateScroll();
      (this.$refs.timeSpinnerEnd as any).updateScroll()
    },
  },
  render() {
    const {
      classes, steps, showSeconds, showMinutes, dateStart, dateEnd, prefixCls, timePrefixCls,
      disabledHours, disabledMinutes, disabledSeconds, hideDisabledOptions,
    } = this
    return <div class={classes} onMousedown={(e: Event) => e.preventDefault()}>
      <div class={[prefixCls + '-body', prefixCls + '-multiple-body']}>
        <div
          class={[
            prefixCls + '-content',
            prefixCls + '-multiple-content',
            prefixCls + '-content-left',
          ]}
        >
          <div
            class={[
              timePrefixCls + '-header',
              timePrefixCls + '-multiple-header',
            ]}
          >
            {this.t('el.datepicker.startTime')}
          </div>
          <div class={[prefixCls + '-content', prefixCls + '-spinner-wrapper']}>
            <time-spinner
              ref="timeSpinner"
              steps={steps}
              show-seconds={showSeconds}
              show-minutes={showMinutes}
              hours={dateStart && dateStart.hour()}
              minutes={dateStart && dateStart.minute()}
              seconds={dateStart && dateStart.second()}
              disabled-hours={disabledHours}
              disabled-minutes={disabledMinutes}
              disabled-seconds={disabledSeconds}
              hide-disabled-options={hideDisabledOptions}
              onChange={this.handleStartChange}
            />
          </div>
        </div>
        <div
          class={[
            prefixCls + '-content',
            prefixCls + '-multiple-content',
            prefixCls + '-content-right',
          ]}
        >
          <div
            class={[
              timePrefixCls + '-header',
              timePrefixCls + '-multiple-header',
            ]}
          >
            {this.t('el.datepicker.endTime')}
          </div>
          <div class={[prefixCls + '-content', prefixCls + '-spinner-wrapper']}>
            <time-spinner
              ref="timeSpinnerEnd"
              steps={steps}
              show-seconds={showSeconds}
              show-minutes={showMinutes}
              hours={dateEnd && dateEnd.hour()}
              minutes={dateEnd && dateEnd.minute()}
              seconds={dateEnd && dateEnd.second()}
              disabled-hours={disabledHours}
              disabled-minutes={disabledMinutes}
              disabled-seconds={disabledSeconds}
              hide-disabled-options={hideDisabledOptions}
              onChange={this.handleEndChange}
            />
          </div>
        </div >
      </div >
      <div class={[prefixCls + '-footer']}>
        <mtd-button ghost class="btn cancelbtn" size="small" onClick={this.handleCancel}>
          取消
        </mtd-button>
        <mtd-button type="primary" class="btn" size="small" onClick={this.handleConfirm} >
          确定
        </mtd-button>
      </div >
    </div >
  },
})
