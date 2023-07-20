<template>
  <div
    class="app"
    :class="{
      'hide-top-nav': hideTopNav,
      'exist-announcement': !hideAnnouncement,
    }"
    ref="scroll"
  >
    <Announcement v-if="!hideAnnouncement" @close="handleCloseAnnouncement" />
    <router-view />
  </div>
</template>
<script>
import dom from "./utils/dom"
import { setLink } from "./utils/style"
import eventhub from "./utils/eventhub"
import Vue from "vue"
import Submenu from "./components/submenu.vue"
import Announcement from './components/announcement.vue'

function parseSearch(search) {
  if (!search) return {}
  return search
    .substr(1)
    .split("&")
    .reduce((state, str) => {
      const [key, value] = str.split("=")
      state[key] = value
      return state
    }, {})
}

const AnnouncementSymbol = '@ss/mtd-vue2_notice_20230404'

export default {
  name: "App",
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
      hideSidebar: query.hideSidebar === "true",
      hideTopNav: query.hideTopNav === "true",
      hideAnnouncement: false,
    }
  },
  computed: {
    theme() {
      return this.submenu ? this.submenu.theme : ""
    },
  },
  watch: {
    $route: {
      immediate: true,
      handler(n, v) {
        const routes = [...this.$route.matched]
        const navbarRoute = routes.reverse().find((route) => route.meta.navbar)
        if (navbarRoute && window.MTD_Frame) {
          window.MTD_Frame.update("mtd_update:tab", navbarRoute.meta.navbar)
        }

        // sync to submenu
        if (this.submenu) {
          this.submenu.route = n
        }
        if (!v || v.name !== n.name) {
          // window.LXAnalytics(
          //   "pageView",
          //   {
          //     custom: {
          //       name: n.name,
          //     },
          //   },
          //   null,
          //   "c_techportal_k457sylz",
          // )
        }
      },
    },
    "$route.query": {
      handler() {
        this.hideTopNav = this.$route.query.hideTopNav === "true"
        this.hideSidebar = this.$route.query.hideSidebar === "true"
      },
    },
    hideTopNav: {
      immediate: true,
      handler(value) {
        window.MTD_Frame && window.MTD_Frame.update("mtd_update:nav", !value)
      },
    },
  },
  created() {
    this.hideAnnouncement = !!localStorage.getItem(AnnouncementSymbol)
    window.MTD_Frame &&
      window.MTD_Frame.mountSlot("subbar-slot", (dom) => {
        const SubmenuConstructor = Vue.extend(Submenu)
        const instance = new SubmenuConstructor({
          data: {
            route: this.$route,
            $router: this.$router,
          },
        })
        instance.$mount(dom)
        this.submenu = instance
      })
  },
  mounted() {
    this.emitScroll = dom.throttle(() => {
      eventhub.emit("check-scroll")
    }, 100)
    dom.on(this.$refs.scroll, "scroll", this.emitScroll)

    this.handleRouterChange = () => {
      /* if (this.$route.name === "sidebar-example") {
        return;
      }
      this.$refs.scroll.scrollTop = 0; */
    }
    eventhub.on("change-router", this.handleRouterChange)

    // use in theme tools
    window.addEventListener(
      "message",
      (event) => {
        // if (!event.origin.includes('sankuai.com')) {
        //   return;
        // }
        if (event.data && event.data.name === "themeStyleURL") {
          const url = event.data.value
          setLink(url)
        }
      },
      false,
    )

    this.listenFrameTabChange()
  },
  beforeDestroy() {
    dom.off(this.$refs.scroll, "scroll", this.emitScroll)
    eventhub.off("change-router", this.handleRouterChange)
  },
  methods: {
    listenFrameTabChange() {
      window.MTD_Frame &&
        window.MTD_Frame.on("mtd_change:tab", (value) => {
          if (value === "code") {
            return
          }
          this.$router.push("/" + value)
        })
    },
    handleThemeChange(theme) {
      this.theme = theme
    },
    handleCloseAnnouncement () {
      this.hideAnnouncement = true
      localStorage.setItem(AnnouncementSymbol, true)
    },
  },
}
</script>
<style lang="scss">
@import "./styles/var.scss";
.app {
  height: 100vh;
  padding-top: $header-height;
  overflow: auto;
  overflow-x: hidden;
}
.hide-top-nav {
  padding-top: 0;
}
// reset
// ::-webkit-scrollbar{
//   background-color: transparent;
//   z-index: 11;
//   &:horizontal{
//     height: 6px;
//   }
//   // &:vertical{
//     width: 6px;
//   // }
//   &-thumb {
//     background-color: $color-line-2;
//     border-radius: 1px;
//   }

//   &-corner {
//     background: transparent;
//   }

//   &-track {
//     background: transparent;

//     &-piece {
//       background: transparent;
//       width: 6px;
//     }
//   }
// }
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

  margin-bottom: 32px;
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

.page-content{
  margin-left: $sidebar-width;
}
.exist-announcement{
  .aside{
    top: $header-height + $announcement-height;
  }
  .page-content{
    position: relative;
    top: $announcement-height;
  }
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
}
.sidebar-search-wrap {
  width: 100%;
  flex: 0 0 auto;
  padding: 12px 20px;
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
