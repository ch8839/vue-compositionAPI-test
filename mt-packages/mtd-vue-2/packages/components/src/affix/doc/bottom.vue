<template>
  <div>
    <div style="height: 1000px" />
    <mtd-affix :offset-bottom="100" :get-target="getTarget">
      <span style="background-color: #666; color: #FFF">
        offset bottom 100
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
