<template>
  <button @click="increment">Count is: {{ count }}</button>
</template>

<script lang="ts">
import { ref, onMounted } from "@vue/composition-api";
export default {
  setup() {
    const count = ref(0);

    function increment() {
      count.value++;
    }

    onMounted(() => {
      console.log(`The initial count is ${count}.`);
    });
    return {
      count,
      increment
    }
  },
};
</script>
