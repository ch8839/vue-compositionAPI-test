// Vue3 自带响应式
export const set = (target: any, key: any, val: any) => {
  if (target) {
    target[key] = val
  }
}
