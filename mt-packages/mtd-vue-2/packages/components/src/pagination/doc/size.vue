<template>
<div class="demo-full-width">
  <div>
    <p>小型</p>
    <mtd-pagination
      size="small"
      :total="60"
      :current-page.sync="currentPage1"
      v-model:current-page="currentPage1"
      style="display: inline-block;" />
  </div><br>
  <div>
    <p>默认</p>
    <mtd-pagination
      :total="60"
      :current-page.sync="currentPage2"
      v-model:current-page="currentPage2"
      style="display: inline-block;" />
  </div>
</div>
</template>
<script>
export default {
  data () {
    return {
      currentPage1: 1,
      currentPage2: 1,
    }
  },
}
</script>
