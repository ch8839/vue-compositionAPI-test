<template>
  <div>
    {{ title }}
  </div>
</template>
<script>
export default {
  name: 'SidebarExample',
  computed: {
    title () {
      return this.$route.params.name;
    },
  },
};
</script>
