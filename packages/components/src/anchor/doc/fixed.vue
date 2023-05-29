<template>
  <div class="demo-full-width">
    <div class="anchor-wrap">
      <mtd-anchor
        class="demo-fixed-anchor"
        container=".app"
        :offset-top="100"
        :scroll-offset="100"
        @select="handleSelect"
        @change="handleChange">
        <mtd-anchor-link
          href="#demo-fixed-anchor-1"
          title="位置一">
          <mtd-anchor-link
            href="#demo-fixed-anchor-2"
            title="位置二" />
          <mtd-anchor-link
            href="#demo-fixed-anchor-3"
            title="位置三" />
        </mtd-anchor-link>
        <mtd-anchor-link
          href="#demo-fixed-anchor-4"
          title="位置四" />
        <mtd-anchor-link
          href="#demo-fixed-anchor-5"
          title="位置五" />
      </mtd-anchor>
      <ul class="content-wrap" id="containerWrap">
        <li v-for="item in 10" :key="item" :id="`demo-fixed-anchor-${item}`">
          位置 {{ item }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script >
export default {
  data () {
    return {
      linkList: [
        {title: 'fixed6', href: '#fixed6'},
        {title: 'fixed10', href: '#fixed10'},
        {title: 'fixed18', href: '#fixed18'},
      ],
    };
  },
  methods: {
    handleSelect (...args) {
      console.log(args);
    },
    handleChange (...args) {
      console.log(args);
    },
  },
};
</script>

<style lang="scss" scoped>
  .anchor-wrap {
    .content-wrap{
      flex: 1;
      li {
        list-style: none;
        height: 100px;
      }
    }
    .title-wrap {
      width: 200px;
      height: 400px;
    }
  }
</style>
