<template>
  <div class="demo-sidebar-container demo-full-width">
    <div class="demo-sidebar-aside">
      <mtd-sidebar 
        :data="data"
        :model-value="activeKey"
        title="导航标题"
        @menu-item-click="handleItemClick"
        @menu-expand-change="handleExpandChange">
        <template #submenu="scope">
          <div>
            {{ scope &&scope.item.title }}（{{ scope && scope.item.children.length }} 项）
          </div>
        </template>
        <template #item="scope">
          <div>
            自定义 {{ scope.item.title }}
          </div>
        </template>
      </mtd-sidebar>
    </div>
    <div class="demo-sidebar-main">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      'data': [{
        icon: 'mtdicon mtdicon-home-o',
        title: '一级菜单',
        id: '1',
        children: [{
          title: '二级菜单',
          id: '1-1',
          route: '/components/sidebar/1-1',
        }, {
          title: '二级菜单',
          id: '1-2',
          route: '/components/sidebar/1-2',
        }, {
          title: '二级菜单',
          id: '1-3',
          route: '/components/sidebar/1-3',
        }],
      }, {
        icon: 'mtdicon mtdicon-cart-o',
        title: '一级菜单',
        id: '2',
        children: [{
          title: '二级菜单',
          id: '2-1',
          route: '/components/sidebar/2-1',
        }, {
          title: '二级菜单',
          id: '2-2',
          route: '/components/sidebar/2-2',
        }, {
          title: '二级菜单',
          id: '2-3',
          route: '/components/sidebar/2-3',
        }],
      }, {
        icon: 'mtdicon mtdicon-time-o',
        title: '一级菜单',
        id: '3',
        route: '/components/sidebar/3',
      }, {
        icon: 'mtdicon mtdicon-calendar-o',
        title: '一级菜单',
        id: '4',
        route: '/components/sidebar/4',
      }],
    }
  },
  computed: {
    activeKey () {
      return this.$route.params.name
    },
  },
  methods: {
    handleItemClick ({key, item}) {
      console.log('click', key, item)
    },
    handleExpandChange ({expandKeys, key, item, expanded}) {
      console.log('expand', expandKeys, key, item, expanded)
    },
  },
}
</script>
<style lang='scss' scoped>
  .demo-sidebar-container {
    display: flex;
    height: 600px;
  }

  .demo-sidebar-aside {
    flex: 0 0 auto;
    position: relative;
    z-index: 1;
  }

  .demo-sidebar-main {
    min-width: 0;
    flex: 1 1 auto;
    background-color: #f7f8fc;
    padding: 20px;
  }
</style>
