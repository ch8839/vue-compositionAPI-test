<template>
  <mtd-anchor
    class="title-wrap"
    container=".page"
    :offset-top="180"
    :scroll-offset="60"
    :affix="false"
  >
    <mtd-anchor-link
      v-for="h2 in usedata"
      :href="h2.href"
      :title="h2.title"
      :key="h2.href"
    >
      <mtd-anchor-link
        v-for="h3 in h2.children"
        :href="h3.href"
        :title="h3.title"
        :key="h3.href"
      />
    </mtd-anchor-link>
  </mtd-anchor>
</template>

<script>
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'ExAnClick',
  props: {
    usedata: {
      type: Array,
    },
  },
});
</script>

<style lang="scss" scoped>
.title-wrap {
  z-index: 100;
  position: fixed;
  width: 120px;
  top: 100px;
  right: 20px;
  background-color: #fff;
}
</style>
