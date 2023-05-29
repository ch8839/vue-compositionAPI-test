<template>
  <mtd-rate v-model="value4" :texts="['极差', '失望', '一般', '满意', '惊喜']" />
  <mtd-rate text-position="top" v-model="value4" :texts="['极差', '失望', '一般', '满意', '惊喜']" />
  <mtd-rate text-position="bottom" v-model="value4" :texts="['极差', '失望', '一般', '满意', '惊喜']" />
</template>
<script>
export default {
  data () {
    return {
      value4: 3,
    }
  },
}
</script>
