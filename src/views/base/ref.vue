<template>
  <div>
    <h2>ref</h2>
    <div>
      Capacity： {{ capacity }} (count: {{ capacityObj.count }}, count2:
      {{ capacityObj2_count }})
    </div>
    <div>attending: {{ attending }}</div>
    <ul>
      <li v-for="(name, index) in attending" :key="index">{{ name }}</li>
    </ul>
    <p>Spases Left: {{ sapcesLeft }} out of {{ capacity }}</p>

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

    // ref 在模板中作为顶层属性被访问时，它们会被自动“解包”，相当于 {{ object.foo.value }}，所以不需要使用 .value
    // 仅当 ref 是模板渲染上下文的顶层属性时才适用自动“解包, capacityObj是顶层属性

    // 在模板中可以直接使用capacityObj.count 和 capacityObj.count+1
    const capacityObj = ref({
      count: 3,
    })
    // capacityObj2不是顶层属性，capacityObj.count能展示，但capacityObj2.count+1不行
    const capacityObj2 = {
      count: ref(0),
    }
    // 通过将 count 改成顶层属性来解决
    const capacityObj2_count = capacityObj2.count

    watch(capacity, (newVal, oldVal) => {
      console.log('watch capacity:', newVal, oldVal)
    })
    watch(
      attending,
      (newVal, oldVal) => {
        console.log('watch attending:', newVal, oldVal, newVal.length)
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
      capacityObj.value.count++

      // 这样写也能触发capacityObj的count响应式更新，且非深层watch能监听到
      // const count = capacityObj.value.count
      // capacityObj.value = {
      //     count: count+1
      // }

      const count2: Ref<number> = capacityObj2.count
      // 由于capacityObj2_count的引用就是capacityObj2.count的引用，所以改变capacityObj2.count会同样改变capacityObj2_count
      count2.value++
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
      capacityObj2,
      capacityObj2_count,
      increaseCapacity,
      increaseAttending,
      changeAttending,
      attending,
      sapcesLeft,
    }
  },
})
</script>
