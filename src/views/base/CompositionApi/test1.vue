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
      console.log(`test1: The initial count is ${count.value}.`);
    });
    return {
      count,
      increment
    }
  },
};
</script>
