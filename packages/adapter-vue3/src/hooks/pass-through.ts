import { computed, SetupContext } from 'vue'
import { vueInstance } from './instance'

const onRE = /^on[^a-z]/
const isOn = (key: string) => onRE.test(key)
/*
* 返回重置后的attrs，（不包含class和style，和onXxxx事件）
* allowClassStyle 仅限 vue3使用
*/
export const useResetAttrs = (myAttrs: any, allowClassStyle = false) => {
  const r = computed(() => {
    if (!myAttrs) {
      return myAttrs
    }

    let attrs: any = {}
    const { class: cls, style, ...tempAttrs } = myAttrs

    if (allowClassStyle) {
      attrs = myAttrs
    } else {
      attrs = tempAttrs
    }

    const restAttrs: any = {}
    for (const key in attrs) {
      if (!isOn(key)) {
        restAttrs[key] = attrs[key]
      }
    }
    return restAttrs
  })
  return r
}

const toListenersKey = (key: string) => {
  const temp = key.slice(2)
  return temp.replace(temp[0], temp[0].toLowerCase())
}
const toAttrsKey = (key: string) => {
  const temp = key.replace(key[0], key[0].toUpperCase())
  return 'on' + temp
}
export const getListeners = () => {
  const ins = vueInstance()!

  const listeners = computed(() => {
    const result: any = {}
    for (const key in ins.$attrs) {
      if (isOn(key)) {
        result[toListenersKey(key)] = ins.$attrs[key]
      }
    }
    return result
  })
  return listeners
}

export const useListeners = (myListeners?: any, deleteEventNames?: string[]) => {
  const resetListeners = computed(() => {
    const listeners = getListeners().value
    if (deleteEventNames && Array.isArray(deleteEventNames)) {
      deleteEventNames.forEach((name: string) => {
        delete listeners[name]
      })
    }
    const temp = {
      ...listeners,
      ...myListeners,
    }
    const result: any = {}
    for (const key in temp) {
      result[toAttrsKey(key)] = temp[key]
    }
    return result
  })
  return resetListeners
}

export const useAllAttrs = (ctx: SetupContext) => {
  const $listeners = getListeners()
  const restListeners = useListeners($listeners.value)
  const restattrs = useResetAttrs(ctx.attrs)

  const allAttrs = computed(() => {
    return { ...restListeners.value, ...restattrs.value }
  })

  return allAttrs
}
/*
* 获取class和style
*/
export const useClassStyle = () => {
  // 有些类名不允许被注入
  const ins = vueInstance()!

  return computed(() => {
    return {
      class: ins.$attrs.class,
      style: ins.$attrs.style,
    }
  })
}

/*
*  no hook
*
*/
interface AllProps {
  props?: { [key: string]: any },
  attrs?: { [key: string]: any },
  on?: { [key: string]: any },
  class?: { [key: string]: any } | string,
  style?: { [key: string]: any } | string
}


export const translateIntoProps = (allProps: AllProps) => {

  return {
    ...allProps.attrs,
    ...allProps.props,
    on: allProps.on,
    class: allProps.class,
    style: allProps.style,
  }
}
