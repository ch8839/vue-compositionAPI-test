<template>
  <div>
    <h2>grandson1</h2>
    <p> message: {{message }}</p>
    <p>receive_product.count: {{ receive_product.count}}</p>
    <!-- vue2 inject不会自动解包，vue3会 -->
    <p>myShopCount: {{myShopCount}}</p>
    <p>{{ count }}</p>
    <p>myInjectionValue1: {{myInjectionValue1}}</p>
  </div>
</template>

<script>
import { myInjectionKey1 } from '../key'

export default {
  inject: {
    message: 'message',
    receive_product: {
      from: 'product',
      default: 1
    },
    myShopCount: 'shopCount',
    myInjectionValue1: myInjectionKey1
  },
  data() {
    return {
      // 注入会在组件自身的状态之前被解析，因此你可以在 data() 中访问到注入的属性
      count: this.receive_product.count + 10
    }
  }
  // 简写
  // inject: ['message'],
}
</script>

<style></style>
