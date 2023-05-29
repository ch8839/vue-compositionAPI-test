<template>
<div>
  From B: {{ store.count }}
  <button @click="store.increment()">
    {{ store.count }}
  </button>

  Form B-provide: {{ simpleStore.count }}
</div>
</template>

<script>
import { computed, defineComponent, ref, onMounted, inject } from '@vue/composition-api'
import { store } from '@/simple-store/index'
export default defineComponent({
  setup() {
    const simpleStore = inject('simpleStore')
    return {
      store,
      simpleStore
    }
  }
})
</script>

