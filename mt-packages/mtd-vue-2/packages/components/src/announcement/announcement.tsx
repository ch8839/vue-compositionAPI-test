import {
  defineComponent,
  PropType,
  computed,
  reactive,
  toRefs,
  getSlotsInRender,
  Transition,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import { AnnouncementType } from './types'
import MtdIcon from '@components/icon'

const TypeMap = {
  success: 'info-circle',
  info: 'info-circle',
  warning: 'warning-circle',
  error: 'error-circle',
  secondary: 'info-circle',
}

export default defineComponent({
  name: 'MtdAnnouncement',
  components: {
    MtdIcon,
  },
  inheritAttrs: true,
  props: {
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    type: {
      type: String as PropType<AnnouncementType>,
      default: 'warning',
    },
    closeable: Boolean, // 兼容历史
    closable: Boolean,

    showIcon: Boolean,
  },

  emits: ['close'],
  setup(props, { slots, emit }) {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('announcement'))
    const iconPrefix = config.getIconCls

    const state = reactive({
      visible: true,
    })

    // @Computed
    const canClosed = computed(() => props.closable || props.closeable)
    const typeClass = computed(() => {
      return {
        [`${prefix.value}-${props.type}`]: props.type,
        [`${prefix.value}-closable`]: props.closable,
        [`${prefix.value}-has-description`]: props.description || slots.description,
      }
    })
    const iconClass = computed(() => `${iconPrefix()}${TypeMap[props.type]}` || `${iconPrefix()}warning`)

    // @Methods
    function close() {
      state.visible = false
      emit('close')
    }

    return {
      prefix, iconPrefix,
      ...toRefs(state),
      canClosed, typeClass, iconClass,
      close,
    }
  },
  render() {
    const {
      title, visible, showIcon, description,
      prefix, canClosed, typeClass, iconClass,
    } = this
    return <Transition name={`${prefix}-fade`}>
      <div class={[prefix, typeClass]} v-show={visible}>
        {showIcon &&
          <i class={[`${prefix}-icon`, iconClass]} />
        }
        <div class={`${prefix}-content`}>
          <div
            class={{
              [`${prefix}-title`]: true,
              [`${prefix}-title-large`]: description || getSlotsInRender(this, 'description'),
            }}
          >
            {getSlotsInRender(this) || title}
          </div>
          {(description || getSlotsInRender(this, 'description')) &&
            <div class={`${prefix}-description`}>
              {getSlotsInRender(this, 'description') || description}
            </div>
          }
          <div class={`${prefix}-close`} v-show={canClosed} onClick={this.close}>
            {getSlotsInRender(this, 'close') || <mtd-icon name={'close-thick'} />}
          </div>
        </div >
      </div >
    </Transition>
  },
})
