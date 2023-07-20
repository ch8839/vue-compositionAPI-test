import { isArray } from '@utils/type'

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

export function isKey( key: any,event: KeyboardEvent) {
  const code = keyCodes[key] || []
  const name = keyNames[key] || []
  return code.indexOf(event.keyCode) !== -1 || name.indexOf(event.key) !== -1
}
export default keyCodes
