<template>
  <div>
    <mtd-simulate show-child @click="test">
      <div v-if="a">我是罗杰</div>
      <template #content />
    </mtd-simulate>
    <mtd-switch v-model="a" />
  </div>
</template>
<script>
import MtdSimulate from '../simulate'
export default {
  components: {
    MtdSimulate,
  },
  data() {
    return {
      a: true,
    }
  },

  methods: {
    test() {

    },
  },
}
</script>
