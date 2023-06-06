const NULL = ['', undefined, NaN, null]

export interface IValidatorRule {
  name: string
  rule?: RegExp | ((value: string) => boolean)
  message: string
}

/**
 * 验证器
 * @param {Array<rule>} rules { rule, msg, name }
 * @param {*} data
 */
export default function validator(
  rules: IValidatorRule[] = [],
  data: Record<string, any>
) {
  return rules.find(rule => {
    let value!: string
    // 嵌套数据验证
    const nameList = rule.name.split('.')
    for (let i = 0; i < nameList.length; i++) {
      const propName = nameList[i]
      value = data[propName]
      if (!value) break
    }
    // 函数支持 - 能通过校验的返回true
    if (typeof rule.rule === 'function') return !rule.rule(value)
    // 正则支持 - 不满足rule的正则则不通过
    else if (Object.prototype.toString.call(rule.rule) === '[object RegExp]')
      return !rule.rule!.test(value)
    // 默认 required，后续可支持扩展更多类型
    // required 判断 ''，NaN，null 和 undefined，排除 0
    else return NULL.includes(value)
  })
}
