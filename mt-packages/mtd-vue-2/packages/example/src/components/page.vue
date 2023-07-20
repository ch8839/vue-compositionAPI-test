<template>
  <div class="page-mk">
    <div class="mk-content"><slot /></div>
    <ex-an-click v-if="htitles.length" :usedata="htitles" />
    <hr class="bottom-divider">
  </div>
</template>

<script>
import ExAnClick from "./anclick.vue"
// import { scrollTop } from '@utils/util'; // 🤡

function getTitle(element) {
  return element.innerText.split("\n")[0].replace("#", "").trim()
}

function getHref(element) {
  const a = element.querySelector("a")
  return a.href ? "#" + a.href.split("#")[1] : ""
}

export default {
  components: {
    ExAnClick,
  },
  data() {
    return {
      htitles: [],
    }
  },
  computed: {
    key() {
      return this.$route.name
    },
  },
  watch: {
    $route: {
      immediate: true,
      handler() {
        this.$nextTick(() => {
          const result = this.obtaintitles()
          this.htitles = result
          this.scrollToAnchor()
        })
      },
    },
  },
  methods: {
    obtaintitles() {
      const h2nodes = document.querySelectorAll(".mk-content section > h2")
      const h3nodes = document.querySelectorAll(".mk-content section h3")
      const section = document.querySelector(".mk-content section")
      const anchors = []
      const sectionChild = section ? [...section.children] : []
      const h2Index = []
      for (let i = 0; i < h2nodes.length; i++) {
        const h2 = h2nodes[i]
        const href = getHref(h2)
        if (!href) {
          continue
        }
        const childdata = {
          title: getTitle(h2),
          href: href,
          children: [],
        }
        h2Index.push(sectionChild.indexOf(h2))
        anchors.push(childdata)
      }
      let now = 0
      for (let j = 0; j < h3nodes.length; j++) {
        const h3 = h3nodes[j]
        const item = {
          title: getTitle(h3),
        }
        if (h3.children.length !== 0) {
          item.href = getHref(h3)
          let index = sectionChild.indexOf(h3)
          if (index === -1) {
            let parent = h3.parentElement

            while ((index = sectionChild.indexOf(parent)) === -1) {
              parent = parent.parentElement
            }
          }
          if (index > -1) {
            while (index > h2Index[now + 1]) {
              now = now + 1
            }
            const h2 = anchors[now]
            if (h2) {
              h2.children.push(item)
            }
          }
        }
      }
      return anchors
    },

    scrollToAnchor() {
      const hash = this.$route.hash
      if (hash) {
        const el = document.getElementById(hash.substr(1))
        if (el) {
          //const top = el.offsetTop
          //const scroll = document.scrollingElement
          //const offset = 60 // header height;
          //const to = top - offset
          // scrollTop(scroll, scroll.scrollTop, to); 🤡
        }
      }
    },
  },
}
</script>

<style lang="scss">
@import "../styles/page.scss";

</style>
