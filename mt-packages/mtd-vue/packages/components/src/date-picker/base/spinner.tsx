import { computed, defineComponent, PropType, ref } from '@ss/mtd-adapter'
import Spinner from '@components/spinner'
import { Option } from '@components/option/types'
import dayjs from 'dayjs'
import { useAllAttrs } from '@components/hooks/pass-through'

type DatePickerSpinnerType = 'month' | 'year'

export default defineComponent({
  name: 'DatePickerSpinner',
  components: {
    Spinner,
  },
  props: {
    type: {
      type: String as PropType<DatePickerSpinnerType>,
      required: true,
    },
    defaultMonth: Number,
    defaultYear: Number,
  },
  emits: ['change'],
  setup(props, ctx) {
    const allAttrs = useAllAttrs(ctx)

    const isYearType = computed(() => props.type === 'year')

    const option = ref<Option | undefined>()
    const options = ref<Option[]>([])
    const month = ref<number>(props.defaultMonth || dayjs().month())
    const year = ref<number>(props.defaultYear || dayjs().year())

    /* Created */
    init()

    /* Function */
    function initMonths() {
      const months: Option[] = []
      for (let i = 1; i <= 12; i++) {
        months.push({
          value: i - 1,
          label: `${i} 月`,
          index: i - 1,
        })
      }
      return months
    }
    function initYears() {
      const years: Option[] = []
      for (let i = year.value - 200; i < year.value + 200; i++) {
        years.push({
          value: i,
          label: `${i} 年`,
          index: i - (year.value - 200),
        })
      }
      return years
    }
    function init() {
      if (isYearType.value) {
        options.value = initYears()
        option.value = options.value.find(opt => {
          return opt.value === year.value
        })
      } else {
        options.value = initMonths()
        option.value = options.value.find(opt => {
          return opt.value === month.value
        })
      }
    }
    function handleChange(opt: Option) {
      option.value = opt
      ctx.emit('change', opt.value, props.type)
    }

    return {
      option, options, allAttrs, handleChange,
    }
  },
  render() {
    const { option, options, allAttrs } = this
    delete allAttrs.on['change'] // 🤡
    return <Spinner
      {...allAttrs}
      value={option}
      options={options}
      onChange={this.handleChange}
    />
  },
})
