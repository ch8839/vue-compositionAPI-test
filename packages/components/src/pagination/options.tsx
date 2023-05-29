import {
  defineComponent,
  computed,
  useResetAttrs,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import MtdSelect from '@components/select'
import MtdOption from '@components/option'

export default defineComponent({
  name: 'PaginationOptions',
  components: {
    MtdSelect,
    MtdOption,
  },
  inheritAttrs: true,
  props: {
    pageSizeOptions: Array,
    pageSize: Number,
    size: {
      type: String,
    },
    selectProps: {
      type: Object,
      default: () => { },
    },
  },
  emits: ['change'],
  setup(props, { emit }) {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('pagination-options'))

    const restAttrs = useResetAttrs(props.selectProps)

    const handleChange = (val: any) => emit('change', val)

    return {
      prefix, restAttrs, handleChange,
    }

  },
  render() {
    const {
      prefix, restAttrs, pageSize, size, pageSizeOptions,
    } = this
    return <mtd-select
      {...restAttrs}
      class={prefix}
      modelValue={pageSize}
      size={size}
      onChange={this.handleChange}
      placeholder="请选择"
      style={'margin-left: 12px'}
    >
      {pageSizeOptions?.map(item => <mtd-option
        key={item}
        label={item + '条/页'}
        value={item}
      />)}
    </mtd-select>
  },
})
