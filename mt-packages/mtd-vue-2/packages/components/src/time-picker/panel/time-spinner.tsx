import {
  computed,
  defineComponent,
  PropType,
  reactive,
  toRefs,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import { firstUpperCase, scrollTop } from '@utils/util'

const timeParts = ['hours', 'minutes', 'seconds']

interface Cell {
  text: number;
  selected?: boolean;
  focused?: boolean;
  hide?: boolean;
  disabled?: boolean;
}
interface CreateCellsOptions {
  disabledNumbers: number[];
  selectedNumber: number;
  focusedNumber: number | boolean;
  hideDisabledOptions: boolean;
}
function createCells(
  step: number,
  count: number,
  options: CreateCellsOptions,
): Cell[] {
  const cells: Cell[] = []
  const {
    disabledNumbers,
    selectedNumber,
    focusedNumber,
    hideDisabledOptions,
  } = options
  for (let i = 0; i < count; i += step) {
    const cell: Cell = {
      text: i,
      focused: i === focusedNumber,
      selected: i === selectedNumber,
    }
    cell.disabled = !!disabledNumbers.length && disabledNumbers.indexOf(i) > -1
    cell.hide = hideDisabledOptions && cell.disabled
    cells.push(cell)
  }
  return cells
}

export default defineComponent({
  name: 'TimeSpinner',
  inheritAttrs: true,
  props: {
    hours: {
      type: [Number],
      default: NaN,
    },
    minutes: {
      type: [Number],
      default: NaN,
    },
    seconds: {
      type: [Number],
      default: NaN,
    },
    showSeconds: {
      type: Boolean,
      default: true,
    },
    showMinutes: {
      type: Boolean,
      default: true,
    },
    steps: {
      type: Array as PropType<Array<number>>,
      default: () => [],
    },
    disabledHours: {
      type: Array as PropType<number[]>,
      default: () => {
        return []
      },
    },
    disabledMinutes: {
      type: Array as PropType<number[]>,
      default: () => {
        return []
      },
    },
    disabledSeconds: {
      type: Array as PropType<number[]>,
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
    const prefixCls = computed(() => config.getPrefixCls('time-picker-cells'))
    const state = reactive({
      spinerSteps: [1, 1, 1].map((one, i) => Math.abs(props.steps[i]) || one),
      isMounted: false,
      focusedColumn: -1, // which column inside the picker
      focusedTime: [0, 0, 0], // the values array into [hh, mm, ss]
    })
    const justHour = computed(() => !(props.showSeconds || props.showMinutes))
    return {
      prefixCls, ...toRefs(state), justHour,
    }
  },
  computed: {
    classes(): any {
      const { prefixCls } = this
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-with-seconds`]: this.showSeconds,
          [`${prefixCls}-with-minutes`]: this.showMinutes,
        },
      ]
    },
    hoursList(): Cell[] {
      return createCells(this.spinerSteps[0], 24, {
        disabledNumbers: this.disabledHours,
        selectedNumber: this.hours,
        focusedNumber: this.focusedColumn === 0 && this.focusedTime[0],
        hideDisabledOptions: this.hideDisabledOptions,
      })
    },
    minutesList(): Cell[] {
      return createCells(this.spinerSteps[1], 60, {
        disabledNumbers: this.disabledMinutes,
        selectedNumber: this.minutes,
        focusedNumber: this.focusedColumn === 1 && this.focusedTime[1],
        hideDisabledOptions: this.hideDisabledOptions,
      })
    },
    secondsList(): Cell[] {
      return createCells(this.spinerSteps[1], 60, {
        disabledNumbers: this.disabledSeconds,
        selectedNumber: this.seconds,
        focusedNumber: this.focusedColumn === 2 && this.focusedTime[2],
        hideDisabledOptions: this.hideDisabledOptions,
      })
    },
  },
  watch: {
    hours(val) {
      if (!this.isMounted) return
      this.scroll(
        'hours',
        this.hoursList.findIndex((obj) => {
          return obj.text === val
        }),
      )
    },
    minutes(val) {
      if (!this.isMounted) return
      this.scroll(
        'minutes',
        this.minutesList.findIndex((obj) => obj.text === val),
      )
    },
    seconds(val) {
      if (!this.isMounted) return
      this.scroll(
        'seconds',
        this.secondsList.findIndex((obj) => obj.text === val),
      )
    },
    focusedTime(updated, old) {
      timeParts.forEach((part, i) => {
        if (updated[i] === old[i] || typeof updated[i] === 'undefined') return
        const valueIndex = (this as any)[`${part}List`].findIndex(
          (obj: Cell) => {
            return obj.text === updated[i]
          },
        )
        this.scroll(part, valueIndex)
      })
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.isMounted = true
      this.updateScroll()
    })
  },
  methods: {
    getCellCls(cell: Cell) {
      const { prefixCls } = this
      return [
        `${prefixCls}-cell`,
        {
          [`${prefixCls}-cell-selected`]: cell.selected,
          [`${prefixCls}-cell-focused`]: cell.focused,
          [`${prefixCls}-cell-disabled`]: cell.disabled,
        },
      ]
    },
    handleClick(type: string, cell: Cell): (() => void) {
      return () => {
        if (cell.disabled) return
        const data = { [type]: cell.text }
        this.emitChange(data)
      }
    },
    emitChange(changes: { [key: string]: number }) {
      this.$emit('change', changes)
    },
    scroll(type: string, index: number) {
      const from = (this.$refs[type] as HTMLElement).scrollTop
      const to = 30 * this.getScrollIndex(type, index)
      scrollTop(this.$refs[type] as HTMLElement, from, to, 500)
    },
    getScrollIndex(type: string, index: number) {
      const Type = firstUpperCase(type)
      const disabled = (this as any)[`disabled${Type}`]
      if (disabled.length && this.hideDisabledOptions) {
        let m_count = 0
        disabled.forEach((item: number) => (item <= index ? m_count++ : ''))
        index -= m_count
      }
      return index
    },
    updateScroll() {
      this.$nextTick(() => {
        timeParts.forEach((type) => {
          (this.$refs[type] as HTMLElement).scrollTop =
            30 *
            ((this as any)[`${type}List`] as Cell[]).findIndex(
              (obj) => obj.text === (this as any)[type],
            )
        })
      })
    },
    formatTime(text: number) {
      return text < 10 ? '0' + text : text
    },
    formatHour(text: number) {
      return (text < 10 ? '0' + text : text) + ':00'
    },
  },
  render() {
    const { classes, hoursList, showMinutes, minutesList, showSeconds, secondsList, prefixCls, justHour } = this
    return <div class={classes}>
      <div class={`${prefixCls}-units`} v-show={!justHour}>
        <div class={`${prefixCls}-unit`}>时</div>
        <div class={`${prefixCls}-unit`} v-show={showMinutes}>分</div>
        <div class={`${prefixCls}-unit`} v-show={showSeconds}>秒</div>
      </div>
      <div class={{
        [`${prefixCls}-list-wrapper`]: true,
        [`${prefixCls}-list-hour-wrapper`]: justHour,
      }}>
        <div class={`${prefixCls}-list`} ref="hours">
          <ul class={`${prefixCls}-ul`}>
            {hoursList.map((item, i) => {
              return <li
                class={this.getCellCls(item)}
                key={i}
                v-show={!item.hide}
                onClick={this.handleClick('hour', item)}
              >
                {justHour ? this.formatHour(item.text) : this.formatTime(item.text)}
              </li>
            })}
          </ul>
        </div>
        <div class={`${prefixCls}-list`} ref="minutes" v-show={showMinutes}>
          <ul class={`${prefixCls}-ul`}>
            {minutesList.map((item, i) => {
              return <li
                class={this.getCellCls(item)}
                key={i}
                v-show={!item.hide}
                onClick={this.handleClick('minute', item)}
              >
                {this.formatTime(item.text)}
              </li>
            })}
          </ul>
        </div >
        <div class={`${prefixCls}-list`} ref="seconds" v-show={showSeconds}>
          <ul class={`${prefixCls}-ul`}>
            {secondsList.map((item, i) => {
              return <li
                class={this.getCellCls(item)}
                key={i}
                v-show={!item.hide}
                onClick={this.handleClick('second', item)}
              >
                {this.formatTime(item.text)}
              </li>
            })}
          </ul>
        </div >
      </div>
    </div >
  },
})

