<template>
  <div style="border: 1px solid green">
    <slot name="item" :item="item"> 我不爱你 </slot>
  </div>
</template>
<script lang="ts">
export default {
  name: 'AAA',
  data() {
    return {
      item: {
        data: '我爱你😄',
      },
    }
  },

}
</script>
