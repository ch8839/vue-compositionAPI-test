import { useListeners, useAttrs } from '@components/hooks/pass-through'
import { addClass, removeClass } from '@utils/dom'
import { defineComponent } from '@ss/mtd-adapter'

const MTDTransition = {
  beforeEnter(el: HTMLElement) {
    addClass(el, 'collapse-transition')
    el.style.height = '0'
  },

  enter(el: HTMLElement) {
    if (el.scrollHeight !== 0) {
      el.style.height = el.scrollHeight + 'px'
    } else {
      el.style.height = ''
    }
    addClass(el, 'collapse-overflow')
  },

  afterEnter(el: HTMLElement) {
    // for safari: remove class then reset height is necessary
    removeClass(el, 'collapse-transition collapse-overflow')
    el.style.height = ''
  },

  beforeLeave(el: HTMLElement) {
    if (!el.dataset) (el as any).dataset = {}
    el.style.height = el.scrollHeight + 'px'
    addClass(el, 'collapse-overflow')
  },

  leave(el: HTMLElement) {
    if (el.scrollHeight !== 0) {
      // for safari: add class after set height,
      // or it will jump to zero height suddenly, weired
      addClass(el, 'collapse-transition')
      el.style.height = '0'
    }
  },

  afterLeave(el: HTMLElement) {
    removeClass(el, 'collapse-transition collapse-overflow')
    el.style.height = ''
  },
}

/* const MtdCollapseTransition = (props: any, { slots }: any) => {
  const myProps = useAttrs(props)
  const myListeners = useListeners(MTDTransition)
  return h('transition', { ...myProps.value, ...myListeners.value }, slots)
}


MtdCollapseTransition.install = (app: App) => {
  app.component('MtdCollapseTransition', MtdCollapseTransition)
}

export default MtdCollapseTransition */

export default defineComponent({
  name: 'MtdCollapseTransition',
  functional: true,

  render(h, context) {
    const { children, props } = context
    const myProps = useAttrs(props)
    const myListeners = useListeners(MTDTransition)
    const data = {
      ...myProps.value,
      ...myListeners.value,
    }

    return h('transition', data, children)
  },
})
