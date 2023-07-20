<template>
  <div>
    <MtdSimulate show-child>
      默认内容
      <template #content>
          <div>
            CONTENT 💧
          </div>
        </template>
       
    </MtdSimulate>
  </div>
</template>
<script>
import MtdSimulate from '../simulate'
import Comp from './comp.vue'
export default {
  components: {
    MtdSimulate,
    Comp,
  },
  data() {
    return {}
  },
  methods: {

  },
}
</script>
