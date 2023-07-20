<template>
<div>
  <p>receiveMsg: {{msg}}</p>
  <p>Msg-toUpperCase: {{receiveMsg}}</p>
  <button @click="increment">Count is: {{ count }}</button>
  <button @click="increment2">Count2 is: {{ count2 }}</button>
</div>
</template>

<script lang="ts">
import { ref, onMounted } from "@vue/composition-api";
import type { Ref } from '@vue/composition-api'
export default {
  props: {
    msg: {
      type: String
    }
  },
  setup(props, { slots, emit }) {
    const count: Ref<number> = ref(1);
    const count2: Ref<string | number> = ref(0);
    const receiveMsg = props.msg.toUpperCase()

    function increment() {
      count.value++;
    }

    function increment2(event: Event) {
      // console.log('event.target', [event.target])
      console.log('event.target', (event.target as HTMLButtonElement).innerText)
      count2.value += '+'
    }

    onMounted(() => {
      console.log(`test2: The initial count is ${count.value}.`);
    });
    return {
      count,
      increment,
      count2,
      increment2,
      receiveMsg
    }
  },
};
</script>
