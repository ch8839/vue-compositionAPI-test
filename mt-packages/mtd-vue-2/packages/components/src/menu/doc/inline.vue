<template>
  <div>
    <div style="width: 200px;">
      <mtd-menu v-model="activeName" mode="inline">
        <mtd-submenu name="1" icon="home-o">
          <template #title>一级菜单</template>
          <mtd-menu-item name="1-1">
            二级菜单
          </mtd-menu-item>
          <mtd-menu-item name="1-2">
            二级菜单
          </mtd-menu-item>
        </mtd-submenu>
        <mtd-submenu name="2" icon="calendar-o">
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
        <mtd-menu-item name="1-3" icon="time-o">
          一级菜单
        </mtd-menu-item>
      </mtd-menu>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      activeName: '',
    }
  },
}
</script>
<style lang="scss">
.demo-menu-wrap {
  width: 400px;
  display: inline-block;
}
</style>
