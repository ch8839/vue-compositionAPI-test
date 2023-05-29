<template>
  <div>
    <mtd-simulate>
      <mtd-simulate-child>1</mtd-simulate-child>
      <mtd-simulate-child>2</mtd-simulate-child>
      <mtd-simulate-child>3</mtd-simulate-child>
      <mtd-button>
        <mtd-simulate-child>🤡①</mtd-simulate-child>
      </mtd-button>
      <template #content>
        <div>
          <mtd-simulate-child>🤡②</mtd-simulate-child>
        </div>
      </template>
    </mtd-simulate>
  </div>
</template>
<script>
import MtdSimulate from '../simulate'
import MtdSimulateChild from '../simulateChild'
export default {
  components: {
    MtdSimulate,
    MtdSimulateChild,
  },
  data() {
    return {}
  },

  methods: {

  },
}
</script>
