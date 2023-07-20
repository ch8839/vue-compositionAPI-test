<template>
  <mtd-menu v-model="activeName" mode="horizontal" @select="handleSelect">
    <mtd-menu-item name="1">
      一级菜单
    </mtd-menu-item>
    <mtd-submenu name="2">
      <template #title>一级菜单</template>
      <mtd-submenu name="2-1">
        <template #title>二级菜单</template>
        <mtd-menu-item name="2-1-1">
          三级菜单
        </mtd-menu-item>
        <mtd-menu-item name="2-1-2">
          三级菜单
        </mtd-menu-item>
      </mtd-submenu>
    </mtd-submenu>
    <mtd-submenu name="3">
      <template #title>一级菜单</template>
      <mtd-menu-item name="3-1">
        二级菜单
      </mtd-menu-item>
      <mtd-menu-item name="3-2">
        二级菜单
      </mtd-menu-item>
    </mtd-submenu>
  </mtd-menu>
</template>
<script>
export default {
  data() {
    return {
      activeName: "",
    }
  },
  methods: {
    handleSelect(v) {
      console.log(v)
    }
  }
}
</script>
<style lang="scss">
.demo-menu-wrap {
  width: 400px;
  display: inline-block;
}
</style>
