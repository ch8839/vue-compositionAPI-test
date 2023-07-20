type ComponentPublicInstance = any; // eslint-disable-line
export const CONFIG_PROVIDER = 'MTD_NEXT_Config'

let zIndex = 2000
const stack: ComponentPublicInstance[] = [] // 实例栈

const DEFAULT_CONFIG = {
  prefixCls: 'mtd',
  iconPrefixCls: 'mtdicon',

  getPopupContainer: function () {
    return document.body
  },

  getNextZIndex() {
    return zIndex++
  },
  addPopup(instance: ComponentPublicInstance) {
    if (stack.indexOf(instance) === -1) {
      stack.push(instance)
    }
  },
  removePopup(instance: ComponentPublicInstance) {
    const index = stack.lastIndexOf(instance)
    if (index > -1) {
      stack.splice(index, 1)
    }
  },
  getLastPopup() {
    if (stack.length > 0) {
      return stack[stack.length - 1]
    }
  },
}

export function getConfig() {
  return DEFAULT_CONFIG
}

export function getPrefix() {
  return DEFAULT_CONFIG.prefixCls
}

export function getIconPrefix() {
  return DEFAULT_CONFIG.iconPrefixCls
}

export function getPrefixCls(suffixCls: string, customizePrefixCls?: string) {
  return customizePrefixCls || `${DEFAULT_CONFIG.prefixCls}-${suffixCls}`
}

export function getIconCls(suffixCls: string, customizePrefixCls?: string) {
  const { iconPrefixCls } = DEFAULT_CONFIG
  return (
    customizePrefixCls || `${iconPrefixCls} ${iconPrefixCls}-${suffixCls || ''}`
  )
}

export function config(options: any) { // eslint-disable-line
  return Object.assign(DEFAULT_CONFIG, options)
}
