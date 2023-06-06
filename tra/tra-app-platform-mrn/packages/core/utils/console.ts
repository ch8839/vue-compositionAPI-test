import { CORE_FLAG } from './constants'

export enum CONSOLE_TYPE {
  SUCCESS = 'success',
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
}

export default function printer(type: CONSOLE_TYPE, label: string, ...args: unknown[]) {
  let printer
  switch (type) {
    case CONSOLE_TYPE.SUCCESS:
      printer = console.info
      break
    case CONSOLE_TYPE.ERROR:
      printer = console.error
      break
    case CONSOLE_TYPE.WARN:
      printer = console.warn
      break
    case CONSOLE_TYPE.INFO:
    default:
      printer = console.log
  }
  printer = printer.bind(console) // 修复一些老浏览器console内方法没有bind的导致的this指向错误问题
  printer(`[${CORE_FLAG}]${label}${args && args.length ? ':' : ''}`, ...args)
}
