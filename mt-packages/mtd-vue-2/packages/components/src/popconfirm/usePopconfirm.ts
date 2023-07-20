import vueInstance from '@components/hooks/instance'
import { computed, ref, hasProp } from '@ss/mtd-adapter'
import { IPopconfirmProps } from './types'


export function usePopconfirm(props: IPopconfirmProps, ctx: any) {
  const ins = vueInstance()

  const vs = ref(props.defaultVisible)
  const isControlled = ref(hasProp(ins, 'visible'))

  const m_visible = computed(() => isControlled.value ? props.visible : vs.value)

  function handleInput(v: boolean) {
    ctx.emit('update:visible', v)
    if (!isControlled.value) {
      vs.value = v
    }
  }

  return {
    m_visible,
    handleInput,
  }
}
