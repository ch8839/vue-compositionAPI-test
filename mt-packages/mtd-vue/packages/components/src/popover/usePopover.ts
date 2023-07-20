import vueInstance from "@components/hooks/instance"
import { hasProp } from "@components/__utils__/vnode"
import { computed, ref } from "@ss/mtd-adapter"

export interface popoverProps {
  title?: string,
  content?: string,
  size?: string,
  showArrow?: boolean
  trigger?: string
  placement?: string
  transition?: string,
  popperClass?: string,
  disabled?: boolean,
  defaultVisible: boolean,
  visible?: boolean,
}

export const usePopover = (props: popoverProps, ctx: any) => {
  const ins = vueInstance()
  const vs = ref(props.defaultVisible)

  const isControlled = computed((): boolean => {
    return hasProp(ins, 'visible')
  })
  const _visible = computed((): boolean | undefined => {
    return isControlled.value ? props.visible : vs.value
  })

  const setVisible = (v: boolean) => {
    ctx.emit('update:visible', v)
    if (!isControlled.value) {
      vs.value = v
    }
  }

  return {
    _visible,
    setVisible,
  }
}
