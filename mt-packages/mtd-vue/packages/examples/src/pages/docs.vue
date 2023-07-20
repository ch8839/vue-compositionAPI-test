<template>
  <div class="container">
    <div
      class="aside"
      :class="{
        'narrow-screen-expanded': isExpandWhenNarrowScreen,
      }"
      v-show="!hideSidebar"
    >
      <div class="sidebar">
        <div class="sidebar-content">
          <div class="sidebar-navs">
            <ul class="sidebar-nav">
              <li
                class="sidebar-nav-item"
                v-for="(doc, index) in docs"
                :key="index"
              >
                <Nav
                  :href="doc.href"
                  :route="{
                    path: doc.path,
                    query: $route.query,
                  }"
                  class="sidebar-nav-title"
                >
                  {{ doc.name }}
                </Nav>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div
      class="page-content"
      :class="{
        'no-sidebar': hideSidebar,
      }"
    >
      <Page :class="`page-${$route.name}`">
        <router-view />
      </Page>
    </div>
    <mtd-button
      class="narrow-scrren-expand-bar"
      :class="{ expanded: isExpandWhenNarrowScreen }"
      @click="isExpandWhenNarrowScreen = !isExpandWhenNarrowScreen"
    >
      {{ isExpandWhenNarrowScreen ? "收起" : "展开" }}
    </mtd-button>
  </div>
</template>

<script>
import Nav from "../components/nav"
import Page from "../components/page"

const docs = [
  {
    name: "快速上手",
    path: "/doc/getting-started",
  },
  {
    name: "定制主题",
    path: "/doc/customize-theme",
  },
  {
    name: "更新日志",
    path: "/doc/changelog",
  },
  {
    name: "详细接入指南 🧭",
    href: "https://km.sankuai.com/collabpage/1393741062",
  },
  /* {
    name: "代码仓库",
    // eslint-disable-next-line max-len
    href: "https://dev.sankuai.com/code/repo-detail/ss/mtd-vue-next/file/list?branch=refs%2Fheads%2Ffeature%2Fmtd3.0-init",
  }, */
  /*   {
    name: "兼容性",
    path: "/doc/compatibility",
  },
  {
    name: "贡献指南",
    href: "https://km.sankuai.com/page/18329665",
  },
  {
    name: "贡献者",
    href: "https://km.sankuai.com/page/142074611",
  },
  {
    name: "常见问题",
    href: "https://km.sankuai.com/page/298249584",
  },
  {
    name: "更新日志",
    path: "/doc/changelog",
  }, */
]

export default {
  name: "DocsPage",
  components: {
    Nav,
    Page,
  },
  inject: {
    app: "app",
  },
  data() {
    return {
      docs,
      isExpandWhenNarrowScreen: false,
    }
  },
  computed: {
    hideSidebar() {
      return this.app.hideSidebar
    },
  },
  methods: {},
}
</script>

<style lang="scss">
// use page component scss
</style>
