<template>
  <div>
    <mtd-simulate class="🤡" style="color:green" hello="你好" @click="test" show-msg>
      样式透传
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
    test () {
      console.log('用户的点击事件')
    },
  },
}
</script>
