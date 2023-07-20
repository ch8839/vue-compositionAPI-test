<template>
  <transition name="moveup">
    <header class="header">
      <div class="header-nav">
        <ul class="nav-list">
          <li class="nav-list-item">
            <mtd-dropdown>
              <div class="btn-version">
                <span style="margin-right: 4px">Vue 3.x</span>
                <i class="mtdicon mtdicon-down" />
              </div>
              <template #dropdown>
                <mtd-dropdown-menu>
                  <mtd-dropdown-menu-item
                    v-for="t in versions"
                    :key="t.text"
                    @click="goVersion(t)"
                  >
                    {{ t.text }}
                  </mtd-dropdown-menu-item>
                </mtd-dropdown-menu>
              </template>
            </mtd-dropdown>
          </li>
          <li class="nav-list-item">
            <mtd-dropdown>
              <div class="btn-theme">
                <span style="margin-right: 4px">{{ theme.text }}</span>
                <i class="mtdicon mtdicon-down" />
              </div>
              <template #dropdown>
                <mtd-dropdown-menu>
                  <mtd-dropdown-menu-item
                    v-for="t in themes"
                    :key="t.text"
                    @click="setTheme(t)"
                  >
                    {{ t.text }}
                  </mtd-dropdown-menu-item>
                </mtd-dropdown-menu>
              </template>
            </mtd-dropdown>
          </li>
          <li class="nav-list-item">
            <a
              href="https://tt.sankuai.com/ticket/create?cid=112&tid=2189&iid=9445"
              taget="_blank"
              >反馈</a
            >
            <!-- eslint-disable-line max-len -->
          </li>
          <li class="nav-list-item">
            <router-link to="/components">组件</router-link>
          </li>
          <li class="nav-list-item">
            <router-link to="/resource">资源</router-link>
          </li>
          <li class="nav-list-item">
            <a
              href="http://dev.sankuai.com/code/repo-detail/SS/mtd-vue-next/file/list?codeArea=bj"
              target="_blank"
              >代码仓库</a
            >
            <!-- eslint-disable-line max-len -->
          </li>
        </ul>
      </div>
    </header>
  </transition>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

interface Version {
  text: string;
  href: string;
}
export default defineComponent({
  name: 'Header',
  props: ['themes', 'theme'],
  emits: ['update:theme'],
  data() {
    return {
      versions: [
        {
          text: 'Vue 3.x',
          href: '/mtd/vue-next',
        },
        {
          text: 'Vue 2.x',
          href: '/mtd/vue',
        },
      ] as Version[],
    };
  },
  methods: {
    setTheme(theme: string) {
      this.$emit('update:theme', theme);
    },
    goVersion(version: Version) {
      window.location.href = version.href;
    },
  },
});
</script>
<style lang="scss" scoped>
.btn-version,
.btn-theme {
  cursor: pointer;
  span {
    color: #1f1f1f;
  }
  i {
    color: rgba(0, 0, 0, 0.36);
  }
}
</style>
