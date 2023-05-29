import {
  ref,
  computed,
  SetupContext,
  hasProp,
  WritableComputedRef,
} from '@ss/mtd-adapter'
import vueInstance from './instance'

export interface Props {
  [key: string]: any
}

export interface ControlledOptions {
  eventName?: string
  defaultName?: string
}

export interface SetValueOptions {
  force?: boolean,
  emit?: boolean,
}

export interface SetValue<T> {
  (v?: T, options?: SetValueOptions): void
}

export default function <T = string>(propName: string, props: Props,
  context: any | SetupContext, options?: ControlledOptions)
  : [WritableComputedRef<T>, SetValue<T>] {
  const m_options: ControlledOptions = options || {}
  const ins = vueInstance()

  /**
   * todo: 动态切换时，可能会存在问题，需要用户传 key。
   * 使用 computed 不能解决问题
   * example:
   * <mtd-button :loading="false" />
   * <mtd-button />
   * */

  const isControlled = hasProp(ins, propName)

  const inner = ref<T>()
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  inner.value = props[propName] || props[m_options.defaultName!]

  const stateValue = computed<T>({
    get() {
      return isControlled ? props[propName] : inner.value
    },
    set(v?: T) {
      inner.value = v
    },
  })
  const setValue = function (value?: T, opt?: SetValueOptions) {
    const m_opt: SetValueOptions = opt || {}
    let shouldEmit = m_opt.emit
    if (!isControlled || m_opt.force) {
      inner.value = value
    } else {
      shouldEmit = true
    }
    if (shouldEmit) {
      const event = m_options.eventName || `update:${propName}`
      context.emit(event, value)
    }
  }
  return [stateValue, setValue]
}
