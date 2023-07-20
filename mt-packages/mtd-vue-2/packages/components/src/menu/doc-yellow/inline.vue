<template>
  <div>
    <div style="width: 200px;">
      <mtd-menu v-model="activeName" mode="inline">
        <mtd-submenu name="1" icon="home-o">
          <img slot="activeIcon" src="../../assets/img/home-y.png">
          <template slot="title">一级菜单</template>
          <mtd-menu-item name="1-1">
            二级菜单
            <mtd-icon name="cart-o" slot="icon" />
          </mtd-menu-item>
          <mtd-menu-item name="1-2">
            二级菜单
            <template #icon>
              <img src="../../assets/img/calendar-y.png">
            </template>
          </mtd-menu-item>
        </mtd-submenu>
        <mtd-submenu name="2" icon="calendar-o">
          <img slot="activeIcon" src="../../assets/img/calendar-y.png">
          <span slot="title">一级菜单</span>
          <mtd-submenu name="2-1">
            <template #icon>
              <img src="../../assets/img/calendar-y.png">
            </template>
            <template slot="title">二级菜单</template>
            <mtd-menu-item name="2-1-1">
              三级菜单
              <img slot="icon" src="../../assets/img/cart-y.png">
            </mtd-menu-item>
            <mtd-menu-item name="2-1-2">
              三级菜单
              <template #icon>
              <img src="../../assets/img/calendar-y.png">
            </template>
            </mtd-menu-item>
          </mtd-submenu>
        </mtd-submenu>
        <mtd-menu-item name="1-3" icon="time-o">
          一级菜单
          <img slot="activeIcon" src="../../assets/img/time-y.png">
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
