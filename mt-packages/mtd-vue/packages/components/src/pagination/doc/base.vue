<template>
  <div>
    <mtd-pagination
      :total="60"
      :show-total="false"
      :current-page.sync="currentPage"
    />
  </div>
</template>
<script>
export default {
  data () {
    return {
      currentPage: 1,
    };
  },
};
</script>
