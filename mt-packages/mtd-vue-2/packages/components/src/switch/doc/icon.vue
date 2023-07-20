<template>
  <div>
    <mtd-switch
      v-model="value"
      checked-children="开"
      un-checked-children="关"
    />
    <mtd-switch v-model="value2">
      <template #checkedChildren
        ><i class="mtdicon mtdicon-check-switch" style="font-size:12px"
      /></template>
      <template #unCheckedChildren
        ><i class="mtdicon mtdicon-close-switch" style="font-size:12px"
      /></template>
    </mtd-switch>
  </div>
</template>
<script>
import { defineComponent, ref } from "@ss/mtd-adapter"
export default defineComponent({
  setup() {
    return {
      value: ref(true),
      value2: ref(true),
    }
  },
})
</script>
