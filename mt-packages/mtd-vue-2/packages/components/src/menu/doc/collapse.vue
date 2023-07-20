<template>
  <div class="demo-full-width">
    <mtd-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
      <mtd-radio-button :value="false">展开</mtd-radio-button>
      <mtd-radio-button :value="true">收起</mtd-radio-button>
    </mtd-radio-group>
    <mtd-menu
      class="demo-menu-collapse"
      v-model="activeName"
      mode="inline"
      theme="dark"
      :collapse="isCollapse">
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
      isCollapse: false,
    }
  },
}
</script>
<style lang="scss">
.demo-menu-collapse{
  width: 200px;
}
</style>
