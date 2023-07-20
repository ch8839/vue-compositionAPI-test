<template>
  <mtd-list 
    :loading="loading" 
    style="height: 160px; overflow:auto" 
    ref="listRef"
  >
    <mtd-list-item
      v-for="(item, index) in data"
      :key="index">
      <div class="demo-content">
        <img class="demo-content-avatar" :src="item.avatar">
        <div class="demo-content-main">
          <div class="demo-content-title">{{ `menber` + index }}</div>
        </div>
      </div>
    </mtd-list-item>
  </mtd-list>
</template>
<script>
export default {
  data () {
    return {
      loading: false,
      data: new Array(5).fill({
          title: 'lilu06',
          description: '企业产品设计中心-基础研发产品设计组',
          extra: '2018.02.45',
          isEdit: false,
          avatar: require('./avatar.png'),
        }),
    };
  },
  mounted() {
    // 滚动事件记得做防抖处理
    this.$refs.listRef && this.$refs.listRef.$el.addEventListener('scroll', this.loadMoreScroll)
  },
  destroyed() {
    this.$refs.listRef && this.$refs.listRef.$el.removeEventListener('scroll', this.loadMoreScroll)
  },
  methods: {
    loadMoreScroll() {
      if(!this.loading && this.isScrollBottom(this.$refs.listRef.$el)){
        this.handleloadMore()
      }
    },
    isScrollBottom(el){
      return Math.ceil(el.scrollTop + el.clientHeight) >= el.scrollHeight
    },
    handleloadMore () {
      this.loading = true;
      setTimeout(() => {
        this.data.push(
          {
            title: 'lilu06',
            description: '企业产品设计中心-基础研发产品设计组',
            extra: '2018.02.45',
            avatar: require('./avatar.png'),
          },
        );
        this.loading = false;
      }, 2000);
    },
  },
};
</script>
