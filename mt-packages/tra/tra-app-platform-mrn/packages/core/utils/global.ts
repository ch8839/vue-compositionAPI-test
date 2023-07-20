declare const window: any
declare const self: any
declare const global: any

const mockGlobal = {}

export default function getGlobal() {
  if (typeof globalThis !== 'undefined') {
    return globalThis
  }
  if (typeof window !== 'undefined') {
    return window
  }
  if (typeof global !== 'undefined') {
    return global
  }
  if (typeof self !== 'undefined') {
    return self
  }
  return mockGlobal
}
