import { TimelineProvider } from './types'
import { provide, inject } from '@ss/mtd-adapter'

export const timelineSymbol = 'mtui-vue/timeline'

export const useProvider = () => {

  function provideTimeline(ins: TimelineProvider) {
    provide<TimelineProvider>(timelineSymbol, ins)
  }

  function injectTimeline() {
    return inject<TimelineProvider>(timelineSymbol) as TimelineProvider
  }

  return {
    provideTimeline,
    injectTimeline,
  }
}

export default useProvider
