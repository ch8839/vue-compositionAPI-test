import {
  ref,
  defineComponent,
  computed,
  watch,
  onMounted,
  PropType, vueInstance,
  getSlotsInRender,
  getListeners, useResetAttrs, useListeners,
  Fragment,
} from '@ss/mtd-adapter'
import useProvide from './useProvide'
import Teleport from '@components/teleport'
import { useConfig } from '@components/config-provider'

export default defineComponent({
  name: 'MtdPopperDrop',
  components: {
    Teleport,
    Fragment,
  },
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

    watch(visible, visible => {
      if (visible) {
        isMounted.value = true
      }
    }, {
      immediate: true,
    })

    onMounted(() => {
      popper.registerDrop(ins)
    })

    const handleAfterLeave = () => {
      if (props.destroyOnClose) {
        isMounted.value = false
      }
    }

    const { getPopupContainer, appendToContainer } = popper as any

    const myAttrs = useResetAttrs(attrs)
    const listeners = getListeners()
    const myListeners = useListeners(listeners.value)

    const drop = ref()

    return {
      prefixMTD,
      showArrow,
      visible,
      isMounted,
      handleAfterLeave,
      getPopupContainer,
      appendToContainer,
      myAttrs,
      myListeners,
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
      appendToContainer,
      myAttrs,
      classProp,
      myListeners, prefixMTD,
    } = this
    const children = getSlotsInRender(this)

    //  🤡transition
    //  💣 此处的Vue2 和 Vue3 有所区别 体现在useShow的使用上

    // 🤡 直接使用diabaled似乎是不行的
    const TeleportTag = appendToContainer ? 'teleport' : 'fragment'

    return (
      <TeleportTag to={'body'}>
        <transition name={name} onAfterLeave={handleAfterLeave}>
          {isMounted &&
            <div
              v-show={visible}
              {...myAttrs}
              {...myListeners}
              class={[classProp, `${prefixMTD}-popper`, { [`${prefixMTD}-popper-show-arrow`]: showArrow }]}
              style={color ? { ['background-color']: color } : undefined}
              ref="drop"
            >
              {showArrow &&
                <div class={`${prefixMTD}-popper-arrow`} x-arrow style={color ? { ['color']: color } : undefined} />
              }
              {useShow ? children : isMounted && children}
            </div>
          }
        </transition>
      </TeleportTag>
    )
  },
})
