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
    v-model:current-page="currentPageMore"
    :page-size.sync="currentPageSize" 
    v-model:page-size="currentPageSize"
    />
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
