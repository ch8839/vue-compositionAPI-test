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
      <Page>
        <router-view />
      </Page>
    </div>
    <mtd-button
      class="narrow-scrren-expand-bar"
      :class="{ expanded: isExpandWhenNarrowScreen }"
      @click="isExpandWhenNarrowScreen = !isExpandWhenNarrowScreen"
    >
      {{ isExpandWhenNarrowScreen ? '收起' : '展开' }}
    </mtd-button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Nav from '../components/nav';
import Page from '../components/page.vue';

type Doc = { name: string; path: string } | { name: string; href: string };

const docs: Doc[] = [
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
    href: "https://km.sankuai.com/collabpage/1623493022",
  },
];

export default defineComponent({
  name: 'DocsPage',
  components: {
    Nav,
    Page,
  },
  inject: {
    app: {
      from: 'app',
    },
  },
  data() {
    return {
      docs,
      isExpandWhenNarrowScreen: false,
    };
  },
  computed: {
    hideSidebar(): boolean {
      return ((this as any).app as any).hideSidebar;
    },
  },
});
</script>

<style lang="scss">
// use page component scss
</style>
