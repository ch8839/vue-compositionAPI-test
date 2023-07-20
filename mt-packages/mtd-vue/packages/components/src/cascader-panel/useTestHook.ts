import { inject, computed, watch, getCurrentInstance, ref } from "@ss/mtd-adapter"
import {
  Node,
  CascaderFieldName,
  FilteredNode,
  DisplayNode,
  TCheckedStrategy,
} from '@components/cascader/types'
import { FILTERED_NODE_KEY } from '@components/cascader/util'
import {
  TreeFieldName,
  TreeNode,
  DEFAULT_FIELD_NAMES,
  TreeData,
} from '@components/tree/types'
import useTreeDataHandler from '@components/tree/useDataHandler'



export const useTestHook = (props: any, ctx: any) => {

  const a = computed(() => {
    console.log(12132123)
    return props.checkedValue
  })

  watch(
    () => props.checkedValues,
    (v: any) => {
      console.log('在hook里面观察到checkValules变化')
    },

  )

  return {
    a,
  }
}

export default useTestHook