<template>
  <div>
    <fade-transition>
      <div class="sidebar-mask" v-show="expand" @click="handleExpand" />
    </fade-transition>
    <div class="sidebar-content">
      <div
        class="sidebar"
        :class="{
          hideTopNav: hideTopNav,
        }"
      >
        <div class="sidebar-logo" v-show="!hideTopNav">
          <a class="nav-brand">
            <img
              :src="require('../assets/logo-full.png')"
              style="width: 120px;"
            />
          </a>
        </div>
        <div class="sidebar-nav-wrap" v-if="showNav">
          <ul class="sidebar-nav">
            <li class="sidebar-nav-item">
              <router-link to="/doc/getting-started" class="sidebar-nav-title">
                快速上手
              </router-link>
            </li>
            <li class="sidebar-nav-item">
              <router-link to="/doc/customize-theme" class="sidebar-nav-title">
                定制主题
              </router-link>
            </li>
            <li class="sidebar-nav-item">
              <router-link to="/doc/compatibility" class="sidebar-nav-title">
                兼容性
              </router-link>
            </li>
            <li class="sidebar-nav-item">
              <a
                href="https://km.sankuai.com/page/18329665"
                class="sidebar-nav-title"
                target="_blank"
              >
                贡献指南
              </a>
            </li>
            <li class="sidebar-nav-item">
              <router-link to="/contributor" class="sidebar-nav-title">
                贡献者
              </router-link>
            </li>
            <li class="sidebar-nav-item">
              <router-link to="/doc/changelog" class="sidebar-nav-title">
                更新日志
              </router-link>
            </li>
            <li class="sidebar-nav-item components-wrap">
              <div class="sidebar-nav-title">
                组件 / Components
              </div>
              <fade-transition>
                <div>
                  <template v-if="!expand">
                    <div
                      class="sidebar-bar-nav-content"
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
                              query: route.query,
                            }"
                          >
                            {{
                              item.cnName
                                ? `${item.name} / ${item.cnName}`
                                : item.name
                            }}
                          </router-link>
                        </li>
                      </ul>
                    </div>
                  </template>
                  <!-- <div v-else>
                  <flat-component :navs="navs" />
                </div> -->
                </div>
              </fade-transition>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed, toRefs, ref } from 'vue';
import { useRoute } from 'vue-router';
import fadeTransition from './fade-transition.vue';
import { navs, components } from '../const';

export default defineComponent({
  name: 'sidebar',
  components: {
    fadeTransition,
  },
  props: ['showNav', 'expand'],
  setup(prop) {
    const route = useRoute();
    const expand = ref(false);
    const hideTopNav = computed(() => route.query.hideTopNav === 'true');
    return {
      route,
      hideTopNav,
      expand,
      navs,
      components,
    };
  },
});
</script>
