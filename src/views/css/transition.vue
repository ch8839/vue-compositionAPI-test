<template>
  <div>
    <button @click="increment">Count is: {{ count }}</button>
    <div class="box1" :class="{ 'box-translate': isTranslate }">hhh</div>
    <div class="box2" :class="{ 'box-animation': isTranslate }">hhh</div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from '@vue/composition-api'
export default {
  setup() {
    const count = ref(0)
    const isTranslate = ref(false)

    function increment() {
      isTranslate.value = !isTranslate.value
      count.value++
    }

    onMounted(() => {
      console.log(`The initial count is ${count}.`)
    })
    return {
      count,
      isTranslate,
      increment,
    }
  },
}
</script>

<style lang="scss" scoped>
.box1 {
  height: 200px;
  width: 200px;
  background: rgb(48, 126, 216);
  transition: all 1s ease;
}
.box-translate {
  transform: translateX(20px);
}

.box2 {
  margin-top: 100px;
  height: 200px;
  width: 200px;
  background: rgb(97, 212, 149);
  // transition: all 1s ease;
}
.box-animation {
  animation: translateX 1.04s ease infinite alternate;
}
@keyframes translateX {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(20px);
  }
}
// .box1:hover {
//   transform: scale(1.2, 1.2);
// }
</style>
