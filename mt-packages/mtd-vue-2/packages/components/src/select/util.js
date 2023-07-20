import { getValueByPath } from '@ss/mtd-vue/es/utils/util'

export const isArray = Array.isArray

export function isExist (v) {
  return v !== undefined && v !== null && v !== ''
}

export function hasProps (vm, props) {
  if (vm && vm.$options) {
    return props in vm.$options.propsData
  }
  return false
}

export function isObject (v) {
  return Object(v) === v
}

export function getRealValue (value, valueKey) {
  return valueKey && isObject(value)
    ? getValueByPath(value, valueKey)
    : value
}

// 将用户传的 option 进行格式化
export function formatOption (option, valueKey) {
  const { value } = option
  return {
    realValue: getRealValue(value, valueKey),
    value: value,
    label: option.label,
    currentLabel: option.label || (isExist(value) ? value.toString() : ''),
    origin: option,
  }
}

export function getDiffOptions (source, target) {
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

const keyCodes = {
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
const keyNames = {
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
  'delete': ['Backspace', 'Delete', 'Del'],
}

export function isKey (key, event) {
  const code = keyCodes[key] || []
  const name = keyNames[key] || []
  return code.indexOf(event.keyCode) !== -1 || name.indexOf(event.key) !== -1
}

export function isKeyDown (event) {
  return isKey('down', event)
}

export function isKeyUp (event) {
  return isKey('up', event)
}

export function isKeyEnter (event) {
  return isKey('enter', event)
}

export function isKeyEsc (event) {
  return isKey('esc', event)
}

export function isKeyTab (event) {
  return isKey('tab', event)
}
