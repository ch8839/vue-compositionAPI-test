<template>
  <div>
    <mtd-menu class="demo-menu-theme" v-model="activeName" theme="dark">
      <mtd-submenu name="1">
        <template slot="title">一级菜单</template>
        <mtd-icon slot="icon" name="home-o" />
        <mtd-menu-item name="1-1">
          二级菜单
          <mtd-icon name="question-circle-o" slot="icon" />
        </mtd-menu-item>
        <mtd-menu-item name="1-2">
          二级菜单
          <mtd-icon name="question-circle-o" slot="icon" />
        </mtd-menu-item>
        <mtd-icon slot="icon" name="code" />
      </mtd-submenu>
      <mtd-submenu name="2">
        <span slot="title">一级菜单</span>
        <mtd-submenu name="2-1">
          <template slot="title">二级菜单</template>
          <mtd-menu-item name="2-1-1">
            三级菜单
            <mtd-icon name="question-circle-o" slot="icon" />
          </mtd-menu-item>
          <mtd-menu-item name="2-1-2">
            三级菜单
            <mtd-icon name="question-circle-o" slot="icon" />
          </mtd-menu-item>
          <mtd-icon slot="icon" name="code" />
        </mtd-submenu>
        <mtd-icon name="cart-o" slot="icon" />
      </mtd-submenu>
      <mtd-menu-item name="1-3">
        一级菜单
        <mtd-icon name="calendar-o" slot="icon" />
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
