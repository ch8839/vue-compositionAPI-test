import {
  ref,
  defineComponent,
  computed,
  watch,
  onMounted,
  PropType, vueInstance,
  getSlotsInRender,
  getListeners, useResetAttrs, useListeners, Transition,
  onUnmounted, onActivated, onDeactivated,
} from '@ss/mtd-adapter'
import useProvide from './useProvide'
import getElement from '@hooks/getElement'
import { useConfig } from '@components/config-provider'

export default defineComponent({
  name: 'MtdPopperDrop',
  inheritAttrs: false, // 🤡 lazy，useshow，destroyOnClose props能否精简？
  props: {
    lazy: {
      type: Boolean,
      default: true,
    },
    useShow: Boolean,
    tag: {
      type: [String, Object],
      default: 'div',
    },
    transition: {
      type: String,
      default: 'fade-in',
    },
    destroyOnClose: {
      type: Boolean,
      default: false,
    },
    classProp: {
      type: [String, Array] as PropType<string[] | string>,
      default: () => [],
    },
    color: String,
  },
  setup(props, { attrs }) {
    const config = useConfig()
    const prefixMTD = computed(() => config.getPrefix())

    const { injectPopper } = useProvide()
    const popper = injectPopper()
    const ins = vueInstance()
    if (!popper) {
      throw new Error('Drop Component must be used in Popper')
    }
    const showArrow = computed(() => popper.showArrow)
    const visible = computed(() => popper.visible)
    const isMounted = ref<boolean>(popper.visible || !props.lazy)

    const el = getElement()

    function createTele() {
      if (popper && popper.appendToContainer) {
        const getContainer = popper.getPopupContainer
        const parent = getContainer()
        parent && parent.appendChild(el.value)
      }
    }
    function destroyTele() {
      // el.value 不具备时效性
      if (ins.$el) {
        const parentNode = ins.$el.parentNode
        parentNode && parentNode.removeChild(ins.$el)
      }
    }

    watch(visible, visible => {
      if (visible) {
        isMounted.value = true
      }
    }, {
      immediate: true,
    })

    onMounted(() => {
      popper.registerDrop(ins)
      createTele()
    })
    onActivated(createTele)
    onDeactivated(destroyTele)
    onUnmounted(destroyTele)

    const handleAfterLeave = () => {
      if (props.destroyOnClose) {
        isMounted.value = false
      }
    }

    const { getPopupContainer, appendToContainer } = popper as any

    const resetAttrs = useResetAttrs(attrs)
    const listeners = getListeners()
    const resetListeners = useListeners(listeners.value)

    const drop = ref()

    return {
      prefixMTD,
      showArrow,
      visible,
      isMounted,
      handleAfterLeave,
      getPopupContainer,
      appendToContainer,
      resetAttrs,
      resetListeners,
      drop,
    }
  },

  render() {
    const {
      transition: name,
      color,
      handleAfterLeave,
      showArrow,
      useShow,
      isMounted,
      visible,
      resetAttrs,
      classProp,
      resetListeners, prefixMTD,
    } = this

    //  🤡transition
    //  💣 此处的Vue2 和 Vue3 有所区别 体现在useShow的使用上

    // 🤡 直接使用diabaled似乎是不行的
    const needShow = isMounted || useShow
    const children = needShow && getSlotsInRender(this)

    const TRender = <Transition
      name={name}
      onAfterLeave={handleAfterLeave}
      enter-from-class={name + '-enter'}
    >
      {needShow &&
        <div
          v-show={visible}
          {...resetAttrs}
          {...resetListeners}
          class={[classProp, `${prefixMTD}-popper`, { [`${prefixMTD}-popper-show-arrow`]: showArrow }]}
          style={color ? { ['background-color']: color } : undefined}
          ref="drop"
        >
          {showArrow &&
            <div class={`${prefixMTD}-popper-arrow`} x-arrow style={color ? { ['color']: color } : undefined} />
          }
          {useShow
            ? children
            : isMounted && children
          }
        </div>
      }
    </Transition>

    return TRender
  },
})
