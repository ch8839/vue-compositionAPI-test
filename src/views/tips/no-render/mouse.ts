import { ref, onMounted, onUnmounted } from '@vue/composition-api'

export const useEventListener = (target: any, eventName: string, callback: Function) => {
  onMounted(() => target.addEventListener(eventName, callback))
  onUnmounted(() => target.removeEventListener(eventName, callback))
}

export const useMouse = () => {

  const x = ref(0)
  const y = ref(0)

  const update = (e: MouseEvent) => {
    x.value = e.pageX
    y.value = e.pageY
  }

  useEventListener(window, 'mousemove', update)

  return {
    x,
    y,
  }
}
