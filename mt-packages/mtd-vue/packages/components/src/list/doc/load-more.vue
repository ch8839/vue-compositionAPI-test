<template>
  <mtd-list :loading="loading">
    <mtd-list-item
      v-for="(item, index) in data"
      :key="index">
      <div class="demo-content">
        <img class="demo-content-avatar" :src="item.avatar">
        <div class="demo-content-main">
          <div class="demo-content-title">{{ item.title }}</div>
        </div>
      </div>
    </mtd-list-item>
    <div slot="loadMore" @click="handleloadMore" class="demo-more">加载更多</div>
  </mtd-list>
</template>
<script>
export default {
  data () {
    return {
      loading: false,
      data: [
        {
          title: 'lilu06',
          description: '企业产品设计中心-基础研发产品设计组',
          extra: '2018.02.45',
          isEdit: false,
          avatar: require('./avatar.png'),
        },
        {
          title: 'lilu06',
          description: '企业产品设计中心-基础研发产品设计组',
          extra: '2018.02.45',
          isEdit: false,
          avatar: require('./avatar.png'),
        },
        {
          title: 'lilu06',
          description: '企业产品设计中心-基础研发产品设计组',
          extra: '2018.02.45',
          isEdit: false,
          avatar: require('./avatar.png'),
        },
      ],
    };
  },
  methods: {
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
      }, 500);
    },
  },
};
</script>
