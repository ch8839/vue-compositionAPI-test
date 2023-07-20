import { computed } from '@ss/mtd-adapter'
import useConfig from '@hooks/config'

export const usePrefixCls = () => {
  const config = useConfig()
  const prefixClsCells = computed(() => config.getPrefixCls('date-picker-cells'))

  return {
    prefixClsCells,
  }
}

export default usePrefixCls
