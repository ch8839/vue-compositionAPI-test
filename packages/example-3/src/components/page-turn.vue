<template>
  <div class="page-turn">
    <div class="page-turn-item page-prev" v-show="prev" @click="goPrev">
      <i class="mtdicon mtdicon-arrow-left" />
      <span>{{ prev }}</span>
    </div>
    <div class="page-turn-item page-next" v-show="next" @click="goNext">
      <span>{{ next }}</span>
      <i class="mtdicon mtdicon-arrow-right" />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    navs: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    const components: any[] = this.navs.reduce((com: any[], nav: any) => {
      com = com.concat(nav.list)
      return com
    }, [])
    return {
      components,
      len: components.length,
    }
  },
  computed: {
    currentIndex() {
      if ((this as any).$route.name) {
        for (let i = 0; i < this.len; i++) {
          if ((this as any).$route.name === this.components[i].name) {
            return i
          }
        }
      }
      return undefined
    },
    prev(): string | undefined {
      if (this.currentIndex) {
        const prev = this.components[this.currentIndex! - 1]
        return prev && prev.cnName
          ? `${prev.cnName} / ${prev.name}`
          : prev.name
      }
      return undefined
    },
    next(): string | undefined {
      if (this.currentIndex! < this.len - 1) {
        const next = this.components[this.currentIndex! + 1]
        return next && next.cnName
          ? `${next.cnName} / ${next.name}`
          : next.name
      }
      return undefined
    },
  },
  methods: {
    goPrev() {
      (this as any).$router.push(this.components[this.currentIndex! - 1].path)
    },
    goNext() {
      (this as any).$router.push(this.components[this.currentIndex! + 1].path)
    },
  },
})
</script>
<style lang="scss">
@import "@components/theme-chalk/common/var.scss";
$width: 44px;
.page-turn {
  %ic {
    display: inline-block;
    width: $width;
    height: $width;
    line-height: $width;
    border-radius: calc($width / 2);
    background: #f1f6ff;
    font-size: 20px;
    text-align: center;
    color: #4e73ff;
    font-weight: $font-weight-bold;
    // transition: text-indent .2s ease;
  }
  .page-turn-item {
    height: $width;
    line-height: $width;
    cursor: pointer;
    span {
      vertical-align: top;
      &:hover {
        color: #4e73ff;
      }
    }
  }
  .page-prev {
    float: left;
    i {
      @extend %ic;
      margin-right: 20px;
      transform: background-color linear 0.3s;
      &:hover {
        background-color: #e8effc;
      }
    }
  }
  .page-next {
    float: right;
    i {
      @extend %ic;
      margin-left: 20px;
      transform: background-color linear 0.3s;
      &:hover {
        background-color: #e8effc;
      }
    }
    &::before {
      display: none;
    }
  }
  &::before,
  &::after {
    content: '';
    display: table;
  }
  &::after {
    clear: both;
  }
}
</style>
