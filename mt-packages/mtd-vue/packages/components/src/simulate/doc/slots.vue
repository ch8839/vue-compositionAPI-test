<template>
  <div>
    <mtd-simulate show-child>
      默认内容
      <template #content>
        具名内容
      </template>
      <template #content-scope>
        作用域内容
      </template>
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

  },
}
</script>
