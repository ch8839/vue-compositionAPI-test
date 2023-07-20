<template>
  <mtd-autocomplete
:data="options" v-model="autoValue" placeholder="请输入"
    :filter-method="filterMethod" />
</template>
<script>
export default {
  data () {
    return {
      options: ['mtd', 'meituan', 'mtdmtd'],
      autoValue: '',
    }
  },
  methods: {
    filterMethod (value, option) {
      if (!value) return true
      return value.slice(0, value.length) === option.slice(0, value.length)
    },
  },
}
</script>