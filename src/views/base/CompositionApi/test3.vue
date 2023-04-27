<template>
<div>
  <button @click="increment">Count is: {{ count }}</button>
  <button @click="increment2">Count2 is: {{ count2 }}</button>
</div>
</template>

<script lang="ts">
import { ref, onMounted } from "@vue/composition-api";
import type { Ref } from '@vue/composition-api'
export default {
  setup() {
    const count: Ref<number> = ref(0);
    const count2: Ref<string | number> = ref(0);

    function increment() {
      count.value++;
    }

    function increment2() {
      count2.value += '$'
    }

    onMounted(() => {
      console.log(`The initial count is ${count}.`);
    });
    return {
      count,
      increment,
      count2,
      increment2
    }
  },
};
</script>
