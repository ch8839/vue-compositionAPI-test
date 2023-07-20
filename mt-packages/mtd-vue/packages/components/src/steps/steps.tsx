import {
  defineComponent,
  PropType,
  computed,
  ref,
  onMounted,
  onUpdated,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import useProvide from './useProvide'
import vueInstance from '@components/hooks/instance'
import { Step, StepType } from './types'
import { getChildInstanceList } from '@utils/vnode'

export default defineComponent({
  name: 'MtdSteps',
  inheritAttrs: true,
  model: {
    prop: 'active',
    event: 'update:active',
  },
  props: {
    size: String,
    dot: {
      type: Boolean,
      default: false,
    },
    space: [String, Number],
    direction: {
      type: String,
      default: 'horizontal',
    },
    active: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: 'process',
    },
    type: {
      type: String as PropType<StepType>,
      default: 'center',
    },
    simple: Boolean,
  },
  emits: [],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setup(props, { emit }) {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('steps'))
    const ins = vueInstance()

    const stepList = ref<Step[]>([])

    const { provideSteps, provideStepList } = useProvide()
    provideSteps(ins)
    provideStepList(stepList)

    onMounted(() => {
      updateStepList()
    })
    onUpdated(() => {
      updateStepList()
    })

    function updateActive(value: number) {
      emit('update:active', value)
    }

    // @Methods
    function updateStepList() {
      const stepChildren = getChildInstanceList(ins, ['MtdStep']) as any[]
      stepList.value = stepChildren.map((step, index) => {
        (step as Step).setIndex(index)
        return step
      })
    }

    return {
      prefix, stepList, updateActive,
    }
  },
  render() {
    const {
      prefix, space, size, type, direction,
    } = this
    return <div
      style={{ 'flex-wrap': space ? 'wrap' : 'nowrap' }}
      class={[prefix, {
        [`${prefix}-${direction}`]: direction,
        [`${prefix}-${size}`]: size,
        [`${prefix}-right`]: type !== 'center',
        [`${prefix}-nav`]: type === 'navigation',
      }]}>
      {this.$slots.default}
    </div>
  },
})

