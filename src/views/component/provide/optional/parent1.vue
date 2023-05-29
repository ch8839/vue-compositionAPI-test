<template>
  <div>
    <h2>parent1</h2>
    product.count: {{ product.count }}
    shopCount: {{ shopCount }}
    <button @click="handleClick">add</button>
    <Child1></Child1>
  </div>
</template>

<script>
import { computed } from '@vue/composition-api'
import Child1 from './child1'
import { myInjectionKey1 } from '../key'

export default {
  components: {
    Child1,
  },
  // provide: {
  //   message: 'hello I am parent1',   
  // },
  provide() {
    // 使用函数的形式，可以访问到 `this`
    return {
      message: 'hello I am parent1', 
      // provide 和 inject 绑定并不是可响应的。这是刻意为之的。然而，如果你传入了一个可监听的对象，那么其对象的 property 还是可响应的
      product: this.product,
      // vue3的方法
      shopCount: computed(() => this.shopCount),
      // 使用 Symbol 作注入名
      [myInjectionKey1]: 'hh'
    }
  },
  data() {
    return {
      product:{
        count: 0
      },
      shopCount:0
    }
    
  },
  methods: {
    handleClick() {
      this.product.count++
      this.shopCount++
    },
  },
}
</script>

<style></style>
