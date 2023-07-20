import { computed, PropType, SetupContext } from '@ss/mtd-adapter'
import dayjs from 'dayjs'
import {
  DatePickerShort,
  DatePickerMode,
  DatePickerType,
} from '../types'
import {
  isArray,
} from '@utils/type'
import vueInstance from '@components/hooks/instance'
import { useConfig } from '@components/config-provider'
import { Dayjs } from 'dayjs'

export interface PanelMixinProps {
  type: DatePickerType
  confirm: boolean
  showBtnNow?: boolean
  selectionMode: DatePickerMode
  value?: Dayjs[]
}

export interface PanelMixinCtx extends SetupContext {
  reset: () => void
}
export const withProps = {
  type: {
    type: String as PropType<DatePickerType>,
    required: true,
  },
  confirm: {
    type: Boolean,
    default: false,
  },
  showBtnNow: Boolean,
  selectionMode: {
    type: String as PropType<DatePickerMode>,
    validator(value: string) {
      return ['year', 'month', 'date', 'time'].indexOf(value) > -1
    },
    default: 'date',
  },
}
export const withEmits = ['confirm', 'change', 'click-now']

export const usePanelMixin = (props: PanelMixinProps, ctx: PanelMixinCtx) => {
  const ins = vueInstance()
  const config = useConfig()
  const prefixCls = computed(() => config.getPrefixCls('picker-panel'))
  const datePrefixCls = computed(() => config.getPrefixCls('date-picker'))

  const showTime = computed(() => props.type === 'datetime' || props.type === 'datetimerange')
  function iconBtnCls(direction: string, type = '') {
    return [
      `${prefixCls.value}-icon-btn`,
      `${datePrefixCls.value}-${direction}-btn`,
      `${datePrefixCls.value}-${direction}-btn-arrow${type}`,
    ]
  }
  function handleShortcutClick(shortcut: DatePickerShort) {
    if (shortcut.value) {
      const result = shortcut.value()
      if (isArray(result)) {
        const d = result.map((r) => dayjs.isDayjs(r) ? r : dayjs(r))
        ctx.emit('change', d)
      } else {
        const d = dayjs.isDayjs(result) ? result : dayjs(result)
        ctx.emit('change', d)
      }
    }
    if (shortcut.onClick) {
      shortcut.onClick(ins)
    }
  }
  function handlePickClickNow() {
    ctx.emit('click-now')
    resetView()
  }
  function handleConfirm() {
    ctx.emit('confirm')
    resetView()
  }
  function resetView() {
    (ins as any).reset()
  }



  return {
    showTime, iconBtnCls, handleShortcutClick, handlePickClickNow,
    handleConfirm, resetView,
  }
}
