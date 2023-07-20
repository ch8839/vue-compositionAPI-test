import { ResultList } from './ResultList'
import { JoyServiceSelectTime } from './JoyServiceSelectTime'
export interface t extends ResultList.t {
  type?: number
  emptyListIcon?: string
  inactiveIcon?: string
  activeIcon?: string
  timeRange?: string
  list?: JoyServiceSelectTime.t[]
}
