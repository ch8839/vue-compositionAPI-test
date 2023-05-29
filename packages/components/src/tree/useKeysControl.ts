import { computed } from '@ss/mtd-adapter'
import useControlled from '@hooks/controlled'

function convertToMap(array: any[]) {
  return array.reduce((state, key) => {
    state[key] = true
    return state
  }, {})
}

export interface keyMap { [key: string]: boolean }

export const useControl = (props: any, ctx: any) => {

  const [checkedKeys, setCheckedKeys] = useControlled<string[]>('checkedKeys', props, ctx)
  const [selectedKeys, setSelectedKeys] = useControlled<string[]>('selectedKeys', props, ctx)
  const [expandedKeys, setExpandedKeys] = useControlled<string[]>('expandedKeys', props, ctx)
  const [loadedKeys, setLoadedKeys] = useControlled<string[]>('loadedKeys', props, ctx)

  const checkedKeyMap = computed((): keyMap => {
    if (!props.checkable) {
      return {}
    }
    return convertToMap(checkedKeys.value)
  })
  const expandedKeyMap = computed((): keyMap => {
    return convertToMap(expandedKeys.value)
  })
  const loadedKeyMap = computed((): keyMap => {
    return convertToMap(loadedKeys.value)
  })
  const selectedKeyMap = computed((): keyMap => {
    return convertToMap(selectedKeys.value)
  })

  return {
    m_checkedKeys: checkedKeys, setCheckedKeys,
    m_selectedKeys: selectedKeys, setSelectedKeys,
    m_expandedKeys: expandedKeys, setExpandedKeys,
    m_loadedKeys: loadedKeys, setLoadedKeys,
    checkedKeyMap,
    expandedKeyMap,
    loadedKeyMap,
    selectedKeyMap,
  }
}

export default useControl
