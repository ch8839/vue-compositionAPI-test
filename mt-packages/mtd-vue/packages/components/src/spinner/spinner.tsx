import { computed, defineComponent, onMounted, PropType, ref, watch } from '@ss/mtd-adapter'
import { Option } from '@components/option/types'
import useConfig from '@hooks/config'
import { scrollTop } from '@utils/util'
import { isNumber } from '@components/__utils__/type'
import MtdIcon from '@components/icon'

export default defineComponent({
  name: 'Spinner',
  components: {
    MtdIcon,
  },
  props: {
    value: {
      type: Object as PropType<Option>,
    },
    options: {
      type: Array as PropType<Option[]>,
      required: true,
    },
    pageSize: {
      type: Number,
      default: 12,
    },
  },
  emits: ['change', 'click'],
  setup(props, { emit }) {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('spinner'))

    const spinnerRef = ref<HTMLElement | null>(null)

    const isShowPage = computed(() => props.options && props.options.length > props.pageSize)

    onMounted(() => {
      props.value && scroll(props.value.index as number)
    })
    watch(() => props.value, (opt) => {
      opt && scroll(opt.index as number)
    })


    /* Function */
    function handleClick(option: Option) {
      if (option && props.value !== option) {
        emit('change', option)
      }
      emit('click', option)
    }
    function handlePage(num: number) {
      if (props.value && isNumber(props.value.index)) {
        const nextOpt = props.options[props.value.index + num]
        if (nextOpt) {
          scroll(nextOpt.index!)
          emit('change', nextOpt)
        }
      }
    }
    function scroll(index: number) {
      if (spinnerRef.value) {
        const from = spinnerRef.value.scrollTop
        const to = 30 * (index - 6) // -6 是为了居中显示
        scrollTop(spinnerRef.value, from, to, 500)
      }
    }

    return {
      prefix, isShowPage, handleClick, spinnerRef, handlePage,
    }
  },
  render() {
    const { prefix, options, value, isShowPage, pageSize } = this
    return <div class={prefix}>
      {isShowPage &&
        <div
          class={prefix + '-arrow'}
          onClick={this.handlePage.bind(null, -pageSize)}
        >
          <mtd-icon name={'triangle-up'} />
        </div>
      }

      <ul class={[prefix + '-ul']} ref={'spinnerRef'}>
        {options.map(option =>
          <li
            class={{
              [prefix + '-li']: true,
              [prefix + '-li-selected']: option === value,
            }}
            onClick={(e: Event) => {
              e.stopPropagation()
              this.handleClick(option)
            }}
          >
            {option.label}
          </li>,
        )}
      </ul>

      {isShowPage &&
        <div
          class={prefix + '-arrow'}
          onClick={this.handlePage.bind(null, pageSize)}
        >
          <mtd-icon name={'triangle-down'} />
        </div>
      }
    </div>
  },
})