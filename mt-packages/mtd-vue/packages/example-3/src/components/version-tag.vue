<template>
  <mtd-tag theme="gray" size="small">version: <slot>{ version }</slot></mtd-tag>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'VersionTag',
  props: {
    version: String,
  },
});
</script>
