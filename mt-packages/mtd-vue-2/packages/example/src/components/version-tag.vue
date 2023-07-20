<template>
  <mtd-tag theme="gray" size="small">version: <slot>{ version }</slot></mtd-tag>
</template>
<script>
export default {
  name: 'VersionTag',
  props: {
    version: String,
  },
};
</script>
