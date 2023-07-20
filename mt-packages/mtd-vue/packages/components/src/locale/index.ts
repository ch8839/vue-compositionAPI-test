import defaultLang from './lang/zh-CN'

export const t = function (path: string): string {
  const array = path.split('.')
  let current = defaultLang as any

  let value
  for (let i = 0, j = array.length; i < j; i++) {
    const property = array[i] as any
    value = current[property]
    if (i === j - 1) return value
    if (!value) return ''
    current = value
  }
  return ''
}

export default { t }
