<template>
<div>
  From provide-C: {{ store.count }}

  <button @click="store.increment()">
    {{ store.count }}
  </button>
</div>
</template>

<script>
import { computed, defineComponent, ref, onMounted, inject } from '@vue/composition-api'
export default defineComponent({
  setup() {
    const simpleStore = inject('simpleStore')
    console.log('>>>simpleStore', simpleStore)
    return {
      store: simpleStore
    }
  }
})
</script>

