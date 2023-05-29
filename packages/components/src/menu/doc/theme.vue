<template>
  <div>
    <mtd-menu class="demo-menu-theme" v-model="activeName" theme="dark">
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
</template>
<script>
export default {
  data () {
    return {
      activeName: '',
      theme: 'light',
    }
  },
}
</script>
<style lang="scss">
.demo-menu-theme {
  width: 200px;
}
</style>
