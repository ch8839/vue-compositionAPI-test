<template>
  <div>
    <mtd-simulate show-child @click="test">
      默认内容
    </mtd-simulate>
  </div>
</template>
<script>
import MtdSimulate from '../simulate'
export default {
  components: {
    MtdSimulate,
  },
  data() {
    return {}
  },

  methods: {
    test() {

    },
  },
}
</script>
