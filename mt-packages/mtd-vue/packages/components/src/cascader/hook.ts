
import {
  provide,
  inject,
  computed,
  ComputedRef,
} from '@ss/mtd-adapter'
import { ExpandTrigger } from './types'

const CASCADER_PANEL_PROVIDER = 'CASCADER_PANEL_PROVIDER'


export interface CascaderPanelCtx {
  showCheckbox: boolean;
  changeOnSelect: boolean;
  expandTrigger: ExpandTrigger;

  getNodes(values: any[]): Node[];
}

export function useCascaderPanel(): ComputedRef<CascaderPanelCtx> {
  const defaultCtx = computed((): CascaderPanelCtx => {
    return {
      showCheckbox: false,
      changeOnSelect: false,
      expandTrigger: 'hover',
      getNodes: () => [],
    }
  })
  const cascaderPanelCtx = inject<ComputedRef<CascaderPanelCtx>>(CASCADER_PANEL_PROVIDER, defaultCtx)
  return cascaderPanelCtx
}

export function useCascaderPanelProvider(props: any, ins: any) {

  const context = computed((): CascaderPanelCtx => {
    return {
      showCheckbox: ins.showCheckbox,
      changeOnSelect: props.changeOnSelect,
      expandTrigger: props.expandTrigger,
      getNodes: ins.getNodes,
    }
  })

  provide<ComputedRef<CascaderPanelCtx>>(CASCADER_PANEL_PROVIDER, context)
}
