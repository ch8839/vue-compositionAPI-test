import vueInstance from "@components/hooks/instance"
import { hasProp } from "@utils/vnode"
import { computed, ref } from "@ss/mtd-adapter"
import { IPopconfirmProps } from './types'


export function usePopconfirm(props: IPopconfirmProps, ctx: any) {
  const ins = vueInstance()

  const vs = ref(props.defaultVisible)
  const isControlled = ref(hasProp(ins, 'visible'))

  const _visible = computed(() => isControlled.value ? props.visible : vs.value)

  function handleInput(v: boolean) {
    ctx.emit('update:visible', v)
    if (!isControlled.value) {
      vs.value = v
    }
  }

  return {
    _visible,
    handleInput,
  }
}
