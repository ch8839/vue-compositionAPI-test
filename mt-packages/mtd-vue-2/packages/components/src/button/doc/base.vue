<template>
  <div>
    <mtd-button type="primary" @click="test">
      基础按钮
    </mtd-button>
  </div>
</template>
<script>
export default {
  data() {
    return {}
  },

  methods: {
    test() {
      console.log('你按下了按钮')
    },
  },
}
</script>
