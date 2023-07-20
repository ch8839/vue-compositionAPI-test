import { computed, reactive, SetupContext, hasProp, vueInstance } from '@ss/mtd-adapter'
import { SidebarProps } from './props'

export default function useSidebar(props: SidebarProps, ctx: SetupContext) {

  const ins = vueInstance()

  const state = reactive({
    collapse: false,
    value: props.defaultActiveKey || '',
    expandKeys: props.defaultExpandKeys || [],
  })

  const isCollapseControlled = computed(() => hasProp(ins, 'collapse'))
  const m_collapse = computed(() => isCollapseControlled.value
    ? props.collapse
    : state.collapse,
  )
  function updateCollapse(v: boolean) {
    state.collapse = v
    ctx.emit('update:collapse', v)
  }

  const isActiveControlled = computed(() => hasProp(ins, 'modelValue'))
  const m_value = computed(() => isActiveControlled.value
    ? props.modelValue
    : state.value,
  )
  function updateActiveKey(v: string) {
    state.value = v
    ctx.emit('update:modelValue', v)
  }

  const isExpandControlled = computed(() => hasProp(ins, 'expandKeys'))
  const m_expandKeys = computed(() => isExpandControlled.value
    ? props.expandKeys
    : state.expandKeys,
  )
  function updateExpandKeys(v: string[]) {
    state.expandKeys = v
    ctx.emit('update:expandKeys', v)
  }

  return {
    m_collapse, m_value, m_expandKeys, isActiveControlled,
    updateCollapse, updateActiveKey, updateExpandKeys,
  }
}
