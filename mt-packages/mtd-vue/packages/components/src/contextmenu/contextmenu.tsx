import {
  defineComponent,
  computed,
  reactive,
  ref,
  watch,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import Teleport from '@components/teleport'
import MtdDropdownMenu from '@components/dropdown-menu'
import MtdDropdownMenuItem from '@components/dropdown-menu-item'

export default defineComponent({
  name: 'MtdContextmenu',
  components: {
    Teleport,
    MtdDropdownMenu,
    MtdDropdownMenuItem,
  },
  inheritAttrs: true,
  props: {
    options: Array,
  },
  emits: ['contextmenu'],
  setup(props, { emit }) {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('contextmenu'))
    const ctxRef = ref<HTMLElement | null>(null)

    const visible = ref(false)

    const contextStyle = reactive({
      left: '0px',
      top: '0px',
    })

    watch(visible, (v) => {
      if (v) {
        window.addEventListener('click', clickoutside)
      } else {
        window.removeEventListener('click', clickoutside)
      }
    }, { immediate: true })

    function handleContextmenu(e: PointerEvent) {
      e.preventDefault()
      visible.value = true
      contextStyle.left = e.clientX + 'px'
      contextStyle.top = e.clientY + 'px'

      emit('contextmenu', visible.value)
    }

    function handleItemClick(e: Event, handle: Function) {
      visible.value = false
      handle()
    }

    function clickoutside(e: Event) {
      if (!ctxRef.value?.contains(e.target as HTMLElement)) {
        visible.value = false
      }
    }

    return {
      prefix, handleContextmenu, visible, contextStyle, handleItemClick, ctxRef,
    }
  },
  render() {
    const {
      prefix, visible, contextStyle, options,
    } = this
    return <div onContextmenu={this.handleContextmenu}>
      {this.$slots.default}

      <transition
        name={`fade-in-${prefix}`}
      >
        {visible &&
          <div class={prefix} style={contextStyle} ref={'ctxRef'}>
            <mtd-dropdown-menu>
              {options?.map((option: any) => {
                return <mtd-dropdown-menu-item onClick={(e: Event) => this.handleItemClick(e, option.handle)}>
                  {option.label}
                </mtd-dropdown-menu-item>
              })}
            </mtd-dropdown-menu>
          </div>
        }
      </transition >
    </div>
  },
})
