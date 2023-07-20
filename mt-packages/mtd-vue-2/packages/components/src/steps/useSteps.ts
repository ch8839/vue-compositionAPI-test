import { computed, Ref, reactive } from '@ss/mtd-adapter'
import useProvide from './useProvide'

export function useSteps(props: any, ins: {
  index: Ref<number>
}) {
  const { index } = ins

  const { injectSteps } = useProvide()
  const steps = injectSteps()!

  const internalStatus = computed(() => {
    if (index.value > -1) {
      const val = steps ? steps.active : -1
      if (index.value < val) {
        return 'finish'
      } else if (index.value === val) {
        return steps?.status || 'process'
      } else if (index.value > val) {
        return 'wait'
      }
    }
    return ''
  })

  const currentStatus = computed(() => props.status || internalStatus.value)
  const space = computed(() => steps.space)
  const direction = computed(() => steps.direction)
  const dot = computed(() => steps.dot)
  const type = computed(() => steps.type)
  const stepList = computed(() => steps.stepList)

  function updateActive(v: number) {
    steps.updateActive(v)
  }

  const state = reactive({
    m_status: currentStatus,
    space: space,
    direction: direction,
    dot: dot,
    stepList: stepList,
    type: type,
    updateActive,
  })

  return state
}
