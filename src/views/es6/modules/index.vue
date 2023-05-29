<template>
  <div class="es6-container">
    es6-modules
    <div class="shape"></div>
  </div>
</template>

<script lang="ts">
import { components } from './index'
console.log('>>>components2', components)

export default ({
  
 
})
</script>

<style lang="scss" scoped>
  .es6-container {
    .shape {
      // box-sizing: content-box;
      width: 160px;
      height: 80px;
      border-left: 80px solid transparent;
      border-right: 80px solid transparent;
      border-bottom: 80px solid #111111

    }
  }
</style>
