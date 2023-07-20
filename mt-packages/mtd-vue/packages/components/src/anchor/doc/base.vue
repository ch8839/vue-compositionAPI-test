<template>
  <div class="demo-full-width">
    <div class="anchor-wrap">
      <ul class="content-wrap" id="demo-base-anchor-containter">
        <li v-for="item in 4" :key="item" :id="`demo-base-anchor-${item}`">
          位置{{ item }}
        </li>
      </ul>
      <mtd-anchor class="title-wrap"
        :offset-top="10" :affix="false"
        container="#demo-base-anchor-containter">
        <mtd-anchor-link
          v-for="link in linkList"
          :href="link.href"
          :title="link.title"
          :key="link.href" />
      </mtd-anchor>
    </div>
  </div>
</template>

<script >
export default {
  data () {
    return {
      linkList: [
        {title: '位置一', href: '#demo-base-anchor-1'},
        {title: '位置二', href: '#demo-base-anchor-2'},
        {title: '位置三', href: '#demo-base-anchor-3'},
        {title: '位置四', href: '#demo-base-anchor-4'},
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
  .anchor-wrap {
    position: relative;
    .content-wrap{
      height: 200px;
      overflow-y: auto;
      li {
        list-style: none;
        height: 100px;
      }
    }
    .title-wrap {
      position: absolute;
      top: 0px;
      right: 100px;
    }
  }
</style>
