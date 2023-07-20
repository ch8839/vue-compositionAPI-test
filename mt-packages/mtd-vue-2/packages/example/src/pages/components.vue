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
          <div class="sidebar-search-wrap">
            <search-input :components="components" />
          </div>
          <div class="sidebar-navs">
            <ul class="sidebar-nav">
              <li
                class="sidebar-nav-item"
                v-for="(group, index) in navs"
                :key="index"
              >
                <div class="sidebar-nav-item-text" v-if="group.groupName">
                  {{ group.groupName }}
                </div>
                <ul class="sidebar-nest-nav" v-if="group.list">
                  <li
                    class="sidebar-nest-nav-item"
                    v-for="item in group.list"
                    :key="item.path"
                  >
                      <router-link
                        :to="{
                          path: `/components/${item.path}`,
                          query: $route.query,
                        }"
                      >
                        <mtd-badge value="new" v-if="item.isNew">
                          {{
                            item.cnName
                              ? `${item.name} / ${item.cnName}`
                              : item.name
                          }}
                        </mtd-badge>
                        <span value="new" v-else>
                          {{
                            item.cnName
                              ? `${item.name} / ${item.cnName}`
                              : item.name
                          }}
                        </span>
                      </router-link>
                  </li>
                </ul>
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
      <Page>
        <router-view />
        <page-turn :navs="navs" />
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
import searchInput from '../components/search-input.vue'
// import flatComponent from '../components/flat-component.vue';
// import fadeTransition from '../components/fade-transition.vue';
import pageTurn from "../components/page-turn.vue"

import navConfig from "../nav.config.json"

function getComponentNav(navs) {
  return navs.find((nav) => nav.path === "/components")
}

export default {
  name: "ComponentsPage",
  components: {
    Nav,
    Page,
    searchInput,
    // flatComponent,
    // fadeTransition,
    pageTurn,
  },
  inject: {
    app: "app",
  },
  data() {
    const navs = getComponentNav(navConfig).groups
    navs.forEach((nav) => {
      nav.list = nav.list.sort((a, b) => {
        return a.name > b.name ? 1 : -1
      })
    })
    const components = navs
      .reduce((com, nav) => {
        com = com.concat(nav.list)
        return com
      }, [])
      .sort((a, b) => {
        return a.name > b.name ? 1 : -1
      })

    return {
      navs: navs,
      components,
      isExpandWhenNarrowScreen: false,
    }
  },
  computed: {
    hideSidebar() {
      return this.app.hideSidebar
    },
  },
}
</script>
