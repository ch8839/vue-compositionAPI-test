import {
  computed,
  defineComponent,
  PropType,
  ref,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import TimeSpinner from './time-spinner'

import { initTimeDate } from '@utils/date'
import { Dayjs } from 'dayjs'

const mergeDateHMS = (
  date: Date,
  hours: number,
  minutes: number,
  seconds: number,
) => {
  const newDate = new Date(date.getTime())
  newDate.setHours(hours)
  newDate.setMinutes(minutes)
  newDate.setSeconds(seconds)
  return newDate
}
const unique = (el: any, i: number, arr: any[]) => arr.indexOf(el) === i
const returnFalse = () => false

interface DisabledHMS {
  disabledHours?: number[],
  disabledMinutes?: number[],
  disabledSeconds?: number[],
}

export default defineComponent({
  name: 'TimePickerPanel',
  components: { TimeSpinner },
  inheritAttrs: true,
  props: {
    steps: {
      type: Array as PropType<number[]>,
      default: () => [],
    },
    format: {
      type: String,
      default: 'HH:mm:ss',
    },
    value: {
      type: Object as PropType<Dayjs>,
    },
    disabledDate: {
      type: Function,
      default: returnFalse,
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
  emits: ['change'],
  setup(props) {
    const config = useConfig()
    const prefixCls = computed(() => config.getPrefixCls('picker-panel'))
    const day = ref<Dayjs>(props.value || initTimeDate())

    return {
      prefixCls, day,
    }
  },
  computed: {
    showSeconds(): boolean {
      return !!(this.format || '').match(/s$/)
    },
    showMinutes(): boolean {
      return !!(this.format || '').match(/m/)
    },
    timeSlots(): number[] {
      if (!this.value) return []
      return ['hour', 'minute', 'second'].map((slot) =>
        (this.day as any)[slot](),
      )
    },
    disabledHMS(): DisabledHMS {
      const disabledTypes = [
        'disabledHours',
        'disabledMinutes',
        'disabledSeconds',
      ]
      if (this.disabledDate === returnFalse || !this.value) {
        const disabled = disabledTypes.reduce((obj, type) => {
          (obj as any)[type] = (this as any)[type]
          return obj
        }, {})
        return disabled
      } else {
        const slots = [24, 60, 60]
        const disabled = ['Hours', 'Minutes', 'Seconds'].map(
          (type) => (this as any)[`disabled${type}`],
        )
        const disabledHMS = disabled.map((preDisabled, j) => {
          const slot = slots[j]
          const toDisable = preDisabled
          for (let i = 0; i < slot; i += this.steps[j] || 1) {
            const hms = this.timeSlots.map((slot, x) => (x === j ? i : slot))
            const testDateTime = (mergeDateHMS as any)(
              this.day.toDate(),
              ...hms,
            )
            if ((this.disabledDate as Function)(testDateTime, true))
              toDisable.push(i)
          }
          return toDisable.filter(unique)
        })
        return disabledTypes.reduce((obj, type, i) => {
          (obj as any)[type] = disabledHMS[i]
          return obj
        }, {})
      }
    },
  },
  watch: {
    value(date: Dayjs) {
      const newVal = date || initTimeDate()
      this.day = newVal.clone()
    },
  },
  methods: {
    handleChange(date: Object, emit = true) {
      let newDay = this.day
      Object.keys(date).forEach((type) => {
        newDay = (newDay as any)[type]((date as any)[type])
      })
      if (emit) this.$emit('change', newDay, true)
    },
  },
  render() {
    const { steps, showSeconds, showMinutes, hideDisabledOptions, timeSlots, disabledHMS, prefixCls } = this
    return <div class={[prefixCls + '-body-wrapper']} onMousedown={(e: Event) => e.preventDefault()}>
      <div class={[prefixCls + '-body']}>
        <div class={[prefixCls + '-content']}>
          <time-spinner
            ref="timeSpinner"
            show-seconds={showSeconds}
            show-minutes={showMinutes}
            steps={steps}
            hours={timeSlots[0]}
            minutes={timeSlots[1]}
            seconds={timeSlots[2]}
            disabled-hours={disabledHMS.disabledHours}
            disabled-minutes={disabledHMS.disabledMinutes}
            disabled-seconds={disabledHMS.disabledSeconds}
            hide-disabled-options={hideDisabledOptions}
            onChange={this.handleChange}
          />
        </div>
      </div>
    </div>
  },
})
