<template>
  <div
    class="app"
    :class="{
      'hide-top-nav': hideTopNav,
    }"
    ref="scroll"
  >
    <Announcement v-if="!hideAnnouncement" @close="handleCloseAnnouncement" />
    <router-view />
  </div>
</template>
<script lang="ts">
import { h, defineComponent, createApp, nextTick } from 'vue'
import { ITheme, setLink } from './utils'
import eventhub from './common/eventhub'
import Submenu from './components/submenu.vue'
import MTD from '@components/index';
import Announcement from './components/announcement.vue'

const AnnouncementSymbol = '@ss/mtd-vue3_notice_20230404'


function parseSearch(search: string) {
  if (!search) return {}
  return search
    .substr(1)
    .split('&')
    .reduce((state: any, str) => {
      const [key, value] = str.split('=')
      state[key] = value
      return state
    }, {})
}

export default defineComponent({
  name: 'App',
  components: {
    Announcement,
  },
  provide() {
    return {
      app: this,
    }
  },
  data() {
    const query = parseSearch(location.search)
    return {
      hideSidebar: query.hideSidebar === 'true',
      hideTopNav: query.hideTopNav === 'true',
      hideAnnouncement: false,
    }
  },
  computed: {
    theme(): ITheme {
      return (this as any).submenu
        ? (this as any).submenu.$refs.instance.theme
        : { label: '美团UI 3.0 主题', value: 'theme-chalk' }
    },
  },
  watch: {
    $route: {
      immediate: true,
      handler(n, v) {
        const routes = (this as any).$route.matched
        const navbarRoute = routes.find((route:any) => route.meta.navbar)
        if (navbarRoute && window.MTD_Frame) {
          window.MTD_Frame.update('mtd_update:tab', navbarRoute.meta.navbar)
        }

        // sync to submenu
        if ((this as any).submenu) {
          // (this as any).submenu.route = n;
        }
      },
    },
    '$route.query': {
      handler(n) {
        this.hideTopNav = (this as any).$route.query.hideTopNav === 'true'
        this.hideSidebar = (this as any).$route.query.hideSidebar === 'true'
      },
    },
    hideTopNav: {
      immediate: true,
      handler(value) {
        window.MTD_Frame && window.MTD_Frame.update('mtd_update:nav', !value)
      },
    },
  },
  created() {
    this.hideAnnouncement = !!localStorage.getItem(AnnouncementSymbol)
  },
  mounted() {
    // inject in theme tools
    window.addEventListener(
      'message',
      (event) => {
        // if (!event.origin.includes('sankuai.com')) {
        //   return;
        // }
        if (event.data && event.data.name === 'themeStyleURL') {
          const url = event.data.value
          setLink(url)
        }
      },
      false,
    )
    this.listenFrameTabChange()
    nextTick(this.createSubmenu)
  },
  unmounted() {
    eventhub.off('change-router', this.handleRouterChange)
  },
  methods: {
    createSubmenu() {
      const { $route: route, $router: router } = this as any;
      window.MTD_Frame &&
        window.MTD_Frame.mountSlot('subbar-slot', (dom: HTMLElement) => {
          const app = createApp({
            data() {
              return {
                route,
                router,
              };
            },
            render() {
              return h(Submenu, {
                route: this.route,
                router: this.router,
                ref: 'instance',
              });
            },
          });
          app.use(MTD);
          const instance = app.mount(dom);
          (this as any).submenu = instance;
        });
    },
    listenFrameTabChange() {
      window.MTD_Frame &&
        window.MTD_Frame.on('mtd_change:tab', (value: string) => {
          (this as any).$router.push('/' + value)
        })
    },
    handleRouterChange() {
      if ((this as any).$route.name === 'sidebar-example') {
        return
      }
      (this.$refs.scroll as HTMLElement).scrollTop = 0
    },
    handleScroll() {
      eventhub.emit('check-scroll')
    },
    handleCloseAnnouncement () {
      this.hideAnnouncement = true
      localStorage.setItem(AnnouncementSymbol, 'true')
    },
  },
})
</script>
<style lang="scss">
@import './styles/var.scss';
.app {
  height: 100vh;
  padding-top: $header-height;
  overflow: auto;
  overflow-x: hidden;
}
.hide-top-nav {
  padding-top: 0;
}

html,
body {
  // height: 100%;
  min-width: $min-width;
}
h1,
h2,
h3 {
  font-weight: $font-weight-medium;
  color: $color-text-4;
  line-height: 1.5;
}

@media screen and (max-width: $screen-md) {
  body,
  html {
    min-width: auto;
  }
}
.doc-warning {
  border-left: 5px solid $color-danger-1;
  padding: 12px 16px;
  line-height: 20px;
  background: #f8f9fc;
  border-radius: 6px;
}

// page style
.aside {
  position: fixed;
  top: $header-height;
  left: 0;
  bottom: 0;
  overflow: auto;
  width: $sidebar-width;
  background: #fff;
  z-index: $sidebar-index;
  border-right: $border;
  transition: width 0.3s ease-in-out, padding-left 0.2s ease-out;
}
.hide-top-nav {
  .aside {
    top: 0;
  }
}
.sidebar {
  height: 100%;
}
.sidebar-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-items: flex-start;
  padding-top: 50px;
}
.sidebar-search-wrap {
  width: 100%;
  flex: 0 0 auto;
  padding: 0 20px;
  padding-bottom: 10px;
}
.sidebar-navs {
  overflow: auto;
  font-size: 14px;
  line-height: 20px;
  list-style: none;
  white-space: nowrap;
  margin: 0;
  width: 100%;
  padding-bottom: 40px;
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  a {
    color: $color-text-4;
    text-decoration: none;
    font-weight: $font-weight-regular;
    transition: padding-left 0.5s ease;
    padding: $nav-item-padding;
    display: block;
    &:hover {
      color: $color-primary;
      text-decoration: none;
    }
  }
  .router-link-active {
    color: $color-primary;
    background: rgba(10, 112, 245, 0.04);
    font-weight: $font-weight-medium;
  }
}
.sidebar-nav-item-text {
  color: rgba(0, 0, 0, 0.5);
  font-size: 12px;
  padding: $nav-item-padding;
}

.page-content {
  margin-left: $sidebar-width;
}
.no-sidebar {
  margin-left: 0;
}

.narrow-scrren-expand-bar.mtd-btn {
  display: none;
  position: fixed;
  top: 120px;
  z-index: 9999;
  left: 0;
  &.expanded {
    left: $sidebar-width;
  }
}
@media screen and (max-width: $screen-md) {
  .aside {
    width: 0;
    z-index: -1;
  }
  .page-content {
    margin-left: 0;
  }
  .narrow-scrren-expand-bar.mtd-btn {
    display: inline-block;
  }
  .narrow-screen-expanded {
    width: auto;
    z-index: 1999;
  }
}
</style>
