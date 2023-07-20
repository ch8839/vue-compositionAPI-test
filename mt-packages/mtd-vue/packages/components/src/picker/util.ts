import { getValueByPath } from '@utils/util'
import { Option } from '@components/option/types'

export const isArray = Array.isArray

export function isExist(v: any) {
  return v !== undefined && v !== null && v !== ''
}

export function hasProps(vm: any, props: string) {
  if (vm && vm.$options) {
    return props in vm.$options.propsData
  }
  return false
}

export function isObject(v: any): v is Object {
  return Object(v) === v
}

export function getRealValue(value: any, valueKey?: string) {
  return valueKey && isObject(value)
    ? getValueByPath(value, valueKey)
    : value
}

// 将用户传的 option 进行格式化
export function formatOption(option: Option, valueKey: string) {
  const { value } = option
  return {
    realValue: getRealValue(value, valueKey),
    value: value,
    label: option.label,
    currentLabel: option.label || (isExist(value) ? value.toString() : ''),
    origin: option,
  }
}

export function getDiffOptions(source: Option[], target: Option[]) {
  if (source === target) {
    return {
      add: [],
      removed: [],
    }
  }
  if (!source.length || !target.length) {
    return {
      add: source.length ? [] : target,
      removed: source.length ? source : [],
    }
  }
  // const addOptions = [];
  // const removedOptions = [];
  // const targetSet = new Set(target);

}

const keyCodes: any = {
  esc: [27],
  tab: [9],
  enter: [13],
  space: [32],
  up: [38],
  left: [37],
  right: [39],
  down: [40],
  'delete': [8, 46],
}

// KeyboardEvent.key aliases
const keyNames: any = {
  // #7880: IE11 and Edge use `Esc` for Escape key name.
  esc: ['Esc', 'Escape'],
  tab: ['Tab'],
  enter: ['Enter'],
  // #9112: IE11 uses `Spacebar` for Space key name.
  space: [' ', 'Spacebar'],
  // #7806: IE11 uses key names without `Arrow` prefix for arrow keys.
  up: ['Up', 'ArrowUp'],
  left: ['Left', 'ArrowLeft'],
  right: ['Right', 'ArrowRight'],
  down: ['Down', 'ArrowDown'],
  // #9112: IE11 uses `Del` for Delete key name.
  delete: ['Backspace', 'Delete', 'Del'],
}

export function isKey(key: string, event: KeyboardEvent) {
  const code = keyCodes[key] || []
  const name = keyNames[key] || []
  return code.indexOf((event as KeyboardEvent).keyCode) !== -1 || name.indexOf(event.key) !== -1
}

export function isKeyDown(event: KeyboardEvent) {
  return isKey('down', event)
}

export function isKeyUp(event: KeyboardEvent) {
  return isKey('up', event)
}

export function isKeyEnter(event: KeyboardEvent) {
  return isKey('enter', event)
}

export function isKeyEsc(event: KeyboardEvent) {
  return isKey('esc', event)
}

export function isKeyTab(event: KeyboardEvent) {
  return isKey('tab', event)
}

export function isKeyDelete(event: KeyboardEvent) {
  return isKey('delete', event)
}
