<template>
  <div>
    <mtd-pagination
      :total="60"
      :show-total="false"
      :current-page.sync="currentPage"
      v-model:current-page="currentPage"
      @change="test"
    />
  </div>
</template>
<script>
export default {
  data () {
    return {
      currentPage: 1,
    }
  },

  methods: {
    test(current, size) {
      console.log(current, size)
    },
  },
}
</script>
