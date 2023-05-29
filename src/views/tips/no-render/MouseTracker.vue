<template>
  <div>
    <slot :slotProps="{ x, y }"></slot>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, onUnmounted } from '@vue/composition-api'
export default {
  // 只包括了逻辑而不需要自己渲染内容，视图输出通过作用域插槽全权交给了消费者组件
  setup() {
    const slotProps = ref(0)

    const x = ref(0)
    const y = ref(0)

    const update = (e) => {
      x.value = e.pageX
      y.value = e.pageY
    }

    onMounted(() => window.addEventListener('mousemove', update))
    onUnmounted(() => window.removeEventListener('mousemove', update))

    return {
      x,
      y,
    }
  },
}
</script>
