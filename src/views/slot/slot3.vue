<template>
  <div>
    <SlotComponent>
      <div>hhh</div>
      <template v-slot:main>main</template>
      <template v-slot:footer>footer</template>
    </SlotComponent>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from "@vue/composition-api";
import SlotComponent from './slot-component'
export default {
  components: {
    SlotComponent,
  },
  // setup() {
  //   return {
      
  //   }
  // },
}
</script>
