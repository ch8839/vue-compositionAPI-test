<template>
  <div class="page-mk">
    <div class="mk-content"><slot /></div>
    <ex-an-click v-if="htitles.length" :usedata="htitles" />
    <hr class="bottom-divider">
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick } from 'vue'
import { RouteLocationNormalizedLoaded } from 'vue-router'

import ExAnClick from './anclick.vue'
import { scrollTop } from '@utils/util'

function getTitle(element: HTMLElement) {
  return element.innerText.split('\n')[0].replace('#', '').trim()
}

function getHref(element: HTMLElement) {
  const a = element.querySelector('a')
  return a && a.href ? '#' + a.href.split('#')[1] : ''
}

interface Anchor {
  title: string;
  href: string;
  children?: Anchor[];
}

export default defineComponent({
  components: {
    ExAnClick,
  },
  data() {
    return {
      htitles: [] as any[],
    }
  },
  computed: {
    key(): any {
      return (this as any).$route.name
    },
  },
  watch: {
    $route: {
      immediate: true,
      handler(
        to: RouteLocationNormalizedLoaded,
        from: RouteLocationNormalizedLoaded,
      ) {
        nextTick(() => {
          const result = this.obtaintitles()
          this.htitles = result
        })
        if (!from || to.name !== from.name) {
          (window as any).LXAnalytics(
            'pageView',
            {
              custom: {
                name: to.name,
              },
            },
            null,
            'c_techportal_0gfbvb41',
          )
        }
      },
    },
  },
  methods: {
    obtaintitles() {
      const h2nodes = document.querySelectorAll('.mk-content section > h2')
      const h3nodes = document.querySelectorAll('.mk-content section h3')
      const section = document.querySelector('.mk-content section')
      const sectionChild = section ? [...section.children] : []
      const anchors: Anchor[] = []
      const h2Index: any[] = []
      for (let i = 0; i < h2nodes.length; i++) {
        const h2 = h2nodes[i] as HTMLElement
        const href = getHref(h2)
        if (!href) {
          continue
        }
        const childdata: Anchor = {
          title: getTitle(h2),
          href: href,
          children: [],
        }
        h2Index.push(sectionChild.indexOf(h2))
        anchors.push(childdata)
      }
      let now = 0
      for (let j = 0; j < h3nodes.length; j++) {
        const h3 = h3nodes[j] as HTMLElement
        const item: Anchor = {
          title: getTitle(h3),
          href: '',
        }
        if (h3.children.length !== 0) {
          item.href = getHref(h3)
          let index = sectionChild.indexOf(h3)
          if (index === -1) {
            let parent = h3.parentElement
            while ((index = sectionChild.indexOf(parent!)) === -1) {
              parent = parent!.parentElement
            }
          }
          if (index > -1) {
            while (index > h2Index[now + 1]) {
              now = now + 1
            }
            const h2 = anchors[now]
            if (h2) {
              h2.children!.push(item)
            }
          }
        }
      }
      return anchors
    },

    scrollToAnchor() {
      const hash = (this as any).$route.hash
      if (hash) {
        const el = document.getElementById(hash.substr(1))
        if (el) {
          const top = el.offsetTop
          const scroll = this.$refs.scroll as HTMLElement
          const offset = 60 // header height;
          const to = top - offset
          scrollTop(scroll, scroll.scrollTop, to)
        }
      }
    },
  },
})
</script>

<style lang="scss">
@import '../styles/page.scss';

</style>
