<template>
  <div>
    <h2>ref</h2>
    <div>Capacity: {{ capacity }} , count: {{ capacityObj.count }}</div>
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
  name: 'ref-test',
  // props - 属性 (响应式对象 且 可以监听(watch))
  // context 上下文对象 - 用于代替以前的this方法可以访问的属性
  setup(props, context) {
    // 对基本数据类型数据进行装箱操作使得成为一个响应式对象，可以跟踪数据变化
    const capacity = ref(3)
    const attending = ref(['Tim', 'Bob', 'Joe'])

    // 在模板中可以直接使用capacityObj.count 和 capacityObj.count+1
    const capacityObj = ref({
      count: 3,
    })

    watch(capacity, (newVal, oldVal) => {
      console.log('watch capacity', '\n newVal:', newVal, '\n oldVal:', oldVal)
    })

    watch(
      capacityObj,
      (newVal, oldVal) => {
        console.log(
          'watch capacityObj',
          '\n newVal:',
          newVal,
          '\n oldVal:',
          oldVal
        )
      },
      {
        deep: true,
      }
    )

    watch(
      attending,
      (newVal, oldVal) => {
        console.log(
          'watch attending:',
          '\n newVal:',
          newVal,
          '\n newVal.length:',
          newVal.length,
          '\n oldVal:',
          oldVal
        )
      },
      {
        deep: true,
        immediate: true,
      }
    )

    function increaseCapacity() {
      capacity.value++
      console.log('>>>capacity.value', capacity.value)
      // 这样写能触发capacityObj的count响应式更新，但是非深层watch监听不到
      // 深层watch监听时，前后value是一样的，因为对象的值指向的同一内存空间
      // capacityObj.value.count++

      // 这样写也能触发capacityObj的count响应式更新，且非深层watch能监听到，前后value是不一样的
      // const count = capacityObj.value.count
      // capacityObj.value = {
      //     count: count+1
      // }
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
      capacityObj,
      increaseCapacity,
      increaseAttending,
      changeAttending,
      attending,
      sapcesLeft,
    }
  },
})
</script>
