import { ExtractPropTypes, PropType } from '@ss/mtd-adapter'
import { SidebarData } from './types'

export interface VirtualOptions {
  rowHeight?: number
}

const sildebarProps = () => ({
  // 主题
  theme: {
    type: String,
    default: 'light',
  },
  collapse: Boolean,
  // 激活菜单名称
  modelValue: [Number, String],
  // 默认展开的菜单集合
  expandKeys: {
    type: Array,
    default: () => {
      return []
    },
  },
  // 是否开启手风琴模式
  accordion: Boolean,
  data: {
    type: Array as PropType<SidebarData[]>,
    required: true,
  },
  itemKey: {
    type: String,
    default: 'id',
  },
  title: {
    type: String,
    default: '',
  },
  tooltipProps: {
    type: Object,
  },

  defaultActiveKey: [String, Number],
  defaultExpandKeys: Array,
})

export type SidebarProps = Partial<ExtractPropTypes<ReturnType<typeof sildebarProps>>>;

export default sildebarProps
