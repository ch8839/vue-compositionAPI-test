<template>
<div>
  <mtd-pagination
    size="small"
    :total="600"
    show-quick-jumper
    show-size-changer
    show-total
    @change="change"
    :current-page.sync="currentPageMore"
    :page-size.sync="currentPageSize" />
</div>
</template>
<script>
export default {
  data () {
    return {
      currentPageMore: 1,
      currentPageSize: 10,
    }
  },
  methods: {
    change (current, size) {
      console.log(current, size)
    },
  },
}
</script>
