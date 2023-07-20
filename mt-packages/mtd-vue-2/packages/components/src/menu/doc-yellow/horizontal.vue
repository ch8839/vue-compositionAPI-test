<template>
  <div>
    <div class="demo-menu-horizontal-wrap">
    <mtd-menu v-model="activeName" mode="horizontal">
      <mtd-submenu name="1">
        <mtd-icon slot="icon" name="home-o" />
        <template slot="title">一级菜单</template>
        <mtd-menu-item name="1-1">
          二级菜单
          <mtd-icon slot="icon" name="home-o" />
        </mtd-menu-item>
        <mtd-menu-item name="1-2">
          二级菜单
          <mtd-icon name="calendar-o" slot="icon" />
        </mtd-menu-item>
      </mtd-submenu>
      <mtd-submenu name="2">
        <mtd-icon slot="icon" name="calendar-o" />
        <span slot="title">一级菜单</span>
        <mtd-submenu name="2-1">
          <mtd-icon name="calendar-o" slot="icon" />
          <template slot="title">二级菜单</template>
          <mtd-menu-item name="2-1-1" :route="{path: 'modal'}">
            三级菜单
            <mtd-icon name="calculator-o" slot="icon" />
          </mtd-menu-item>
          <mtd-menu-item name="2-1-2" :route="{ path: 'anchor'}">
            三级菜单
            <mtd-icon name="calculator-o" slot="icon" />
          </mtd-menu-item>
        </mtd-submenu>
      </mtd-submenu>
      <mtd-menu-item name="3-1">
        <mtd-icon name="calculator-o" slot="icon" />
        一级菜单
      </mtd-menu-item>
    </mtd-menu>
    <br>
    <br>
    <br>
    <mtd-menu v-model="activeName2" mode="horizontal" theme="dark">
      <mtd-submenu name="1">
        <mtd-icon slot="icon" name="home-o" />
        <template slot="title">一级菜单</template>
        <mtd-menu-item name="1-1">
          二级菜单
          <mtd-icon name="home-o" slot="icon" />
        </mtd-menu-item>
        <mtd-menu-item name="1-2">
          二级菜单
          <mtd-icon name="calendar-o" slot="icon" />
        </mtd-menu-item>
      </mtd-submenu>
      <mtd-submenu name="2">
        <mtd-icon slot="icon" name="calendar-o" />
        <span slot="title">一级菜单</span>
        <mtd-submenu name="2-1">
          <mtd-icon name="calendar-o" slot="icon" />
          <template slot="title">二级菜单</template>
          <mtd-menu-item name="2-1-1" :route="{path: 'modal'}">
            三级菜单
            <mtd-icon name="calculator-o" slot="icon" />
          </mtd-menu-item>
          <mtd-menu-item name="2-1-2" :route="{ path: 'anchor'}">
            三级菜单
            <mtd-icon name="calculator-o" slot="icon" />
          </mtd-menu-item>
        </mtd-submenu>
      </mtd-submenu>
      <mtd-menu-item name="3-1">
        <mtd-icon name="calculator-o" slot="icon" />
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
      activeName2: '',
    }
  },
}
</script>
<style lang="scss">
.demo-menu-horizontal-wrap {
  width: 100%;
  margin-bottom: 100px;

}
</style>
