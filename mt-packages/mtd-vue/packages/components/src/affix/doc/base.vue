<template>
  <div>
    <mtd-affix :offset-top="140" :get-target="getTarget">
  <span style="background-color: #666; color: #FFF">
    offset top 140
  </span>
    </mtd-affix>
  </div>
</template>

<script>
export default {
  methods: {
    getTarget () {
      return document.querySelector('.app');
    },
  },
};
</script>
