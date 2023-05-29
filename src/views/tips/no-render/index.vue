<template>
  <div>
    <MouseTracker v-slot="{ slotProps }">
      Mouse is at: {{ slotProps.x }}, {{ slotProps.y }}
    </MouseTracker>
    <div>
      Mouse is at: {{ x }}, {{ y }}
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from '@vue/composition-api'
import MouseTracker from './MouseTracker.vue'
import { useMouse } from './mouse'

export default {
  components: {
    MouseTracker,
  },
  setup() {
    const { x, y } = useMouse()
    return { x, y }
  },
}
</script>
