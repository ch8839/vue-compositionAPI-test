
import { computed, SetupContext } from '@vue/composition-api'
import { vueInstance } from './instance'

export const useScopedSlots = (myScopedSlots: any) => {
  const resetScopedSlots = computed(() => {
    return {
      scopedSlots: {
        ...myScopedSlots,
      },
    }
  })
  return resetScopedSlots
}

export const useResetAttrs = (myAttrs: any) => {
  const resetAttrs = computed(() => {
    return {
      attrs: myAttrs,
      props: myAttrs,
    }
  })
  return resetAttrs
}

export const getListeners = () => {
  const ins = vueInstance()
  const resetListeners = computed(() => {
    return (ins && ins.$listeners) || {}
  })
  return resetListeners
}

export const useListeners = (myListeners?: any, deleteEventNames?: string[]) => {
  const resetListeners = computed(() => {
    const listeners = getListeners().value
    if (deleteEventNames && Array.isArray(deleteEventNames)) {
      deleteEventNames.forEach((name: string) => {
        delete listeners[name]
      })
    }
    const result = {
      on: {
        ...listeners,
        ...myListeners,
      },
    }
    /* if (deleteEventNames && Array.isArray(deleteEventNames)) {
      deleteEventNames.forEach((name: string) => {
        delete result.on[name]
      })
    } */
    return result
  })
  return resetListeners
}

export const getScopedSlots = () => {
  const ins = vueInstance()
  const result = computed(() => {
    return ins && ins.$scopedSlots
  })

  return result
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
  const ins = vueInstance()

  return computed(() => {
    const vnodeData = ins.$vnode.data
    return {
      class: vnodeData.staticClass || vnodeData.class,
      style: vnodeData.staticStyle || vnodeData.style,
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
  return allProps
}
