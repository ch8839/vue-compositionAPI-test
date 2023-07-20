import {
  ref,
  computed,
  SetupContext,
  ComponentInstance,
  ComputedRef,
} from '@ss/mtd-adapter'
import getInstance from './instance'

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

// vue2
function hasProps(propName: string, instance?: ComponentInstance) {
  if (!instance) {
    return false
  }
  return propName in (instance.$options.propsData || {})
}

export default function <T = string>(propName: string, props: Props,
  context: any | SetupContext, options?: ControlledOptions)
  : [ComputedRef<T>, SetValue<T>] {
  const _options: ControlledOptions = options || {}
  const instance = getInstance()

  /**
   * todo: 动态切换时，可能会存在问题，需要用户传 key。
   * 使用 computed 不能解决问题
   * example:
   * <mtd-button :loading="false" />
   * <mtd-button />
   * */

  const isControlled = hasProps(propName, instance)

  const inner = ref<T>()
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  inner.value = props[propName] || props[_options.defaultName!]

  const stateValue = computed<T>({
    get() {
      return isControlled ? props[propName] : inner.value
    },
    set(v?: T) {
      inner.value = v
    },
  })
  const setValue = function (value?: T, opt?: SetValueOptions) {
    const _opt: SetValueOptions = opt || {}
    let shouldEmit = _opt.emit
    if (!isControlled || _opt.force) {
      inner.value = value
    } else {
      shouldEmit = true
    }
    if (shouldEmit) {
      const event = _options.eventName || `update:${propName}`
      context.emit(event, value)
    }
  }
  return [stateValue, setValue]
}
