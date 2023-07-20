<template>
  <div>
    {{ title }}
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'SidebarExample',
  computed: {
    title() {
      return (this as any).$route.params.name;
    },
  },
});
</script>
