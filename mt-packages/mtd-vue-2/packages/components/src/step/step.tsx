import {
  defineComponent,
  computed,
  ref,
  toRefs,
  getSlotsInRender,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import { useSteps } from '@components/steps/useSteps'
import MtdIcon from '@components/icon'

export default defineComponent({
  name: 'MtdStep',
  components: {
    MtdIcon,
  },
  inheritAttrs: true,
  props: {
    title: String,
    icon: String,
    description: String,
    status: String,
    percentage: {
      type: Number,
    },
  },
  emits: [],
  setup(props) {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('step'))
    const iconPrefix = config.getIconCls

    const index = ref<number>(-1) // use in steps, edited by steps

    const useStepsHook = useSteps(props, {
      index,
    })

    //@Computed
    const stepStyle = computed(() => {
      const size = useStepsHook.space
      const space = (typeof size === 'number') ? size + 'px' : size
      if (useStepsHook.direction === 'vertical') {
        return { height: space }
      }
      return { width: space }
    })
    const currentIcon = computed(() => {
      if (props.icon) {
        return iconPrefix(props.icon)
      }
      switch (useStepsHook.m_status) {
        case 'error':
          return iconPrefix('error')
        case 'cancel':
          return iconPrefix('warning-circle-o')
        case 'finish':
          return iconPrefix('success-o')
        default:
          break
      }
      return undefined
    })
    const preStepStatus = computed(() => {
      if (!useStepsHook.stepList) {
        return ''
      }
      return useStepsHook.stepList[index.value - 1]
        ? useStepsHook.stepList[index.value - 1].m_status
        : ''
    })
    const nextStepStatus = computed(() => {
      if (!useStepsHook.stepList) {
        return ''
      }
      return useStepsHook.stepList[index.value + 1]
        ? useStepsHook.stepList[index.value + 1].m_status
        : ''
    })
    // public
    const setIndex = (n: number) => { //
      index.value = n
    }

    const setSelfActive = () => {
      useStepsHook.updateActive(index.value)
    }

    const computedCollection = {
      stepStyle, currentIcon, preStepStatus, nextStepStatus,
    }

    return {
      prefix, index,
      ...computedCollection,
      ...toRefs(useStepsHook),
      setIndex, setSelfActive,
    }
  },
  render() {
    const {
      prefix, space, dot, stepStyle, nextStepStatus, description, title, m_status, index, currentIcon, type,
    } = this
    return <div
      class={[prefix, {
        [`${prefix}-flex`]: !space,
        [`${prefix}-dot`]: dot,
        [`${prefix}-${type}`]: type,
      }]}
      style={stepStyle}>
      <div
        class={[`${prefix}-head`, {
          [`${prefix}-${m_status}`]: true,
          [`${prefix}-${nextStepStatus}-next`]: nextStepStatus,
        }]}>

        <mtd-icon v-show={type === 'navigation'} name={'right'} class={`${prefix}-nav-right`} />

        <div class={[`${prefix}-head-line`, `${prefix}-head-line-first`]} />

        {dot
          ? <div
            class={`${prefix}-head-number`}
            style={{ border: 'none', background: 'none' }}
            onClick={this.setSelfActive}
          >
            <div class={`${prefix}-head-dot`} />
          </div>
          : (getSlotsInRender(this, 'icon') || currentIcon)
            ? <div class={`${prefix}-head-icon`} onClick={this.setSelfActive}>
              {getSlotsInRender(this, 'icon') || <i class={currentIcon} />}
            </div>
            : <div class={`${prefix}-head-number-wrapper`}>
              <div class={`${prefix}-head-number`} onClick={this.setSelfActive}>
                {index + 1}
              </div>
            </div>
        }

        <div class={[`${prefix}-head-line`, `${prefix}-head-line-last`]} />
      </div >

      <div
        class={[`${prefix}-main`, {
          [`${prefix}-${m_status}`]: true,
        }]}>
        <div class={`${prefix}-main-title`} onClick={this.setSelfActive}>
          <span style="cursor: pointer">{getSlotsInRender(this, 'title') || title}</span>
        </div>
        <div class={`${prefix}-main-description`} v-show={type !== 'navigation'}>
          {getSlotsInRender(this, 'description') || description}
        </div>
      </div>

    </div >
  },
})
