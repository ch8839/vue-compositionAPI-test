import { computed, ref } from "@ss/mtd-adapter"

export interface dropdownProps {
  trigger?: string,
  placement?: string,
  popperClass?: any,
  showArrow?: boolean,
  disabled?: boolean,
  visibleOnMenuItemClick?: boolean,
  shouldComputedWidth?: boolean,
  useShow?: boolean,
  defaultVisible?: boolean,
}

export const useDropdown = (props: dropdownProps, ctx: any) => {
  const vs = ref(props.defaultVisible)

  const isControlled = computed((): boolean => {
    return 'visible' in ctx.attrs
  })
  const _visible = computed((): boolean | undefined => {
    return isControlled.value ? ctx.attrs.visible : vs.value
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
