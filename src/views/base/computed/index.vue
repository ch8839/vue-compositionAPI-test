<template>
  <div>
    <h2>ref</h2>
    <div>
      Capacity: {{ capacity }} , sapcesLeft: {{ sapcesLeft }}
    </div>
    <div>attending: {{ attending }}</div>
    <ul>
      <li v-for="(name, index) in attending" :key="index">{{ name }}</li>
    </ul>

    <button @click="increaseCapacity()">Increase Capacity</button>
    <button @click="increaseAttending()">Increase Attending</button>
    <button @click="changeAttending()">Change Attending</button>
  </div>
</template>

<script lang="ts">
import { ref, computed, watch, defineComponent } from '@vue/composition-api'
import type { Ref } from '@vue/composition-api'

export default defineComponent({
  name: 'Computed',
  setup(props, context) {
    // 对基本数据类型数据进行装箱操作使得成为一个响应式对象，可以跟踪数据变化
    const capacity = ref(3)
    const attending = ref(['Tim', 'Bob', 'Joe'])

    function increaseCapacity() {
      capacity.value++
      console.log('>>>capacity.value', capacity.value)
    }
    function increaseAttending() {
      attending.value.push('Tom')
    }

    function changeAttending() {
      attending.value = ['Tim2', 'Bob2', 'Joe2']
    }

    const sapcesLeft = computed(() => {
      return capacity.value - attending.value.length
    })
    return {
      capacity,
      increaseCapacity,
      increaseAttending,
      changeAttending,
      attending,
      sapcesLeft,
    }
  },
})
</script>
