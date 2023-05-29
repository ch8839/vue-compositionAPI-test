<template>
<div>
  From A: {{ store.count }}
</div>
</template>

<script>
import { computed, defineComponent, ref, onMounted } from '@vue/composition-api'
import { store } from '@/simple-store/index'
export default defineComponent({
  setup() {
    return {
      store
    }
  }
})
</script>

