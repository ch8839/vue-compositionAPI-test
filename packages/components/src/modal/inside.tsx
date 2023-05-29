import {
  defineComponent,
  ref,
  computed,
  reactive,
  watch,
  getSlotsInRender,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import MtdIcon from '@components/icon'
export default defineComponent({
  name: 'ModalInside',
  components: {
    MtdIcon,
  },
  inheritAttrs: true,
  props: {
    title: String,
    closable: Boolean,
    drag: Boolean,
    visible: Boolean,
  },
  emits: ['close'],
  setup(props, { emit }) {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('modal'))

    const startXY = reactive({
      x: 0,
      y: 0,
    })
    const translate = reactive({
      x: 0,
      y: 0,
    })
    const transform = ref('translate(0,0)')

    watch(() => props.visible, (v) => {
      if (!v) {
        init()
      }
    })

    function handleClose() {
      init()
      emit('close')
    }
    function handleMouseDown(e: MouseEvent) {
      if (!props.drag) {
        return
      }
      startXY.x = e.screenX
      startXY.y = e.screenY

      e.preventDefault()
      window.addEventListener('mousemove', onDragging)
      window.addEventListener('mouseup', onDragEnd)
    }
    function onDragging(e: MouseEvent) {
      const offsetXY = {
        x: translate.x + (e.screenX - startXY.x),
        y: translate.y + (e.screenY - startXY.y),
      }
      transform.value = `translate(${offsetXY.x}px,${offsetXY.y}px)`
    }
    function onDragEnd(e: MouseEvent) {
      translate.x = translate.x + (e.screenX - startXY.x)
      translate.y = translate.y + (e.screenY - startXY.y)
      window.removeEventListener('mousemove', onDragging)
      window.removeEventListener('mouseup', onDragEnd)
    }
    function init() {
      translate.x = 0
      translate.y = 0
      transform.value = 'translate(0,0)'
    }

    return {
      prefix,
      transform,
      handleClose,
      handleMouseDown,
    }
  },
  render() {
    const {
      prefix, title, closable, transform,
    } = this
    return <div class={`${prefix}`} style={{
      transform: transform,
    }}>

      {closable &&
        <span class={`${prefix}-close`} onClick={this.handleClose}>
          <MtdIcon name={'close'} />
        </span>
      }

      {(title || getSlotsInRender(this, 'title')) &&
        <div
          class={`${prefix}-header`}
          onMousedown={this.handleMouseDown}
        >
          {
            getSlotsInRender(this, 'title') ||
            <div class={`${prefix}-title`}>{title}</div>
          }
        </div>
      }

      <div class={`${prefix}-content-wrapper`}>
        <div class={`${prefix}-content`}>{getSlotsInRender(this)}</div>
      </div>

      {getSlotsInRender(this, 'footer') && <div class={`${prefix}-footer`}>
        {getSlotsInRender(this, 'footer')}
      </div>}
    </div >
  },
})
