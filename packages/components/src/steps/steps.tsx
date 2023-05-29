import {
  defineComponent,
  PropType,
  computed,
  ref,
  onMounted,
  onUpdated,
  vueInstance,
  getSlotsInRender,
  getChildInsList,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import useProvide from './useProvide'

import { IStep, StepType } from '@components/step/types'

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
  emits: ['update:active'],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setup(props, { emit }) {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('steps'))
    const ins = vueInstance()

    const stepList = ref<IStep[]>([])

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
      const stepChildren = getChildInsList(ins, ['MtdStep']) as unknown as IStep[]
      stepList.value = stepChildren.map((step, index) => {
        step.setIndex(index)
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
      {getSlotsInRender(this)}
    </div>
  },
})

