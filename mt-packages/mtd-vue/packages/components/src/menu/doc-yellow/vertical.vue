<template>
  <div class="demo-menu-vertical-wrap">
    <mtd-menu v-model="activeName" mode="vertical">
      <mtd-submenu name="1" icon="home-o">
        <img slot="activeIcon" src="../../assets/img/home-y.png">
        <template slot="title">一级菜单</template>
        <mtd-menu-item name="1-1">
          二级菜单
        </mtd-menu-item>
        <mtd-menu-item name="1-2">
          二级菜单
        </mtd-menu-item>
      </mtd-submenu>
      <mtd-submenu name="2" icon="cart-o">
        <img slot="activeIcon" src="../../assets/img/cart-y.png">
        <span slot="title">一级菜单</span>
        <mtd-submenu name="2-1">
          <template slot="title">二级菜单</template>
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
        <img slot="activeIcon" src="../../assets/img/time-y.png">
      </mtd-menu-item>
    </mtd-menu>
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
.demo-menu-vertical-wrap {
  width: 240px;
}
</style>
