import dayjs, { Dayjs, OpUnitType } from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import isBetween from 'dayjs/plugin/isBetween'
import minMax from 'dayjs/plugin/minMax'
import quarterOfYear from 'dayjs/plugin/quarterOfYear'
import isoWeek from 'dayjs/plugin/isoWeek'
import weekday from 'dayjs/plugin/weekday'
import { isArray, isString, isDate } from '@utils/type'
import zh from 'dayjs/locale/zh-cn'

type D = string | number | Date;
dayjs.extend(advancedFormat)
dayjs.extend(weekOfYear)
dayjs.extend(isBetween)
dayjs.extend(minMax)
dayjs.extend(weekday)
dayjs.extend(isoWeek)
dayjs.extend(quarterOfYear)
dayjs.extend(customParseFormat)
dayjs.locale(zh)

function converFormat(f: string) {

  // 中括号里面的内容不做额外处理
  const pattern = /([ydw])|(\[[^\]]*\])/gi //取中括号(包括中括号)里面的内容和 y，d，w

  return f.replace(pattern, $1 => {
    if ($1.length > 1) {
      // 如果$1的长度大于1，就是中括号的
      return $1
    } else {
      return $1.replace(/y/g, 'Y').replace(/d/g, 'D').replace(/W/g, 'w')
    }
  })

}
function converHalfYearFormat(date: Dayjs, f: string) {
  const half = date.month() > 5 ? 2 : 1
  return f.replace(/G/g, 'H' + half)
}

export const RANGE_SEPARATOR = '-'

export const DEFAULT_FORMATS = {
  date: 'yyyy-MM-dd',
  month: 'yyyy-MM',
  year: 'yyyy',
  yearrange: 'yyyy',
  datetime: 'yyyy-MM-dd HH:mm:ss',
  time: 'HH:mm:ss',
  timerange: 'HH:mm:ss',
  daterange: 'yyyy-MM-dd',
  monthrange: 'yyyy-MM',
  datetimerange: 'yyyy-MM-dd HH:mm:ss',
  week: 'yyyy-ww',
  weekrange: 'yyyy-ww',
  quarter: 'yyyy-[Q]Q',
  quarterrange: 'yyyy-[Q]Q',
  halfyear: 'yyyy-[Q]Q',
  halfyearrange: 'yyyy-[Q]Q',
}


const formatDate = function (day: Dayjs | undefined, format?: string, options?: any) {
  let result = formatDateBase(day, format, options)
  // 半年格式化
  if (day && isString(result) && /G/gi.test(result)) {
    result = converHalfYearFormat(day, result)
  }

  return result
}

const formatDateBase = function (date: Dayjs | undefined, format?: string, options?: any) {
  if (!date) return ''
  if (format === 'timestamp') {
    return date ? date.valueOf() : undefined
  }
  const { weekStart } = options
  let day = date.locale(Object.assign(zh, {
    weekStart,
    name: `zh-cn-${weekStart}`,
  }))
  if (day && format && /w/gi.test(format)) {
    // 包含周的格式化， 默认情况下在 2019-12-31 'YYYY ww' => 2019-01
    const month = day.month()
    const weekOfYear = day.week()
    if (weekOfYear === 1 && month === 11) {
      day = day.weekday(6)
    }
    if (month === 0 && weekOfYear >= 52) {
      day = day.weekday(0)
    }
    return day.format(converFormat(format))
  }
  return day ? day.format(converFormat(format || 'yyyy-MM-dd')) : ''
}

const parseDate = (d: D, format?: string) => {
  if (isDate(d)) {
    return dayjs(d)
  }
  if (format === 'timestamp') {
    return dayjs(new Date(d))
  }
  return format ? dayjs(d, converFormat(format || 'yyyy-MM-dd')) : dayjs(d)
}
const parseTime = (d: D, format?: string) => {
  if (isDate(d)) {
    return dayjs(d)
  }
  if (format === 'timestamp') {
    return dayjs(new Date(d))
  } else if (isString(d)) {
    const nowDate = new Date()
    const now = dayjs(nowDate)
    const n = `${now.format('YYYY-MM-DD')} ${d}`
    const f = `yyyy-MM-dd ${format || 'HH:mm:ss'}`
    let day = parseDate(n, f)
    if (day.isValid() && nowDate.getDate() !== day.date()) {
      // 保证格式化出来的日期是同一天
      day = day.add(-1, 'd')
    }
    return day
  }
  return dayjs(d)
}

const DATE_FORMATTER = function (value: Dayjs | Dayjs[] | undefined, format: string, options: any) {
  return formatDate(isArray(value) ? value[0] : value, format, options)
}
const DATE_PARSER = function (text: D, format?: string) {
  return text ? parseDate(text, format) : undefined
}
const TIME_PARSER = function (text: D, format?: string) {
  return text ? parseTime(text, format) : undefined
}

const RANGE_FORMATTER = function (
  value: Dayjs | Dayjs[] | undefined,
  format: string,
  options: any,
  RANGE_SEPARATOR = ' - ',
) {
  if (isArray(value) && value.length === 2) {
    const [start, end] = value
    if (start && end) {
      return (
        formatDate(start, format, options) + RANGE_SEPARATOR + formatDate(end, format, options)
      )
    }
  } else if (!isArray(value)) {
    return formatDate(value, format, options)
  }
  return ''
}
const RANGE_PARSER = function (
  text: D | D[],
  format?: string,
  RANGE_SEPARATOR = ' - ',
) {
  if (!text) {
    return []
  }
  let array: D[] = []
  if (isArray(text)) {
    array = text
  } else if (isString(text)) {
    array = text.split(RANGE_SEPARATOR)
  }
  if (array.length === 2) {
    const range1 = array[0]
    const range2 = array[1]

    return [parseDate(range1, format), parseDate(range2, format)]
  }
  return []
}
const TIME_RANGE_PARSER = function (
  text: D | D[],
  format?: string,
  RANGE_SEPARATOR = ' - ',
) {
  if (!text) {
    return []
  }
  let array: D[] = []
  if (isArray(text)) {
    array = text
  } else if (isString(text)) {
    array = text.split(RANGE_SEPARATOR)
  }
  if (array.length === 2) {
    // 时间范围的长度为2，当长度非法时判定整体格式错误
    return array.map((day) => parseTime(day, format))
  }
  return []
}
export const TYPE_VALUE_RESOLVER_MAP = {
  default: {
    formatter(value: any) {
      if (!value) return ''
      return '' + value
    },
    parser(text: D) {
      if (text === undefined || text === '') return undefined
      return dayjs(text)
    },
  },
  timerange: {
    formatter: RANGE_FORMATTER,
    parser: TIME_RANGE_PARSER,
  },
  time: {
    formatter: DATE_FORMATTER,
    parser: TIME_PARSER,
  },
  date: {
    formatter: DATE_FORMATTER,
    parser: DATE_PARSER,
  },
  datetime: {
    formatter: DATE_FORMATTER,
    parser: DATE_PARSER,
  },
  daterange: {
    formatter: RANGE_FORMATTER,
    parser: RANGE_PARSER,
  },
  monthrange: {
    formatter: RANGE_FORMATTER,
    parser: RANGE_PARSER,
  },
  datetimerange: {
    formatter: RANGE_FORMATTER,
    parser: RANGE_PARSER,
  },
  month: {
    formatter: DATE_FORMATTER,
    parser: DATE_PARSER,
  },
  year: {
    formatter: DATE_FORMATTER,
    parser: DATE_PARSER,
  },
  week: {
    // todo
    formatter: DATE_FORMATTER,
    parser: DATE_PARSER,
  },
  weekrange: {
    // todo
    formatter: RANGE_FORMATTER,
    parser: RANGE_PARSER,
  },
  yearrange: {
    // todo
    formatter: RANGE_FORMATTER,
    parser: RANGE_PARSER,
  },
  quarter: {
    // todo
    formatter: DATE_FORMATTER,
    parser: DATE_PARSER,
  },
  quarterrange: {
    // todo
    formatter: RANGE_FORMATTER,
    parser: RANGE_PARSER,
  },
  halfyear: {
    // todo
    formatter: DATE_FORMATTER,
    parser: DATE_PARSER,
  },
  halfyearrange: {
    // todo
    formatter: RANGE_FORMATTER,
    parser: RANGE_PARSER,
  },

  multiple: {
    formatter(value?: Dayjs[], format?: string, options?: any) {
      if (!value || !value.length) {
        return ''
      }

      return value
        .filter(Boolean)
        .map((date) => formatDate(date, format, options))
        .join(',')
    },
    parser(value: string | any[], format?: string) {
      const values = isString(value) ? value.split(',') : value
      if (!isArray(values)) {
        // todo: 提示类型必须是数组或字符串
        return []
      }
      const result = values.map((value: any) => {
        if (isDate(value)) return dayjs(value)
        if (typeof value === 'string') value = value.trim()
        else if (typeof value !== 'number' && !value) value = ''
        return parseDate(value, format)
      })

      return result
    },
  },
}

export const initTimeDate = function () {
  return dayjs().hour(0).minute(0).second(0).millisecond(0)
}

export function clearHours(day: Dayjs) {
  return day.hour(0).minute(0).second(0).millisecond(0)
}

export function formatDateLabels(locale: string, format: string, day: Dayjs) {
  // eslint-disable-next-line no-useless-escape
  const componetsRegex = /(\[[^\]]+\])([^\[\]]+)(\[[^\]]+\])/
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const components = format.match(componetsRegex)!.slice(1)
  const separator = components[1]
  const labels = [components[0], components[2]].map((component) => {
    const label = day.format(converFormat(component.slice(1, -1)))
    return {
      label: label,
      type: component.indexOf('yy') !== -1 ? 'year' : 'month',
    }
  })
  return {
    separator: separator,
    labels: labels,
  }
}

export const getDayCountOfMonth = function (year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

export const getFirstDayOfMonth = function (date: Dayjs) {
  const temp = date.date(1)
  return temp.day()
}

export function siblingMonth(day: Dayjs, diff: number) {
  return day.add(diff, 'month')
}

export function isInRange(day: Dayjs, from?: Dayjs, to?: Dayjs, unit: OpUnitType | null = null) {
  if (!from || !to) {
    return false
  }
  return day.isBetween(from, to, unit, '[]')
}

export function max(...args: Dayjs[]) {
  const a = args.filter((d) => d) // 过滤掉可能为空的选项
  return dayjs.max(...a)
}

export function getFirstDayOfWeek(date: Dayjs, weekStart = 1) {
  const day = dayjs(date).locale(Object.assign(zh, {
    weekStart,
    name: `zh-cn-${weekStart}`,
  }))
  return day.weekday(0)/* .toDate() */
}

export function getLastDayOfWeek(date: Dayjs, weekStart: number) {
  const first = getFirstDayOfWeek(date, weekStart)
  return dayjs(first).add(6, 'd')/* .toDate() */
}
